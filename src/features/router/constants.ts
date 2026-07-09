import type {
  Router,
  PppoeProfile,
  HotspotProfile,
  HotspotVoucher,
  Invoice,
  WhatsappMessage,
  Log,
  Ticket,
  ONU,
  OLT,
  TrafficPppoeClient,
  HotspotReport,
  InvoiceReport,
  Expense,
  ClientConnectionInfo,
  ClientInvoiceItem,
  ClientTicketItem,
} from "./types";

const BASE_ROUTERS: Router[] = [
  {
    id: "router-1",
    name: "test",
    secret: "123",
    vpn: {
      id: "vpn-1",
      username: "admin_test",
      password: "password123",
      ip: "10.255.0.40",
      reserved_ip: "10.16.0.0/20",
      caller_ip: null,
      is_connected: 0,
    },
  },
  {
    id: "router-2",
    name: "Mikrotik Pusat",
    secret: "pusat_rahasia",
    vpn: {
      id: "vpn-2",
      username: "admin_pusat",
      password: "password456",
      ip: "10.255.0.1",
      reserved_ip: "10.20.0.0/20",
      caller_ip: "192.168.1.10",
      is_connected: 1,
    },
  },
];

export const MOCK_ROUTERS: Router[] = [
  ...BASE_ROUTERS,
  ...Array.from({ length: 20 }, (_, index) => {
    const no = index + 3;
    const connected = index % 3 !== 0;
    return {
      id: `router-${no}`,
      name: `Mikrotik Site ${String(no).padStart(2, "0")}`,
      secret: `secret_${String(no).padStart(2, "0")}`,
      vpn: {
        id: `vpn-${no}`,
        username: `admin_site_${String(no).padStart(2, "0")}`,
        password: `password${400 + no}`,
        ip: `10.255.${Math.floor((no - 1) / 10)}.${20 + no}`,
        reserved_ip: `10.${30 + index}.0.0/20`,
        caller_ip: connected
          ? `192.168.${10 + index}.${(index % 200) + 10}`
          : null,
        is_connected: connected ? 1 : 0,
      },
    };
  }),
];

const BASE_PPPOE_PROFILES: PppoeProfile[] = [
  {
    id: "1",
    name: "asd",
    price: 123,
    local_profile: null,
    rate_limit: "123",
    uniq_id: "ais",
  },
];

export const MOCK_PPPOE_PROFILES: PppoeProfile[] = [
  ...BASE_PPPOE_PROFILES,
  ...Array.from({ length: 21 }, (_, index) => {
    const no = index + 2;
    const speed = 10 + index * 5;
    return {
      id: String(no),
      name: `Paket ${speed}Mbps`,
      price: 100000 + index * 25000,
      local_profile: index % 4 === 0 ? null : `pool-${(index % 5) + 1}`,
      rate_limit: `${speed}M/${speed}M`,
      uniq_id: ["residential", "business", "premium"][index % 3],
    };
  }),
];

const BASE_HOTSPOT_PROFILES: HotspotProfile[] = [
  {
    id: "1",
    name: "asd",
    limit: 1,
    price: 1,
    group: "ais",
    validity: "1m",
  },
];

export const MOCK_HOTSPOT_PROFILES: HotspotProfile[] = [
  ...BASE_HOTSPOT_PROFILES,
  ...Array.from({ length: 21 }, (_, index) => {
    const no = index + 2;
    const validityDays = (index % 7) + 1;
    return {
      id: String(no),
      name: `Hotspot ${validityDays} Hari ${String(no).padStart(2, "0")}`,
      limit: (index % 4) + 1,
      price: 3000 + validityDays * 2500,
      group: ["ais", "guest", "event"][index % 3],
      validity: validityDays === 1 ? "1d" : `${validityDays}d`,
    };
  }),
];

const BASE_HOTSPOT_VOUCHERS: HotspotVoucher[] = [
  {
    id: "1",
    username: "GPRLLTX",
    profile: "asd",
    validity: "1m",
    status: "Available",
  },
  {
    id: "2",
    username: "GPRNJLQ",
    profile: "asd",
    validity: "1m",
    status: "Available",
  },
  {
    id: "3",
    username: "GPRNGOM",
    profile: "asd",
    validity: "1m",
    status: "Available",
  },
  {
    id: "4",
    username: "GPRNTSV",
    profile: "asd",
    validity: "1m",
    status: "Available",
  },
  {
    id: "5",
    username: "GPRUHFN",
    profile: "asd",
    validity: "1m",
    status: "Available",
  },
];

