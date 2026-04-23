import { NextRequest, NextResponse } from "next/server";
import { adminDb, messaging } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// ─── POST /api/contact ──────────────────────────────────
// Saves a contact message to Firestore and sends an FCM
// notification to the "new_messages" topic so that every
// subscribed Android device gets a push notification.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // ── Validation ────────────────────────────────────────
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email, and message are required." },
        { status: 400 }
      );
    }

    // ── Save to Firestore ─────────────────────────────────
    const docRef = await adminDb.collection("messages").add({
      name,
      email,
      message,
      createdAt: FieldValue.serverTimestamp(),
      read: false,
    });

    // ── Send FCM notification to topic ────────────────────
    // All Android devices that subscribe to "new_messages"
    // will receive this push notification.
    try {
      await messaging.send({
        topic: "new_messages",
        notification: {
          title: `New Message from "${name}"`,
          body: email,
        },
        data: {
          // Extra payload the Android app can read
          messageId: docRef.id,
          senderName: name,
          senderEmail: email,
          click_action: "OPEN_MESSAGES",
        },
        android: {
          priority: "high",
          notification: {
            channelId: "portfolio_messages",
            icon: "ic_notification",
            color: "#6366f1",
            sound: "default",
          },
        },
      });
      console.log(`[FCM] Notification sent for message ${docRef.id}`);
    } catch (fcmError) {
      // Don't fail the request if FCM fails — the message is already saved
      console.error("[FCM] Failed to send notification:", fcmError);
    }

    return NextResponse.json(
      { success: true, id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /contact] Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
