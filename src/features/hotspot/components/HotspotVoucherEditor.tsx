import { useState } from "react";
import { Save, RefreshCw, Code, Eye } from "lucide-react";

export default function HotspotVoucherEditor() {
  const defaultTemplate = `<div style="border: 2px dashed #155b96; padding: 15px; width: 250px; text-align: center; font-family: sans-serif; background: white;">
  <h3 style="margin: 0 0 10px 0; color: #155b96;">WIFI VOUCHER</h3>
  <p style="margin: 5px 0;">Username: <b>[username]</b></p>
  <p style="margin: 5px 0;">Password: <b>[password]</b></p>
  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
    <p style="margin: 2px 0;">Price: Rp 5.000</p>
    <p style="margin: 2px 0;">Valid for: [validity]</p>
  </div>
</div>`;

  const [code, setCode] = useState(defaultTemplate);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-[calc(100vh-8rem)]">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">Voucher Editor</h2>
          <p className="text-[12px] text-slate-400 dark:text-slate-100">Kustomisasi tampilan cetak voucher HTML/CSS</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCode(defaultTemplate)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-100 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors"
          >
            <RefreshCw size={15} /> Reset Default
          </button>
          <button className="flex items-center gap-2 bg-[#155b96] hover:bg-[#0e4a7a] text-white px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:shadow-md active:scale-[0.98]">
            <Save size={15} /> Save Template
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-100">
            <Code size={15} /> Editor HTML
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 w-full resize-none outline-none font-mono text-[13px] bg-slate-950 text-slate-300 focus:ring-inset focus:ring-1 focus:ring-[#155b96]"
            spellCheck={false}
          />
        </div>

        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-800/30">
          <div className="bg-slate-100 dark:bg-slate-800/60 p-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[13px] font-medium text-slate-500 dark:text-slate-100">
            <Eye size={15} /> Live Preview
          </div>
          <div className="flex-1 p-8 overflow-auto flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/OMEjToYBhqMBBwMDQ/HwNGBmGBgAh8wH0R3W4/wAAAAASUVORK5CYII=')]">
            <div
              className="shadow-xl rounded-lg transition-all duration-300"
              dangerouslySetInnerHTML={{ __html: code }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