export const MOCK_HOTSPOT_VOUCHERS: HotspotVoucher[] = [
  ...BASE_HOTSPOT_VOUCHERS,
  ...Array.from({ length: 17 }, (_, index) => {
    const no = index + 6;
    const status: HotspotVoucher["status"] =
      index % 5 === 0 ? "Expired" : index % 2 === 0 ? "Used" : "Available";
    return {
      id: String(no),
      username: `GPR${String.fromCharCode(65 + (index % 26))}${String.fromCharCode(75 + (index % 10))}${String(no).padStart(3, "0")}`,
      password: status === "Used" ? `pwd${no}` : "",
      profile: ["Voucher 2 Jam", "Voucher 1 Hari", "Voucher 1 Minggu"][
        index % 3
      ],
      validity: ["2h", "1d", "7d"][index % 3],
      status,
      mac_address:
        status === "Available"
          ? ""
          : `AA:BB:CC:DD:${String(10 + index).padStart(2, "0")}:${String(20 + index).padStart(2, "0")}`,
    };
  }),
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    fullname: "test",
    username: "-",
    serial: "INV-2025021472",
    amount: 17250,
    status: "Paid",
  },
];

export const MOCK_TICKETS: Ticket[] = Array.from({ length: 22 }, (_, index) => {
  const no = index + 1;
  const status: Ticket["status"] =
    index % 5 === 0 ? "Closed" : index % 3 === 0 ? "On Hold" : "Opened";
  return {
    id: `ticket-${no}`,
    subject_person: [
      "Budi Susanto",
      "Siti Aminah",
      "Toko Makmur",
      "Ahmad Dahlan",
      "Warung Sejahtera",
      "PT Langit Data",
    ][index % 6],
    no_ticket: `TCK-${String(2026000 + no)}`,
    subject: [
      "Internet lambat",
      "PPPoE sering putus",
      "Request ganti password",
      "Voucher hotspot gagal login",
      "Invoice belum diterima",
      "Perangkat ONU tidak online",
    ][index % 6],
    status,
    last_update: `2026-03-${String((index % 28) + 1).padStart(2, "0")} ${String(8 + (index % 10)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}:00`,
  };
});

export const MOCK_WHATSAPP_MESSAGES: WhatsappMessage[] = [
  {
    id: "1",
    message: "Pelanggan yang terhormat, anda memiliki outstandin...",
    to: "6281231854329",
    timestamp: "2025-02-09 03:51:52",
  },
  {
    id: "2",
    message: "Pelanggan yang terhormat, anda memiliki outstandin...",
    to: "6281231854329",
    timestamp: "2025-02-09 03:51:32",
  },
  {
    id: "3",
    message: "Pelanggan yang terhormat, anda memiliki invoice ya...",
    to: "6281231854329",
    timestamp: "2025-02-09 03:51:10",
  },
  ...Array.from({ length: 12 }, (_, index) => {
    const no = index + 4;
    return {
      id: String(no),
      message: [
        "Reminder tagihan bulan ini sudah terbit.",
        "Promo upgrade paket internet tersedia minggu ini.",
        "Pemberitahuan maintenance jaringan malam ini.",
        "Invoice Anda siap dibuka dan dibayar sekarang.",
      ][index % 4],
      to: `62812${String(300000 + no).slice(-8)}`,
      timestamp: `2025-02-09 03:${String(10 + index).padStart(2, "0")}:00`,
    };
  }),
];

const BASE_LOGS: Log[] = [
  {
    id: "1",
    description: "Invoice Manual Payments INV-2025021472 by nizar",
    topics: "payment,invoice,manual",
    timestamp: "2025-11-05 08:40:40",
  },
  {
    id: "2",
    description: "Add new Router by nizar",
    topics: "add,router",
    timestamp: "2025-10-06 04:05:47",
  },
  {
    id: "3",
    description: "Delete Router by nizar",
    topics: "delete,router",
    timestamp: "2025-10-06 04:02:35",
  },
  {
    id: "4",
    description: "Edit Invoice by nizar",
    topics: "edit,invoice",
    timestamp: "2025-08-02 15:56:36",
  },
  {
    id: "5",
    description: "Invoice Manual Payments INV-2025021472 by nizar",
    topics: "payment,invoice,manual",
    timestamp: "2025-03-08 14:40:33",
  },
  {
    id: "6",
    description: "Invoice outstanding INV-2025021472 by nizar",
    topics: "payment,invoice,manual",
    timestamp: "2025-02-09 03:51:23",
  },
  {
    id: "7",
    description: "Edit Invoice by nizar",
    topics: "edit,invoice",
    timestamp: "2025-02-09 03:50:57",
  },
  {
    id: "8",
    description: "Add new Invoice by nizar",
    topics: "add,invoice",
    timestamp: "2025-02-08 17:24:14",
  },
  {
    id: "9",
    description: "Generate Hotspot Voucher by nizar",
    topics: "add,hotspot,voucher",
    timestamp: "2024-12-24 14:11:52",
  },
  {
    id: "10",
    description: "Add new Hotspot Profile by nizar",
    topics: "add,hotspot,profile",
    timestamp: "2024-12-24 14:11:08",
  },
];

