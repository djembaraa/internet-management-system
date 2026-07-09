import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../services/supabase";
import { useAuthStore } from "../../auth/store/authStore";
import { Send, ShieldCheck } from "lucide-react";
import Modal from "../../../components/Modal";
import { clsx } from "clsx";

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_role?: string;
  sender_name?: string;
}

export default function TicketChatModal({
  isOpen,
  onClose,
  ticketId,
  ticketSubject,
}: {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketSubject: string;
}) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchMessages();
      
      const channel = supabase
        .channel(`ticket_chat_${ticketId}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'ticket_messages',
          filter: `ticket_id=eq.${ticketId}` 
        }, () => {
          fetchMessages(); // re-fetch to get user details joined
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    // Joining with auth.users is tricky from public schema if we don't have a view.
    // Instead we join with 'profiles' table we created
    const { data, error } = await supabase
      .from("ticket_messages")
      .select("*, profiles(username, role)")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      const formatted = data.map((d: any) => ({
        id: d.id,
        ticket_id: d.ticket_id,
        sender_id: d.sender_id,
        message: d.message,
        created_at: d.created_at,
        sender_role: d.profiles?.role || "client",
        sender_name: d.profiles?.username || "Unknown",
      }));
      setMessages(formatted);
    }
    setIsLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id) return;

    const { error } = await supabase.from("ticket_messages").insert({
      ticket_id: ticketId,
      sender_id: user.id,
      message: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
      // Real-time sub will fetch the new message automatically
    } else {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket: ${ticketSubject}`}
      maxWidth="xl"
    >
      <div className="flex flex-col h-[60vh] bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden -mx-4 -mt-2 -mb-4">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-slate-400">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full flex-col text-slate-400">
              <div className="bg-slate-200 dark:bg-slate-800 p-3 rounded-full mb-2">
                <Send size={24} className="opacity-50" />
              </div>
              <p>Belum ada pesan. Mulai percakapan sekarang.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              const isAdmin = msg.sender_role === "admin" || msg.sender_role === "root";

              return (
                <div
                  key={msg.id}
                  className={clsx(
                    "flex flex-col max-w-[80%]",
                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-medium text-slate-500">
                      {isMe ? "You" : msg.sender_name}
                    </span>
                    {isAdmin && (
                      <ShieldCheck size={12} className="text-blue-500" />
                    )}
                  </div>
                  <div
                    className={clsx(
                      "px-3.5 py-2 rounded-2xl text-[13px] shadow-sm",
                      isMe
                        ? "bg-[#155b96] text-white rounded-br-sm"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 rounded-bl-sm"
                    )}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 flex gap-2 items-center"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik balasan..."
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-[13px] outline-none focus:border-[#155b96] dark:text-white"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-[#155b96] hover:bg-[#0e4a7a] text-white p-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </Modal>
  );
}
