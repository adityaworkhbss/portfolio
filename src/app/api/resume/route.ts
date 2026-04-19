import { NextRequest, NextResponse } from "next/server";

/**
 * API routes for resume PDF access.
 *
 * Cloudinary blocks direct .pdf file delivery on this account,
 * but the Admin API and image transformations work.
 *
 * GET /api/resume?url=<cloudinary-url>&download=true  → Downloads the PDF via generate_archive
 * GET /api/resume?url=<cloudinary-url>&pages=true     → Returns the page count as JSON
 * GET /api/resume?url=<cloudinary-url>                → Returns page count (default)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");
  const download = searchParams.get("download") === "true";

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Strict URL validation to prevent SSRF
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const allowedOrigin = `https://res.cloudinary.com/${cloudName}/`;
  if (!rawUrl.startsWith(allowedOrigin)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 403 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret || !cloudName) {
    return NextResponse.json(
      { error: "Cloudinary API credentials not configured" },
      { status: 500 }
    );
  }

  const publicId = extractPublicId(rawUrl);
  if (!publicId) {
    return NextResponse.json({ error: "Could not parse Cloudinary URL" }, { status: 400 });
  }

  if (download) {
    return handleDownload(publicId, apiKey, apiSecret, cloudName);
  }

  // Default: return page info
  return handlePageInfo(publicId, apiKey, apiSecret, cloudName);
}

/**
 * Get resource info (page count) via Admin API.
 */
async function handlePageInfo(
  publicId: string,
  apiKey: string,
  apiSecret: string,
  cloudName: string
) {
  const authHeader =
    "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${encodeURIComponent(publicId)}`;

  const response = await fetch(apiUrl, {
    headers: { Authorization: authHeader },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `Admin API returned ${response.status}` },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json({
    pages: data.pages || 1,
    width: data.width,
    height: data.height,
    format: data.format,
    publicId: data.public_id,
    bytes: data.bytes,
  });
}

/**
 * Download the original PDF using Cloudinary's generate_archive API.
 * This creates a temporary archive containing the PDF, which we fetch and serve.
 */
async function handleDownload(
  publicId: string,
  apiKey: string,
  apiSecret: string,
  cloudName: string
) {
  try {
    const authHeader =
      "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    // Use generate_archive in "download" mode — returns a JSON with a download URL
    const archiveUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/generate_archive`;

    const archiveRes = await fetch(archiveUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "download",
        public_ids: [publicId],
        resource_type: "image",
        flatten_folders: true,
      }),
    });

    if (!archiveRes.ok) {
      const errBody = await archiveRes.text();
      console.error("Archive API error:", errBody);
      return NextResponse.json(
        { error: `Archive generation failed: ${archiveRes.status}` },
        { status: archiveRes.status }
      );
    }

    const contentType = archiveRes.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // "download" mode returns { url: "..." } — redirect to it
      const data = await archiveRes.json();
      if (data.url) {
        return NextResponse.redirect(data.url);
      }
    }

    // Binary response — serve directly
    const buffer = await archiveRes.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="resume.zip"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}

function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return null;
    const pathWithExt = match[1];
    const lastDot = pathWithExt.lastIndexOf(".");
    return lastDot !== -1 ? pathWithExt.substring(0, lastDot) : pathWithExt;
  } catch {
    return null;
  }
}
