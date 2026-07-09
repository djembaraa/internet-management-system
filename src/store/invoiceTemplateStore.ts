import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InvoiceTemplate {
  companyName: string;
  companyTagline: string;
  companyOffice: string;
  companyPhone: string;
  companyWebsite: string;
  companyEmail: string;
  signatureName: string;
  instruction: string;
  memo: string;
  taxLabel: string;
  taxPercent: number;
}

interface InvoiceTemplateStore {
  template: InvoiceTemplate;
  setTemplate: (template: InvoiceTemplate) => void;
  updateField: <K extends keyof InvoiceTemplate>(key: K, value: InvoiceTemplate[K]) => void;
}

const DEFAULT_TEMPLATE: InvoiceTemplate = {
  companyName: "DJ Internet",
  companyTagline: "Internet Service Provider",
  companyOffice: "Jl. Contoh No. 123",
  companyPhone: "081234567890",
  companyWebsite: "dj-internet.com",
  companyEmail: "admin@dj-internet.com",
  signatureName: "",
  instruction: "",
  memo: "",
  taxLabel: "Ppn (10,5%)",
  taxPercent: 10.5,
};

export const useInvoiceTemplateStore = create<InvoiceTemplateStore>()(
  persist(
    (set) => ({
      template: DEFAULT_TEMPLATE,
      setTemplate: (template) => set({ template }),
      updateField: (key, value) =>
        set((state) => ({
          template: { ...state.template, [key]: value },
        })),
    }),
    { name: "invoice-template" }
  )
);