export const MOCK_LOGS: Log[] = [
  ...BASE_LOGS,
  ...Array.from({ length: 12 }, (_, index) => {
    const no = index + 11;
    return {
      id: String(no),
      description: [
        `Sync PPPoE profile Paket ${20 + index * 5}Mbps by system`,
        `Update router secret Site ${String(no).padStart(2, "0")} by nizar`,
        `Generate hotspot voucher batch ${String(no).padStart(3, "0")} by admin`,
        `Create ticket TCK-${String(2026000 + no)} by support`,
      ][index % 4],
      topics: [
        "sync,pppoe,profile",
        "edit,router",
        "add,hotspot,voucher",
        "add,ticket,support",
      ][index % 4],
      timestamp: `2026-03-${String((index % 28) + 1).padStart(2, "0")} ${String(9 + (index % 8)).padStart(2, "0")}:${String((index * 5) % 60).padStart(2, "0")}:15`,
    };
  }),
];

const BASE_ONU_LIST: ONU[] = [
  {
    id: "onu-1",
    name: "ONU-Budi-001",
    distance: "1.2 km",
    rxPower: "-18.5 dBm",
    olt: "OLT-Pusat",
    macSn: "48:8F:5A:1C:23:A1",
    lastSeen: "2026-02-25 21:55:00",
    status: "Online",
  },
  {
    id: "onu-2",
    name: "ONU-Siti-002",
    distance: "3.8 km",
    rxPower: "-22.1 dBm",
    olt: "OLT-Pusat",
    macSn: "48:8F:5A:1C:23:B2",
    lastSeen: "2026-02-25 21:54:30",
    status: "Online",
  },
  {
    id: "onu-3",
    name: "ONU-Toko-003",
    distance: "5.6 km",
    rxPower: "-26.8 dBm",
    olt: "OLT-Cabang",
    macSn: "48:8F:5A:1C:23:C3",
    lastSeen: "2026-02-25 20:10:00",
    status: "Warning",
  },
  {
    id: "onu-4",
    name: "ONU-Ahmad-004",
    distance: "2.1 km",
    rxPower: "-19.2 dBm",
    olt: "OLT-Pusat",
    macSn: "48:8F:5A:1C:23:D4",
    lastSeen: "2026-02-25 21:53:00",
    status: "Online",
  },
  {
    id: "onu-5",
    name: "ONU-Warung-005",
    distance: "8.3 km",
    rxPower: "-30.5 dBm",
    olt: "OLT-Cabang",
    macSn: "48:8F:5A:1C:23:E5",
    lastSeen: "2026-02-24 14:20:00",
    status: "Offline",
  },
  {
    id: "onu-6",
    name: "ONU-Rudi-006",
    distance: "1.5 km",
    rxPower: "-17.3 dBm",
    olt: "OLT-Pusat",
    macSn: "48:8F:5A:1C:23:F6",
    lastSeen: "2026-02-25 21:56:00",
    status: "Online",
  },
];

