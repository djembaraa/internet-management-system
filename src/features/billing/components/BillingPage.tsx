import { useState, useRef } from "react";
import { Save, Upload, Pencil, Settings, Receipt, BellRing, Wallet, Lock, Unlock } from "lucide-react";
import FormLabel from "../../../components/FormLabel";

function SectionTitle({ children, icon: Icon }: { children: React.ReactNode, icon: React.ElementType }) {
    return (
        <div className="flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Icon size={18} className="text-[#155b96] dark:text-blue-400" />
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {children}
            </h3>
        </div>
    );
}

function LogoUpload({
    label,
    preview,
    onChange,
    maxKb,
    id,
}: {
    label: string;
    preview: string | null;
    onChange: (f: File) => void;
    maxKb: number;
    id: string;
}) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div>
            <FormLabel label={label} required />
            <div className="flex flex-col sm:flex-row gap-3 mt-1.5">
                {/* Drop zone */}
                <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    className="w-full sm:w-40 h-28 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#155b96] hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors bg-slate-50 dark:bg-slate-800/30 group"
                >
                    <div className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:text-[#155b96] transition-colors">
                        <Upload size={16} className="text-slate-500 group-hover:text-[#155b96] dark:text-slate-400 dark:group-hover:text-blue-400" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight font-medium px-2">
                        Upload Image (Max {maxKb} Kb)<br />Click or Drop here
                    </span>
                </button>
                <input
                    ref={ref}
                    id={id}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) onChange(e.target.files[0]); }}
                />
                {/* Preview */}
                <div className="w-full sm:w-40 h-28 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 overflow-hidden shadow-sm relative">
                    {preview ? (
                        <>
                           <img src={preview} alt="preview" className="max-w-full max-h-full object-contain p-2" />
                           <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                               <Pencil size={18} className="text-white drop-shadow-md" />
                           </div>
                        </>
                    ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            No {label}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function ResizableTextarea({
    value,
    onChange,
    rows = 4,
    inputClasses,
}: {
    value: string;
    onChange: (v: string) => void;
    rows?: number;
    inputClasses: string;
}) {
    return (
        <div className="relative">
            <textarea
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={inputClasses + " resize-y pr-8 leading-relaxed"}
            />
            <Pencil size={12} className="absolute right-3 bottom-3 text-slate-400 pointer-events-none" />
        </div>
    );
}

function SaveBtn() {
    return (
        <button
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-colors shadow-sm hover:shadow-md active:scale-[0.98] w-full sm:w-auto justify-center"
        >
            <Save size={15} /> Save Changes
        </button>
    );
}

export default function BillingPage() {
    const inputClasses =
        "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";
    const selectClasses =
        "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 appearance-none transition-all";

    const [billingCycle, setBillingCycle] = useState("1");
    const [prorate, setProrate] = useState("No");
    const [penerbitanInvoice, setPenerbitanInvoice] = useState("7");
    const [jamHH, setJamHH] = useState("08");
    const [jamMM, setJamMM] = useState("00");

    const [mainLogoPreview, setMainLogoPreview] = useState<string | null>(null);
    const [sigLogoPreview, setSigLogoPreview] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState("asd");
    const [slogan, setSlogan] = useState("asd");
    const [companyAddress, setCompanyAddress] = useState("asd");
    const [companyPhone, setCompanyPhone] = useState("asd");
    const [companyWebsite, setCompanyWebsite] = useState("asd");
    const [companyEmail, setCompanyEmail] = useState("asd");
    const [defaultPaymentInstruction, setDefaultPaymentInstruction] = useState("asd");
    const [defaultPaymentMemo, setDefaultPaymentMemo] = useState("asd");
    const [signatureName, setSignatureName] = useState("asd");

    const [unpaidMsg, setUnpaidMsg] = useState(
        "Pelanggan yang terhormat, anda memiliki invoice yang belum terbayarkan dengan nomor invoice @serial. Berikut kami sampaikan lampiran invoicenya, terimakasih"
    );
    const [paidMsg, setPaidMsg] = useState(
        "Terimakasih telah melakukan pembayaran pada invoice @serial"
    );
    const [outstandingMsg, setOutstandingMsg] = useState(
        "Pelanggan yang terhormat, anda memiliki outstanding pada invoice @serial"
    );
    const [outstandingPaidMsg, setOutstandingPaidMsg] = useState(
        "Terimakasih telah melakukan pembayaran outstanding pada invoice @serial"
    );
    const [reminderMsg, setReminderMsg] = useState(
        "Pelanggan yang terhormat, anda memiliki tagihan yang belum terbayarkan. Mohon lakukan pembayaran sebelum tanggal @expired untuk menghindari isolir"
    );

    const [paymentGateway, setPaymentGateway] = useState("Off");
    const [unlockGateway, setUnlockGateway] = useState(false);

    function handleLogoFile(file: File, setPreview: (s: string) => void) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }

    const gatewayOptions = ["Off", "Midtrans", "Xendit", "Duitku"];

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-100">
                        Billing Control Settings
                    </h2>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Konfigurasi dasar tagihan, payment gateway, invoice, dan notifikasi otomatis.</p>
                </div>

                <div className="p-6 sm:p-8 space-y-12">
                    
                    {/* Payment Period Section */}
                    <section>
                        <SectionTitle icon={Settings}>Payment Period</SectionTitle>
                        <div className="space-y-5 pl-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <FormLabel label="Billing Cycle (Bulan)" required />
                                    <input
                                        type="number"
                                        min={1}
                                        value={billingCycle}
                                        onChange={(e) => setBillingCycle(e.target.value)}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <FormLabel label="Perhitungan Prorate" required />
                                    <select value={prorate} onChange={(e) => setProrate(e.target.value)} className={selectClasses}>
                                        <option>No</option>
                                        <option>Yes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <FormLabel label="Penerbitan Invoice (H-)" required />
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                                        Diterbitkan (1-7 hari) Sebelum Jatuh Tempo
                                    </p>
                                    <input
                                        type="number"
                                        min={1}
                                        max={7}
                                        value={penerbitanInvoice}
                                        onChange={(e) => setPenerbitanInvoice(e.target.value)}
                                        className={inputClasses}
                                    />
                                </div>

                                <div>
                                    <FormLabel label="Jam Penerbitan Invoice" required />
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                                        Format Penulisan 24 Jam (HH:MM)
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={0}
                                            max={23}
                                            value={jamHH}
                                            onChange={(e) => setJamHH(e.target.value.padStart(2, "0"))}
                                            className={inputClasses + " text-center"}
                                            placeholder="08"
                                        />
                                        <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">:</span>
                                        <input
                                            type="number"
                                            min={0}
                                            max={59}
                                            value={jamMM}
                                            onChange={(e) => setJamMM(e.target.value.padStart(2, "0"))}
                                            className={inputClasses + " text-center"}
                                            placeholder="00"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                               <SaveBtn />
                            </div>
                        </div>
                    </section>

                    {/* Payment Gateway Section (Moved into Main Flow) */}
                    <section>
                        <SectionTitle icon={Wallet}>Payment Gateway Integration</SectionTitle>
                        <div className="pl-1 space-y-5">
                            
                            {/* Modern Pill Buttons for Selection */}
                            <div>
                               <div className="flex items-center justify-between mb-3">
                                  <FormLabel label="Active Payment Gateway" required />
                                  <button
                                     type="button"
                                     onClick={() => setUnlockGateway(!unlockGateway)}
                                     className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                                        unlockGateway 
                                        ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100" 
                                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
                                     }`}
                                  >
                                     {unlockGateway ? <Unlock size={12} /> : <Lock size={12} />}
                                     {unlockGateway ? "Unlocked" : "Unlock Config"}
                                  </button>
                               </div>

                               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                  {gatewayOptions.map((gw) => {
                                      const isActive = paymentGateway === gw;
                                      return (
                                        <button
                                            key={gw}
                                            type="button"
                                            disabled={!unlockGateway}
                                            onClick={() => setPaymentGateway(gw)}
                                            className={`py-3 px-4 rounded-xl border text-[13px] font-semibold transition-all duration-200 ${
                                                isActive
                                                ? "bg-[#155b96] border-[#155b96] text-white shadow-md transform scale-[1.02]"
                                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#155b96]/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
                                            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:scale-100`}
                                        >
                                            {gw}
                                        </button>
                                      )
                                  })}
                               </div>
                            </div>

                            {unlockGateway && paymentGateway !== "Off" && (
                               <div className="p-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                                  <p className="text-[12px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                                     <span className="font-bold">Perhatian:</span> Mengubah gateway pembayaran dapat mempengaruhi proses transaksi yang sedang berjalan.
                                  </p>
                               </div>
                            )}

                            <div className="flex justify-end pt-2">
                               <SaveBtn />
                            </div>
                        </div>
                    </section>

                    {/* Invoice Design & Info Section */}
                    <section>
                        <SectionTitle icon={Receipt}>Invoice Design & Info</SectionTitle>
                        <div className="space-y-6 pl-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <LogoUpload
                                    id="main-logo"
                                    label="Main Company Logo"
                                    preview={mainLogoPreview}
                                    onChange={(f) => handleLogoFile(f, setMainLogoPreview)}
                                    maxKb={1024}
                                />
                                <LogoUpload
                                    id="sig-logo"
                                    label="Signature Stamp/Logo"
                                    preview={sigLogoPreview}
                                    onChange={(f) => handleLogoFile(f, setSigLogoPreview)}
                                    maxKb={512}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <FormLabel label="Company Name" required />
                                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                    <FormLabel label="Company Slogan / Tagline" required />
                                    <input type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} className={inputClasses} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <FormLabel label="Company Address" required />
                                    <textarea rows={2} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className={inputClasses + " resize-y"} />
                                </div>
                                <div>
                                    <FormLabel label="Company Phone" required />
                                    <input type="text" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className={inputClasses} />
                                </div>
                                <div>
                                    <FormLabel label="Company Website" required />
                                    <input type="text" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className={inputClasses} />
                                </div>
                            </div>

                            <div>
                                <FormLabel label="Company Email" required />
                                <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} className={inputClasses + " sm:max-w-md"} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                                <div>
                                    <FormLabel label="Default Payment Instructions" required />
                                    <ResizableTextarea value={defaultPaymentInstruction} onChange={setDefaultPaymentInstruction} rows={4} inputClasses={inputClasses} />
                                </div>
                                <div>
                                    <FormLabel label="Default Payment Memo" required />
                                    <ResizableTextarea value={defaultPaymentMemo} onChange={setDefaultPaymentMemo} rows={4} inputClasses={inputClasses} />
                                </div>
                            </div>

                            <div>
                                <FormLabel label="Signature Name (Authorized Person)" required />
                                <input type="text" value={signatureName} onChange={(e) => setSignatureName(e.target.value)} className={inputClasses + " sm:max-w-md"} />
                            </div>

                            <div className="flex justify-end pt-2">
                               <SaveBtn />
                            </div>
                        </div>
                    </section>

                    {/* Default Notification Messages Section */}
                    <section>
                        <SectionTitle icon={BellRing}>Default Notification Messages</SectionTitle>
                        
                        <div className="pl-1">
                            {/* Variable reference table */}
                            <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-xl space-y-3">
                                <p className="text-[11px] font-bold text-[#155b96] dark:text-blue-400 uppercase tracking-wider">Supported Variables</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-[12px] text-slate-600 dark:text-slate-300 font-mono">
                                    <div className="flex flex-col border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                       <span className="font-bold text-[#155b96] dark:text-blue-400">@serial</span>
                                       <span className="text-[11px] text-slate-500">No. Invoice</span>
                                    </div>
                                    <div className="flex flex-col border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                       <span className="font-bold text-[#155b96] dark:text-blue-400">@start_cl</span>
                                       <span className="text-[11px] text-slate-500">Period Start</span>
                                    </div>
                                    <div className="flex flex-col border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                       <span className="font-bold text-[#155b96] dark:text-blue-400">@fullname</span>
                                       <span className="text-[11px] text-slate-500">Customer Name</span>
                                    </div>
                                    <div className="flex flex-col border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                       <span className="font-bold text-[#155b96] dark:text-blue-400">@due</span>
                                       <span className="text-[11px] text-slate-500">Due Date</span>
                                    </div>
                                    <div className="flex flex-col border-b sm:border-b-0 border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                       <span className="font-bold text-[#155b96] dark:text-blue-400">@rp-xxx</span>
                                       <span className="text-[11px] text-slate-500">Amount (Rp)</span>
                                    </div>
                                    <div className="flex flex-col border-b sm:border-b-0 border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                       <span className="font-bold text-[#155b96] dark:text-blue-400">@date_cl</span>
                                       <span className="text-[11px] text-slate-500">Period End</span>
                                    </div>
                                    <div className="flex flex-col border-b sm:border-b-0 border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                       <span className="font-bold text-[#155b96] dark:text-blue-400">@serial_ct</span>
                                       <span className="text-[11px] text-slate-500">Tagihan Count</span>
                                    </div>
                                    <div className="flex flex-col border-b md:border-b-0 border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                       <span className="font-bold text-[#155b96] dark:text-blue-400">@pay_method</span>
                                       <span className="text-[11px] text-slate-500">Method (Tunai/TF)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <FormLabel label="Unpaid Invoice Message" required />
                                        <ResizableTextarea value={unpaidMsg} onChange={setUnpaidMsg} rows={4} inputClasses={inputClasses} />
                                    </div>
                                    <div>
                                        <FormLabel label="Paid Invoice Message" required />
                                        <ResizableTextarea value={paidMsg} onChange={setPaidMsg} rows={4} inputClasses={inputClasses} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                   <div>
                                       <FormLabel label="Outstanding Invoice Message" required />
                                       <ResizableTextarea value={outstandingMsg} onChange={setOutstandingMsg} rows={4} inputClasses={inputClasses} />
                                   </div>
                                   <div>
                                       <FormLabel label="Outstanding Paid Message" required />
                                       <ResizableTextarea value={outstandingPaidMsg} onChange={setOutstandingPaidMsg} rows={4} inputClasses={inputClasses} />
                                   </div>
                                </div>
                                <div>
                                    <FormLabel label="Reminder (H-1) Isolir Message (Whatsapp)" required />
                                    <ResizableTextarea value={reminderMsg} onChange={setReminderMsg} rows={3} inputClasses={inputClasses} />
                                </div>

                                <div className="flex justify-end pt-2">
                                   <SaveBtn />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            
        </div>
    );
}