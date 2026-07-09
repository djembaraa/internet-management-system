import { useState, useEffect } from "react";
import { MessageCircle, X, ChevronRight } from "lucide-react";
import { supabase } from "../services/supabase";
import TicketChatModal from "../features/ticket/components/TicketChatModal";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<{ id: string; subject: string } | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      // Admin sees all tickets, Client sees their own (RLS handles this automatically)
      const { data, error } = await supabase
        .from("tickets")
        .select("id, no_ticket, subject, subject_person")
        .order("last_update", { ascending: false })
        .limit(10);
        
      if (!error && data) {
        setTickets(data);
      }
    };

    if (isOpen) {
      fetchTickets();
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-[#155b96] hover:bg-[#0e4a7a] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 hover:-translate-y-1"
        }`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat List Panel */}
      <div
        className={`fixed bottom-6 right-6 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 z-50 flex flex-col ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 pointer-events-none translate-y-4"
        }`}
        style={{ height: '400px' }}
      >
        {/* Header */}
        <div className="bg-[#155b96] p-4 flex items-center justify-between text-white">
          <div>
            <h3 className="font-semibold text-sm">Pesan & Aduan</h3>
            <p className="text-xs text-blue-100 opacity-80">Balas tiket aktif secara langsung</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* List of Tickets */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {tickets.length === 0 ? (
            <div className="text-center text-slate-500 text-sm mt-10">
              Tidak ada aduan aktif
            </div>
          ) : (
            tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket({ id: ticket.id, subject: ticket.subject })}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors text-left"
              >
                <div className="overflow-hidden">
                  <div className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">
                    {ticket.subject}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {ticket.no_ticket} • {ticket.subject_person}
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Actual Chat Modal */}
      {selectedTicket && (
        <TicketChatModal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          ticketId={selectedTicket.id}
          ticketSubject={selectedTicket.subject}
        />
      )}
    </>
  );
}