export const MOCK_ONU_LIST: ONU[] = [
  ...BASE_ONU_LIST,
  ...Array.from({ length: 16 }, (_, index) => {
    const no = index + 7;
    const status: ONU["status"] =
      index % 6 === 0 ? "Offline" : index % 4 === 0 ? "Warning" : "Online";
    const rxPowerValue =
      status === "Offline"
        ? -(29 + (index % 4) + 0.5)
        : status === "Warning"
          ? -(25 + (index % 3) + 0.2)
          : -(17 + (index % 5) + 0.1);

    return {
      id: `onu-${no}`,
      name: `ONU-Site-${String(no).padStart(3, "0")}`,
      distance: `${(1.4 + index * 0.6).toFixed(1)} km`,
      rxPower: `${rxPowerValue.toFixed(1)} dBm`,
      olt: ["OLT-Pusat", "OLT-Cabang", "OLT-Site-04", "OLT-Site-08"][index % 4],
      macSn: `48:8F:5A:1C:${String(30 + index).padStart(2, "0")}:${String(50 + index).padStart(2, "0")}`,
      lastSeen:
        status === "Offline"
          ? `2026-02-${String(20 + (index % 5)).padStart(2, "0")} ${String(10 + (index % 8)).padStart(2, "0")}:${String((index * 9) % 60).padStart(2, "0")}:00`
          : `2026-02-25 ${String(12 + (index % 10)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}:00`,
      status,
    };
  }),
];

const BASE_OLT_LIST: OLT[] = [
  {
    id: "olt-1",
    name: "OLT-Pusat",
    ip: "192.168.1.100",
    port: 8080,
    totalOnu: 128,
    onlineOnu: 115,
    uptime: "45d 12h 30m",
    status: "Active",
  },
  {
    id: "olt-2",
    name: "OLT-Cabang",
    ip: "192.168.2.100",
    port: 8080,
    totalOnu: 64,
    onlineOnu: 52,
    uptime: "30d 8h 15m",
    status: "Active",
  },
  {
    id: "olt-3",
    name: "OLT-Gudang",
    ip: "192.168.3.100",
    port: 8080,
    totalOnu: 32,
    onlineOnu: 0,
    uptime: "-",
    status: "Inactive",
  },
];

export const MOCK_OLT_LIST: OLT[] = [
  ...BASE_OLT_LIST,
  ...Array.from({ length: 19 }, (_, index) => {
    const no = index + 4;
    const active = index % 5 !== 0;
    const totalOnu = 32 + (index % 6) * 16;
    const onlineOnu = active ? totalOnu - ((index % 4) + 3) : 0;
    const status: OLT["status"] = active ? "Active" : "Inactive";
    return {
      id: `olt-${no}`,
      name: `OLT-Site-${String(no).padStart(2, "0")}`,
      ip: `192.168.${10 + index}.100`,
      port: 8080,
      totalOnu,
      onlineOnu,
      uptime: active
        ? `${12 + index}d ${4 + (index % 12)}h ${10 + (index % 50)}m`
        : "-",
      status,
    };
  }),
];

const BASE_TRAFFIC_PPPOE: TrafficPppoeClient[] = [
  {
    id: "trf-1",
    username: "budi-net",
    ip: "10.10.10.25",
    upload: "2.4 Mbps",
    download: "12.8 Mbps",
    uptime: "5h 23m",
    profile: "Paket 20Mbps",
    status: "Active",
  },
  {
    id: "trf-2",
    username: "siti-net",
    ip: "10.10.10.26",
    upload: "0.8 Mbps",
    download: "5.2 Mbps",
    uptime: "2h 10m",
    profile: "Paket 10Mbps",
    status: "Active",
  },
  {
    id: "trf-3",
    username: "toko-makmur",
    ip: "10.10.10.27",
    upload: "8.1 Mbps",
    download: "35.6 Mbps",
    uptime: "12h 45m",
    profile: "Paket 50Mbps",
    status: "Active",
  },
  {
    id: "trf-4",
    username: "ahmad-net",
    ip: "10.10.10.28",
    upload: "0.0 Mbps",
    download: "0.0 Mbps",
    uptime: "0m",
    profile: "Paket 10Mbps",
    status: "Idle",
  },
  {
    id: "trf-5",
    username: "rudi-net",
    ip: "10.10.10.29",
    upload: "1.5 Mbps",
    download: "8.9 Mbps",
    uptime: "8h 32m",
    profile: "Paket 20Mbps",
    status: "Active",
  },
];

export const MOCK_TRAFFIC_PPPOE: TrafficPppoeClient[] = [
  ...BASE_TRAFFIC_PPPOE,
  ...Array.from({ length: 17 }, (_, index) => {
    const no = index + 6;
    const status: TrafficPppoeClient["status"] =
      index % 4 === 0 ? "Idle" : "Active";
    const uploadValue = (1.2 + index * 0.6).toFixed(1);
    const downloadValue = (6.4 + index * 2.1).toFixed(1);
    return {
      id: `trf-${no}`,
      username: `client-${String(no).padStart(3, "0")}`,
      ip: `10.10.${Math.floor((index + 10) / 10) + 10}.${30 + index}`,
      upload: status === "Idle" ? "0.0 Mbps" : `${uploadValue} Mbps`,
      download: status === "Idle" ? "0.0 Mbps" : `${downloadValue} Mbps`,
      uptime:
        status === "Idle"
          ? "0m"
          : `${2 + (index % 12)}h ${String((index * 11) % 60).padStart(2, "0")}m`,
      profile: ["Paket 10Mbps", "Paket 20Mbps", "Paket 30Mbps", "Paket 50Mbps"][
        index % 4
      ],
      status,
    };
  }),
];

