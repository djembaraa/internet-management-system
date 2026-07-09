export interface InvoiceTableItem {
  id: string;
  client: string;
  description: string;
  date: string;
  amount: string;
  status: string;
}

export interface InvoicePppoeItem {
  id: number;
  fullname: string;
  username: string;
  serial: string;
  amount: number;
  status: string;
}

export interface ManualInvoiceItem {
  id: number;
  fullname: string;
  username: string;
  serial: string;
  description: string;
  date: string;
  amount: string;
  status: "Paid" | "Unpaid" | "Partially Paid";
}

export const MOCK_INVOICE_TABLE: InvoiceTableItem[] = [
  {
    id: "INV-2024-001",
    client: "Budi Santoso",
    description: "Tagihan Internet Bulan April",
    date: "12 Apr 2024",
    amount: "Rp 250.000",
    status: "Paid",
  },
  {
    id: "INV-260202",
    client: "Siti Aminah",
    description: "Tagihan Internet Paket 10Mbps",
    date: "2026-02-20",
    amount: "Rp 150.000",
    status: "Paid",
  },
  {
    id: "INV-260203",
    client: "Toko Makmur",
    description: "Biaya Pemasangan Baru",
    date: "2026-02-24",
    amount: "Rp 500.000",
    status: "Unpaid",
  },
  {
    id: "INV-260204",
    client: "Ahmad Dahlan",
    description: "Tagihan Internet Paket 50Mbps",
    date: "2026-02-15",
    amount: "Rp 400.000",
    status: "Paid",
  },
  {
    id: "INV-260205",
    client: "Warung Sejahtera",
    description: "Tagihan Internet Paket 30Mbps",
    date: "2026-02-10",
    amount: "Rp 300.000",
    status: "Unpaid",
  },
  ...Array.from({ length: 14 }, (_, index) => {
    const no = index + 6;
    return {
      id: `INV-2602${String(no).padStart(2, "0")}`,
      client: ["Rudi Hartono", "Dewi Lestari", "Agus Salim", "Maya Putri"][
        index % 4
      ],
      description: [
        "Tagihan Internet Paket 10Mbps",
        "Tagihan Internet Paket 20Mbps",
        "Biaya Instalasi Baru",
        "Tagihan Internet Paket 50Mbps",
      ][index % 4],
      date: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
      amount: `Rp ${(120000 + index * 25000).toLocaleString("id-ID")}`,
      status: index % 3 === 0 ? "Paid" : "Unpaid",
    };
  }),
];

const BASE_PPPOE_INVOICES: InvoicePppoeItem[] = [
  {
    id: 1,
    fullname: "Budi Susanto",
    username: "budi123",
    serial: "INV-260201",
    amount: 250000,
    status: "Unpaid",
  },
  {
    id: 2,
    fullname: "Siti Aminah",
    username: "siti_a",
    serial: "INV-260202",
    amount: 150000,
    status: "Paid",
  },
  {
    id: 3,
    fullname: "Toko Makmur",
    username: "makmur_jaya",
    serial: "INV-260203",
    amount: 500000,
    status: "Unpaid",
  },
  {
    id: 4,
    fullname: "Ahmad Dahlan",
    username: "ahmad_d",
    serial: "INV-260204",
    amount: 400000,
    status: "Paid",
  },
  {
    id: 5,
    fullname: "Warung Sejahtera",
    username: "wr_sejahtera",
    serial: "INV-260205",
    amount: 300000,
    status: "Partially Paid",
  },
];

export const MOCK_PPPOE_INVOICES: InvoicePppoeItem[] = [
  ...BASE_PPPOE_INVOICES,
  ...Array.from({ length: 17 }, (_, index) => {
    const no = index + 6;
    return {
      id: no,
      fullname: `Pelanggan PPPoE ${String(no).padStart(2, "0")}`,
      username: `pppoe_${String(no).padStart(3, "0")}`,
      serial: `INV-26${String(200 + no).padStart(4, "0")}`,
      amount: 150000 + index * 25000,
      status: ["Unpaid", "Paid", "Partially Paid"][index % 3],
    };
  }),
];

const BASE_MANUAL_INVOICES: ManualInvoiceItem[] = [
  {
    id: 1,
    serial: "INV-260201",
    fullname: "Budi Susanto",
    username: "budi123",
    description: "Tagihan Internet Paket 20Mbps",
    date: "2026-02-25",
    amount: "Rp 250.000",
    status: "Unpaid",
  },
  {
    id: 2,
    serial: "INV-260202",
    fullname: "Siti Aminah",
    username: "siti_a",
    description: "Tagihan Internet Paket 10Mbps",
    date: "2026-02-20",
    amount: "Rp 150.000",
    status: "Paid",
  },
  {
    id: 3,
    serial: "INV-260203",
    fullname: "Toko Makmur",
    username: "makmur_jaya",
    description: "Biaya Pemasangan Baru",
    date: "2026-02-24",
    amount: "Rp 500.000",
    status: "Unpaid",
  },
  {
    id: 4,
    serial: "INV-260204",
    fullname: "Ahmad Dahlan",
    username: "ahmad_d",
    description: "Tagihan Internet Paket 50Mbps",
    date: "2026-02-15",
    amount: "Rp 400.000",
    status: "Paid",
  },
  {
    id: 5,
    serial: "INV-260205",
    fullname: "Warung Sejahtera",
    username: "wr_sejahtera",
    description: "Tagihan Internet Paket 30Mbps",
    date: "2026-02-10",
    amount: "Rp 300.000",
    status: "Unpaid",
  },
];

export const MOCK_MANUAL_INVOICES: ManualInvoiceItem[] = [
  ...BASE_MANUAL_INVOICES,
  ...Array.from({ length: 17 }, (_, index) => {
    const no = index + 6;
    return {
      id: no,
      serial: `INV-26${String(300 + no).padStart(4, "0")}`,
      fullname: `Pelanggan Manual ${String(no).padStart(2, "0")}`,
      username: `manual_${String(no).padStart(3, "0")}`,
      description: [
        "Tagihan Internet Paket 20Mbps",
        "Biaya Instalasi",
        "Biaya Maintenance Jaringan",
        "Tagihan Upgrade Paket",
      ][index % 4],
      date: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
      amount: `Rp ${(175000 + index * 30000).toLocaleString("id-ID")}`,
      status: ["Unpaid", "Paid", "Partially Paid"][
        index % 3
      ] as ManualInvoiceItem["status"],
    };
  }),
];
