import { useState } from "react";
import { Save, Eye, Building2, Calculator, FileText } from "lucide-react";
import FormLabel from "../../../components/FormLabel";
import { useInvoiceTemplateStore } from "../../../store/invoiceTemplateStore";
import InvoiceReceipt, { type InvoiceReceiptData } from "../../invoice/components/InvoiceReceipt";

// Helper for Section Title to maintain consistency
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

export default function TemplateInvoiceSettings() {
  const { template, setTemplate } = useInvoiceTemplateStore();
  const [form, setForm] = useState({ ...template });
  const [previewData, setPreviewData] = useState<InvoiceReceiptData | null>(null);

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setTemplate(form);
  };

  const handlePreview = () => {
    setPreviewData({
      companyName: form.companyName,
      companyTagline: form.companyTagline,
      companyOffice: form.companyOffice,
      companyPhone: form.companyPhone,
      companyWebsite: form.companyWebsite,
      companyEmail: form.companyEmail,
      customerName: "John Doe",
      customerPhone: "6281234567890",
      customerAddress: "Jl. Sample Address No. 1",
      serial: "INV-2026030001",
      issuedDate: "2026-03-07",
      dueDate: "2026-03-14",
      paidDate: undefined,
      items: [
        { name: "Langganan Internet 10Mbps", price: 150000, quantity: 1, discount: 0 },
        { name: "Biaya Instalasi", price: 100000, quantity: 1, discount: 50000 },
      ],
      discountTotal: 50000,
      taxLabel: form.taxLabel,
      taxPercent: form.taxPercent,
      kodeUnik: 123,
      status: "Unpaid",
      instruction: form.instruction || "Silakan transfer ke rekening BCA 8161700053 a/n AIS Internet",
      memo: form.memo || "Terima kasih atas kepercayaan Anda.",
      signatureName: form.signatureName || form.companyName,
    });
  };

  const inputClasses =
    "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#155b96] focus:ring-2 focus:ring-[#155b96]/10 text-[13px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
               <FileText size={20} className="text-[#155b96] dark:text-blue-400" />
           </div>
           <div>
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-slate-100">Template Invoice Settings</h2>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Pengaturan ini akan diterapkan pada semua invoice manual yang dibuat</p>
           </div>
        </div>

        <div className="p-6 sm:p-8 space-y-10">
          
          {/* Company Info Section */}
          <section>
            <SectionTitle icon={Building2}>Company Information</SectionTitle>
            <div className="space-y-5 pl-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FormLabel label="Company Name" required />
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Company Tagline" />
                  <input
                    type="text"
                    value={form.companyTagline}
                    onChange={(e) => handleChange("companyTagline", e.target.value)}
                    placeholder="e.g. Internet Service Provider"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FormLabel label="Office Address" required />
                <input
                  type="text"
                  value={form.companyOffice}
                  onChange={(e) => handleChange("companyOffice", e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FormLabel label="Phone" required />
                  <input
                    type="text"
                    value={form.companyPhone}
                    onChange={(e) => handleChange("companyPhone", e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Email" required />
                  <input
                    type="email"
                    value={form.companyEmail}
                    onChange={(e) => handleChange("companyEmail", e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FormLabel label="Website" />
                <input
                  type="text"
                  value={form.companyWebsite}
                  onChange={(e) => handleChange("companyWebsite", e.target.value)}
                  placeholder="https://..."
                  className={inputClasses + " sm:max-w-md"}
                />
              </div>
            </div>
          </section>

          {/* Tax & Signature Section */}
          <section>
            <SectionTitle icon={Calculator}>Tax & Signature</SectionTitle>
            <div className="space-y-5 pl-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FormLabel label="Tax Label" tooltip="Nama pajak yang ditampilkan di invoice." />
                  <input
                    type="text"
                    value={form.taxLabel}
                    onChange={(e) => handleChange("taxLabel", e.target.value)}
                    placeholder="e.g. PPN (11%)"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <FormLabel label="Tax Percent (%)" tooltip="Persentase potongan pajak." />
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.taxPercent}
                    onChange={(e) => handleChange("taxPercent", parseFloat(e.target.value) || 0)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <FormLabel label="Signature Name" tooltip="Nama perwakilan/admin pada bagian tanda tangan invoice." />
                <input
                  type="text"
                  value={form.signatureName}
                  onChange={(e) => handleChange("signatureName", e.target.value)}
                  placeholder="Nama Penanggung Jawab"
                  className={inputClasses + " sm:max-w-md"}
                />
              </div>
            </div>
          </section>

          {/* Default Notes Section */}
          <section>
            <SectionTitle icon={FileText}>Default Notes</SectionTitle>
            <div className="space-y-5 pl-1">
              <div>
                <FormLabel label="Instruksi Pembayaran" tooltip="Panduan cara transfer atau metode pembayaran lainnya." />
                <textarea
                  rows={3}
                  value={form.instruction}
                  onChange={(e) => handleChange("instruction", e.target.value)}
                  placeholder="Catatan panduan pembayaran untuk customer..."
                  className={inputClasses + " resize-y leading-relaxed"}
                />
              </div>

              <div>
                <FormLabel label="Memo / Pesan Tambahan" tooltip="Pesan terima kasih atau informasi lainnya." />
                <textarea
                  rows={3}
                  value={form.memo}
                  onChange={(e) => handleChange("memo", e.target.value)}
                  placeholder="Terima kasih atas kepercayaan Anda..."
                  className={inputClasses + " resize-y leading-relaxed"}
                />
              </div>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={handlePreview}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm w-full sm:w-auto"
          >
            <Eye size={16} className="text-slate-400" /> Preview Invoice
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] font-medium text-white bg-[#155b96] hover:bg-[#0e4a7a] rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-full sm:w-auto"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>

      </div>

      {/* Preview Modal */}
      {previewData && (
        <InvoiceReceipt data={previewData} onClose={() => setPreviewData(null)} />
      )}
    </div>
  );
}