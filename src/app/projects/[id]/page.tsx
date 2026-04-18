import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon as Github } from "@/components/ui/Icons";
import { getProject, getProjects } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const revalidate = 3600;

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="min-h-screen pt-32 sm:pt-40 pb-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 mono text-[11.5px] tracking-wide text-zinc-500 hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft size={13} />
          BACK TO WORK
        </Link>

        <header className="mb-12">
          <p className="eyebrow mb-5">Project</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.02] max-w-3xl">
            {project.title}
          </h1>
          <p className="mt-6 text-[17px] text-zinc-400 leading-relaxed max-w-2xl">
            {project.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 h-11 pl-5 pr-4 rounded-full bg-[var(--accent)] text-zinc-950 font-medium text-[14px] hover:bg-[var(--accent-bright)] transition-colors"
              >
                View live
                <ArrowUpRight
                  size={15}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/[0.12] text-zinc-200 hover:bg-white/[0.04] hover:border-white/20 transition-colors text-[14px]"
              >
                <Github size={14} />
                Source
              </a>
            )}
          </div>
        </header>

        {project.coverImage && (
          <div className="relative aspect-[2/1] rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0c0d0f] mb-14">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-8">
            <div className="prose-blog">
              {(project.longDescription || project.description)
                .split("\n\n")
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 self-start">
            <div>
              <p className="eyebrow mb-4">Stack</p>
              <ul className="space-y-2.5">
                {project.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="flex items-center justify-between py-1.5 border-b border-white/[0.06] text-[14px] text-zinc-300"
                  >
                    <span>{tech}</span>
                    <span className="mono text-[10.5px] text-zinc-600">
                      ↗
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {(project.liveUrl || project.githubUrl) && (
              <div>
                <p className="eyebrow mb-4">Links</p>
                <div className="flex flex-col gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between py-1.5 border-b border-white/[0.06] text-[14px] text-zinc-300 hover:text-white transition-colors"
                    >
                      <span>Live site</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between py-1.5 border-b border-white/[0.06] text-[14px] text-zinc-300 hover:text-white transition-colors"
                    >
                      <span>Repository</span>
                      <Github size={13} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>

        {project.images && project.images.length > 0 && (
          <div className="mt-20">
            <p className="eyebrow mb-8">Gallery</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.06] bg-[#0c0d0f]"
                >
                  <Image
                    src={img}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
