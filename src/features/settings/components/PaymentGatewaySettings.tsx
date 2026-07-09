import { useState } from "react";
import { Save, Wallet, CreditCard, Building2, Lock, Unlock, Plus, Trash2, ShieldCheck, ArrowRightLeft, Search } from "lucide-react";
import FormLabel from "../../../components/FormLabel";

// Helper for toggle switch
function ToggleSwitch({ checked, onChange, label, icon: Icon }: { checked: boolean, onChange: () => void, label: string, icon?: React.ElementType }) {
  return (
    <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50 cursor-pointer group hover:border-slate-200 dark:hover:border-slate-600 transition-colors w-full sm:w-auto">
      <span className="flex items-center gap-2 text-[12px] font-semibold text-slate-700 dark:text-slate-200">
         {Icon && <Icon size={14} className={checked ? "text-[#155b96] dark:text-blue-400" : "text-slate-400"} />}
         {label}
      </span>
      <div className="relative shrink-0 ml-4">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? "bg-[#155b96]" : "bg-slate-300 dark:bg-slate-600"}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${checked ? "transform translate-x-4" : ""}`}></div>
      </div>
    </label>
  );
}

export default function PaymentGatewaySettings() {
  const [gateway, setGateway] = useState("moota");
  const [unlocked, setUnlocked] = useState(false);
  const [apiKey, setApiKey] = useState(
    "Y0OTAzLjI4NDYzOSwibmJmIjoxNzMyOTY0OTAzLjI4NDY0NCwiZXhwIjoxNzY0NTA" +
    "wOTAzLjI4MTMxNSwic3ViIjoiMzM4NzYiLCJzY29wZXMiOlsiYXBpIl0sImFjdCI6eyJpZCI6IjMzODc2IiwidHlwZSI6InVzZXIifX0.o8AOVEd9LKauKL-" +
    "GQYF5S3vKTC2-07Dv2BE5LeBHLr7wEcbY9bz0cOAgN-3AJNgCJKbO2fZWhznJPO"
  );

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-10">
      
      {/* ── Main Gateway Config Card ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
               <Wallet size={20} className="text-[#155b96] dark:text-blue-400" />
           </div>
           <div>
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">Payment Gateway</h2>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Atur integrasi jalur pembayaran otomatis</p>
           </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
             <div className="flex-1">
               <FormLabel label="Pilih Provider Gateway" required tooltip="Gateway yang akan memproses pembayaran invoice secara otomatis." />
               <select
                 value={gateway}
                 onChange={(e) => setGateway(e.target.value)}
                 className={inputClasses + " appearance-none cursor-pointer"}
               >
                 <option value="moota">Moota (Moota.co)</option>
                 <option value="xendit">Xendit</option>
                 <option value="midtrans">Midtrans</option>
               </select>
             </div>
             
             {/* Modern Toggle for Unlock */}
             <ToggleSwitch 
                label={unlocked ? "Config Unlocked" : "Unlock Config"} 
                checked={unlocked} 
                onChange={() => setUnlocked(!unlocked)} 
                icon={unlocked ? Unlock : Lock}
             />
          </div>

          <div>
             <div className="flex items-center justify-between mb-1.5">
                <FormLabel label="Secret API Key" required tooltip="Kunci rahasia API dari provider yang dipilih." />
                {!unlocked && <span className="text-[11px] font-medium text-amber-500">Locked (Read-Only)</span>}
             </div>
             <textarea
               value={apiKey}
               onChange={(e) => setApiKey(e.target.value)}
               disabled={!unlocked}
               rows={4}
               className={`${inputClasses} resize-none font-mono text-[12px] leading-relaxed tracking-wide ${!unlocked ? "opacity-70 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 text-slate-500" : ""}`}
             />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
            <button
              type="button"
              disabled={!unlocked}
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              <Save size={15} /> Save Changes
            </button>
        </div>
      </div>

      {/* ── Status & Banks (Grid Layout for space efficiency) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
         
         {/* Moota Summary Status */}
         <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
               <CreditCard size={16} className="text-[#155b96] dark:text-blue-400" />
               <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                 Account Summary
               </h2>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
               <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 space-y-3">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                   <span className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Owner Fullname</span>
                   <span className="text-[13px] text-slate-800 dark:text-slate-100 font-bold">John Doe</span>
                 </div>
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                   <span className="text-[13px] text-slate-800 dark:text-slate-100 font-bold">Moota User</span>
                   <span className="text-[13px] text-slate-800 dark:text-slate-100 font-medium truncate">admin@moota.co</span>
                 </div>
               </div>
            </div>
         </div>

         {/* List of Bank */}
         <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
               <Building2 size={16} className="text-[#155b96] dark:text-blue-400" />
               <h2 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                 Connected Banks
               </h2>
            </div>
            <div className="p-5 space-y-4">
              {true && (
                 <div className="text-center py-6 text-slate-400 text-[13px]">
                    No banks connected yet.
                 </div>
              )}
            </div>
         </div>
         
      </div>
    </div>
  );
}
