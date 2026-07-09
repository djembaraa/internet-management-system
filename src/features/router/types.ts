export interface Vpn {
  id: string;
  username: string;
  password?: string;
  ip: string;
  reserved_ip: string;
  caller_ip: string | null;
  is_connected: number;
}

export interface Router {
  id: string;
  name: string;
  secret: string;
  vpn: Vpn;
}

export interface PppoeProfile {
  id: string;
  name: string;
  price: number;
  local_profile: string | null;
  rate_limit: string | null;
  uniq_id: string;
}

export interface PppoeClient {
  id: string;
  fullname: string;
  ip: string;
  profile: string;
  expired: string;
  status: "Connected" | "Disconnected" | "Expired";
}

export interface HotspotProfile {
  id: string;
  name: string;
  limit: number;
  price: number;
  group: string;
  validity: string;
}

export interface HotspotVoucher {
  id: string;
  username: string;
  password?: string;
  profile: string;
  validity: string;
  status: "Available" | "Used" | "Expired";
  mac_address?: string;
}

export interface Invoice {
  id: string;
  fullname: string;
  username: string | null;
  serial: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Outstanding";
}

export interface WhatsappMessage {
  id: string;
  message: string;
  to: string;
  timestamp: string;
}

export interface TelegramSettings {
  botToken: string;
  chatIdPppoe: string;
  chatIdTicket: string;
  chatIdVoucher: string;
  notifyPppoe: boolean;
  notifyTicket: boolean;
  notifyVoucher: boolean;
}

export interface Log {
  id: string;
  description: string;
  topics: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  subject_person: string;
  no_ticket: string;
  subject: string;
  status: "Opened" | "On Hold" | "Closed";
  last_update: string;
}

export interface UserProfile {
  username: string;
  email: string;
  contact: string;
  currentPackage: string;
  expiration: string;
  role: string;
}

export interface ONU {
  id: string;
  name: string;
  distance: string;
  rxPower: string;
  olt: string;
  macSn: string;
  lastSeen: string;
  status: "Online" | "Offline" | "Warning";
}

export interface OLT {
  id: string;
  name: string;
  ip: string;
  port: number;
  totalOnu: number;
  onlineOnu: number;
  uptime: string;
  status: "Active" | "Inactive";
}

export interface TrafficPppoeClient {
  id: string;
  username: string;
  ip: string;
  upload: string;
  download: string;
  uptime: string;
  profile: string;
  status: "Active" | "Idle";
}

export interface HotspotReport {
  id: string;
  profile: string;
  tanggal: string;
  jumlah: number;
  nominal: number;
}

export interface InvoiceReport {
  id: string;
  tanggal: string;
  noInvoice: string;
  type: "PPPoE" | "Manual";
  nominal: number;
  tipePembayaran: "Tunai" | "Transfer";
}

export interface Expense {
  id: string;
  tanggal: string;
  type: "Pemasukan" | "Pengeluaran";
  nominal: number;
  deskripsi: string;
}

export interface ClientConnectionInfo {
  statusPerangkat: "Connected" | "Disconnected";
  uptimePerangkat: string;
  fullname: string;
  paketLayanan: string;
  totalPenggunaan: string;
  ping: string;
}

export interface ClientInvoiceItem {
  id: string;
  jenisLayanan: string;
  noInvoice: string;
  tanggalTerbit: string;
  jatuhTempo: string;
  total: number;
  status: "Paid" | "Unpaid";
}

export interface ClientTicketItem {
  id: string;
  noTicket: string;
  subject: string;
  status: "Opened" | "On Hold" | "Closed";
  lastUpdate: string;
}