const BASE_HOTSPOT_REPORTS: HotspotReport[] = [
  {
    id: "hr-1",
    profile: "Voucher 2 Jam",
    tanggal: "2026-02-25",
    jumlah: 15,
    nominal: 30000,
  },
  {
    id: "hr-2",
    profile: "Voucher 1 Hari",
    tanggal: "2026-02-24",
    jumlah: 8,
    nominal: 40000,
  },
  {
    id: "hr-3",
    profile: "Voucher 1 Minggu",
    tanggal: "2026-02-23",
    jumlah: 3,
    nominal: 75000,
  },
];

export const MOCK_HOTSPOT_REPORTS: HotspotReport[] = [
  ...BASE_HOTSPOT_REPORTS,
  ...Array.from({ length: 19 }, (_, index) => {
    const no = index + 4;
    const jumlah = 4 + (index % 12);
    return {
      id: `hr-${no}`,
      profile: [
        "Voucher 2 Jam",
        "Voucher 1 Hari",
        "Voucher 3 Hari",
        "Voucher 1 Minggu",
      ][index % 4],
      tanggal: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
      jumlah,
      nominal: jumlah * [2500, 5000, 12000, 25000][index % 4],
    };
  }),
];

const BASE_INVOICE_REPORTS: InvoiceReport[] = [
  {
    id: "ir-1",
    tanggal: "2026-02-25",
    noInvoice: "INV-260201",
    type: "PPPoE",
    nominal: 250000,
    tipePembayaran: "Transfer",
  },
  {
    id: "ir-2",
    tanggal: "2026-02-20",
    noInvoice: "INV-260202",
    type: "PPPoE",
    nominal: 150000,
    tipePembayaran: "Tunai",
  },
  {
    id: "ir-3",
    tanggal: "2026-02-15",
    noInvoice: "INV-260204",
    type: "Manual",
    nominal: 400000,
    tipePembayaran: "Transfer",
  },
];

export const MOCK_INVOICE_REPORTS: InvoiceReport[] = [
  ...BASE_INVOICE_REPORTS,
  ...Array.from({ length: 19 }, (_, index) => {
    const no = index + 4;
    const type: InvoiceReport["type"] = index % 3 === 0 ? "Manual" : "PPPoE";
    const tipePembayaran: InvoiceReport["tipePembayaran"] =
      index % 2 === 0 ? "Transfer" : "Tunai";
    return {
      id: `ir-${no}`,
      tanggal: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
      noInvoice: `INV-26${String(300 + no).padStart(4, "0")}`,
      type,
      nominal: 125000 + index * 35000,
      tipePembayaran,
    };
  }),
];

const BASE_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    tanggal: "2026-02-25",
    type: "Pemasukan",
    nominal: 250000,
    deskripsi: "Pembayaran Invoice INV-260201",
  },
  {
    id: "exp-2",
    tanggal: "2026-02-24",
    type: "Pengeluaran",
    nominal: 150000,
    deskripsi: "Beli kabel fiber 200m",
  },
  {
    id: "exp-3",
    tanggal: "2026-02-23",
    type: "Pemasukan",
    nominal: 75000,
    deskripsi: "Penjualan Voucher Hotspot",
  },
  {
    id: "exp-4",
    tanggal: "2026-02-22",
    type: "Pengeluaran",
    nominal: 50000,
    deskripsi: "Transport teknisi",
  },
  {
    id: "exp-5",
    tanggal: "2026-02-20",
    type: "Pemasukan",
    nominal: 150000,
    deskripsi: "Pembayaran Invoice INV-260202",
  },
];

