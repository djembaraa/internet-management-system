import { useState } from "react";
import { Save, Settings, Send } from "lucide-react";
import FormLabel from "../../../components/FormLabel";

// Helper for toggle switch
function ToggleSwitch({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) {
  return (
    <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-700/50 cursor-pointer group hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
      <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <div className="relative shrink-0">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-9 h-5 rounded-full transition-colors ${checked ? "bg-[#155b96]" : "bg-slate-300 dark:bg-slate-600"}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform shadow-sm ${checked ? "transform translate-x-4" : ""}`}></div>
      </div>
    </label>
  );
}

export default function TelegramSettings() {
  const [formData, setFormData] = useState({
    botToken: "bot123456:ABC-DEF1234ghlkl-zyx57W2v1u123ew11",
    chatIdPppoe: "-41123456",
    chatIdTicket: "-41123456",
    chatIdVoucher: "-41123456",
    notifyPppoe: false,
    notifyTicket: false,
    notifyVoucher: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 transition-all text-[13px] text-slate-600 dark:text-slate-100 bg-white dark:bg-slate-800 font-mono";

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
               <Send size={20} className="text-[#155b96] dark:text-blue-400" />
           </div>
           <div>
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">Telegram Notification Settings</h2>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Atur bot Telegram untuk menerima log dan pemberitahuan sistem</p>
           </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: API & Chat IDs */}
            <div className="flex-1 space-y-4">
              <div>
                <FormLabel label="Bot Token API" required tooltip="Token bot Telegram didapatkan dari @BotFather." />
                <input
                  type="text"
                  name="botToken"
                  value={formData.botToken}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                 <div>
                   <FormLabel label="Chat ID (PPPoE Users Status)" required tooltip="Chat ID grup/user untuk notifikasi status PPPoE (UP/DOWN)." />
                   <input
                     type="text"
                     name="chatIdPppoe"
                     value={formData.chatIdPppoe}
                     onChange={handleChange}
                     className={inputClasses}
                     placeholder="-100123456789"
                   />
                 </div>
                 
                 <div>
                   <FormLabel label="Chat ID (Ticket Reply)" required tooltip="Chat ID grup/user untuk notifikasi balasan tiket bantuan." />
                   <input
                     type="text"
                     name="chatIdTicket"
                     value={formData.chatIdTicket}
                     onChange={handleChange}
                     className={inputClasses}
                     placeholder="-100123456789"
                   />
                 </div>

                 <div>
                   <FormLabel label="Chat ID (Voucher Login)" required tooltip="Chat ID grup/user untuk notifikasi login via voucher." />
                   <input
                     type="text"
                     name="chatIdVoucher"
                     value={formData.chatIdVoucher}
                     onChange={handleChange}
                     className={inputClasses}
                     placeholder="-100123456789"
                   />
                 </div>
              </div>
            </div>

            {/* Right Column: Toggle Settings */}
            <div className="w-full lg:w-80 shrink-0">
               <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-xl p-5 border border-slate-100 dark:border-slate-800 h-full">
                  <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Active Triggers</h3>
                  
                  <div className="space-y-3">
                     <ToggleSwitch 
                        label="Notify PPPoE Users Status" 
                        checked={formData.notifyPppoe} 
                        onChange={() => handleToggle("notifyPppoe")} 
                     />
                     <ToggleSwitch 
                        label="Notify Ticket Reply" 
                        checked={formData.notifyTicket} 
                        onChange={() => handleToggle("notifyTicket")} 
                     />
                     <ToggleSwitch 
                        label="Notify Voucher Login" 
                        checked={formData.notifyVoucher} 
                        onChange={() => handleToggle("notifyVoucher")} 
                     />
                  </div>

                  <div className="mt-5 p-3.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-lg">
                     <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold text-[#155b96] dark:text-blue-400">Tips:</span> Pastikan Bot telah dimasukkan ke dalam grup Telegram yang dituju dan memiliki akses untuk mengirim pesan.
                     </p>
                  </div>
               </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 px-6 py-2.5 rounded-lg text-[13px] font-medium transition-colors w-full sm:w-auto">
              <Settings size={16} /> Test Connection
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-6 py-2.5 rounded-lg text-[13px] font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-full sm:w-auto">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}