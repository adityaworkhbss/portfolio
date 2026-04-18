"use client";

import { useEffect, useState } from "react";
import { Trash2, MailOpen, Mail } from "lucide-react";
import { getContactMessages, deleteContactMessage, updateContactMessage } from "@/lib/firebase/firestore";
import type { ContactMessage } from "@/lib/types";
import toast from "react-hot-toast";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const data = await getContactMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteContactMessage(id);
      toast.success("Message deleted");
      fetchMessages();
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const toggleReadStatus = async (msg: ContactMessage) => {
    try {
      await updateContactMessage(msg.id!, { read: !msg.read });
      fetchMessages();
    } catch {
      toast.error("Status update failed");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Inbox</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20">
          <Mail className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
          <p className="text-zinc-500">Inbox is empty. No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`relative p-5 rounded-xl border transition-colors ${
                msg.read
                  ? "bg-white/[0.01] border-white/5"
                  : "bg-white/[0.04] border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.03)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-base font-medium ${msg.read ? "text-zinc-300" : "text-white"}`}>
                      {msg.name}
                    </h3>
                    {!msg.read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        NEW
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-[var(--accent)] hover:underline inline-block mb-3"
                  >
                    {msg.email}
                  </a>
                  <p className={`text-sm leading-relaxed ${msg.read ? "text-zinc-500" : "text-zinc-300"}`}>
                    {msg.message}
                  </p>
                  <p className="text-xs text-zinc-600 mt-4 mono">
                    {formatDate(msg.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => toggleReadStatus(msg)}
                    className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    title={msg.read ? "Mark as unread" : "Mark as read"}
                  >
                    <MailOpen size={16} className={msg.read ? "opacity-50" : ""} />
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id!)}
                    className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