export const MOCK_EXPENSES: Expense[] = [
  ...BASE_EXPENSES,
  ...Array.from({ length: 17 }, (_, index) => {
    const no = index + 6;
    const pemasukan = index % 2 === 0;
    const type: Expense["type"] = pemasukan ? "Pemasukan" : "Pengeluaran";
    return {
      id: `exp-${no}`,
      tanggal: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
      type,
      nominal: pemasukan ? 100000 + index * 40000 : 50000 + index * 25000,
      deskripsi: pemasukan
        ? `Pembayaran invoice ${index % 3 === 0 ? "PPPoE" : "Manual"} INV-26${String(400 + no).padStart(4, "0")}`
        : [
            "Maintenance router",
            "Pembelian kabel UTP",
            "Operasional teknisi",
            "Penggantian adaptor OLT",
          ][index % 4],
    };
  }),
];

export const MOCK_CLIENT_CONNECTION: ClientConnectionInfo = {
  statusPerangkat: "Connected",
  uptimePerangkat: "3d 11h 47m",
  fullname: "Nicken",
  paketLayanan: "Reguler-R1F-Pendem",
  totalPenggunaan: "105.15 Gb",
  ping: "17.63 ms",
};

export const MOCK_CLIENT_INVOICES: ClientInvoiceItem[] = [
  {
    id: "ci-1",
    jenisLayanan: "Reguler-R1F-Pendem (09 February 2026 - 11 March 2026)",
    noInvoice: "INV-2026027316",
    tanggalTerbit: "09 February 2026",
    jatuhTempo: "09 February 2026",
    total: 160289,
    status: "Paid",
  },
  {
    id: "ci-2",
    jenisLayanan: "Reguler-R1F-Pendem (23 November 2025 - 22 December 2025)",
    noInvoice: "INV-2025116185",
    tanggalTerbit: "20 November 2025",
    jatuhTempo: "22 November 2025",
    total: 160898,
    status: "Paid",
  },
  {
    id: "ci-3",
    jenisLayanan: "Reguler-R1F-Pendem (23 October 2025 - 21 November 2025)",
    noInvoice: "INV-2025105708",
    tanggalTerbit: "23 October 2025",
    jatuhTempo: "23 October 2025",
    total: 160654,
    status: "Paid",
  },
  {
    id: "ci-4",
    jenisLayanan: "Reguler-R2-Girimoyo (24 October 2025 - 22 November 2025)",
    noInvoice: "INV-2025105706",
    tanggalTerbit: "23 October 2025",
    jatuhTempo: "23 October 2025",
    total: 200376,
    status: "Paid",
  },
];

export const MOCK_CLIENT_TICKETS: ClientTicketItem[] = [
  {
    id: "ct-1",
    noTicket: "TCK-2026001",
    subject: "Internet lambat",
    status: "Opened",
    lastUpdate: "2026-03-01 08:20:00",
  },
  {
    id: "ct-2",
    noTicket: "TCK-2026002",
    subject: "ONU tidak online",
    status: "On Hold",
    lastUpdate: "2026-03-02 09:10:00",
  },
  {
    id: "ct-3",
    noTicket: "TCK-2026003",
    subject: "Request reset password PPPoE",
    status: "Closed",
    lastUpdate: "2026-03-03 10:05:00",
  },
  {
    id: "ct-4",
    noTicket: "TCK-2026004",
    subject: "Tagihan belum diterima",
    status: "Opened",
    lastUpdate: "2026-03-04 11:45:00",
  },
  {
    id: "ct-5",
    noTicket: "TCK-2026005",
    subject: "Perangkat sering reconnect",
    status: "Closed",
    lastUpdate: "2026-03-05 14:22:00",
  },
  {
    id: "ct-6",
    noTicket: "TCK-2026006",
    subject: "Minta ganti paket layanan",
    status: "Opened",
    lastUpdate: "2026-03-06 15:30:00",
  },
  ...Array.from({ length: 14 }, (_, index) => {
    const no = index + 7;
    const status: ClientTicketItem["status"] =
      index % 5 === 0 ? "Closed" : index % 3 === 0 ? "On Hold" : "Opened";
    return {
      id: `ct-${no}`,
      noTicket: `TCK-20260${String(no).padStart(2, "0")}`,
      subject: [
        "Internet lambat saat malam hari",
        "Request reset password PPPoE",
        "Tagihan bulan ini belum diterima",
        "ONU pelanggan putus-putus",
      ][index % 4],
      status,
      lastUpdate: `2026-03-${String((index % 28) + 7).padStart(2, "0")} ${String(8 + (index % 9)).padStart(2, "0")}:${String((index * 13) % 60).padStart(2, "0")}:00`,
    };
  }),
];
