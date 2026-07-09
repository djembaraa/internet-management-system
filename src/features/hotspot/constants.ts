export interface HotspotProfileItem {
  id: number;
  name: string;
  sharedUsers: number;
  rateLimit: string;
  price: string;
  validity: string;
  localProfile?: string;
}

export interface VoucherItem {
  id: number;
  username: string;
  password: string;
  profile: string;
  masaBerlaku: string;
  status: "Available" | "Used" | "Expired";
  macAddress: string;
  brand: string;
  totalUsage: string;
}

const BASE_HOTSPOT_PROFILES: HotspotProfileItem[] = [
  {
    id: 1,
    name: "Voucher 2 Jam",
    sharedUsers: 1,
    rateLimit: "2M/2M",
    price: "2000",
    validity: "2h",
    localProfile: "ais",
  },
  {
    id: 2,
    name: "Voucher 1 Hari",
    sharedUsers: 1,
    rateLimit: "3M/3M",
    price: "5000",
    validity: "1d",
    localProfile: "ais",
  },
  {
    id: 3,
    name: "Voucher 1 Minggu",
    sharedUsers: 2,
    rateLimit: "5M/5M",
    price: "25000",
    validity: "7d",
    localProfile: "ais",
  },
];

export const MOCK_HOTSPOT_PROFILE_ITEMS: HotspotProfileItem[] = [
  ...BASE_HOTSPOT_PROFILES,
  ...Array.from({ length: 19 }, (_, index) => {
    const no = index + 4;
    const validityValue = [3, 7, 14, 30][index % 4];
    return {
      id: no,
      name: `Voucher ${validityValue} Hari ${String(no).padStart(2, "0")}`,
      sharedUsers: (index % 3) + 1,
      rateLimit: ["2M/2M", "5M/5M", "10M/10M", "15M/15M"][index % 4],
      price: String(5000 + validityValue * 1500),
      validity: `${validityValue}d`,
      localProfile: ["ais", "guest", "event"][index % 3],
    };
  }),
];

const BASE_VOUCHERS: VoucherItem[] = [
  {
    id: 1,
    username: "GPRLLTX",
    password: "",
    profile: "asd",
    masaBerlaku: "1m",
    status: "Available",
    macAddress: "",
    brand: "",
    totalUsage: "0 Kb",
  },
  {
    id: 2,
    username: "GPRNJLQ",
    password: "abc123",
    profile: "asd",
    masaBerlaku: "1m",
    status: "Used",
    macAddress: "AA:BB:CC:DD:EE:01",
    brand: "Samsung",
    totalUsage: "128 Mb",
  },
  {
    id: 3,
    username: "GPRNGOM",
    password: "",
    profile: "asd",
    masaBerlaku: "1m",
    status: "Available",
    macAddress: "",
    brand: "",
    totalUsage: "0 Kb",
  },
  {
    id: 4,
    username: "GPRNTSV",
    password: "xyz789",
    profile: "Voucher 2 Jam",
    masaBerlaku: "2h",
    status: "Used",
    macAddress: "AA:BB:CC:DD:EE:02",
    brand: "Xiaomi",
    totalUsage: "56 Mb",
  },
  {
    id: 5,
    username: "GPRUHFN",
    password: "",
    profile: "asd",
    masaBerlaku: "1m",
    status: "Expired",
    macAddress: "AA:BB:CC:DD:EE:03",
    brand: "iPhone",
    totalUsage: "512 Mb",
  },
  {
    id: 6,
    username: "GPRUCJZ",
    password: "",
    profile: "Voucher 1 Hari",
    masaBerlaku: "1d",
    status: "Available",
    macAddress: "",
    brand: "",
    totalUsage: "0 Kb",
  },
  {
    id: 7,
    username: "GPRYKRB",
    password: "",
    profile: "asd",
    masaBerlaku: "1m",
    status: "Used",
    macAddress: "AA:BB:CC:DD:EE:04",
    brand: "Oppo",
    totalUsage: "230 Mb",
  },
  {
    id: 8,
    username: "GPRDGLL",
    password: "",
    profile: "asd",
    masaBerlaku: "1m",
    status: "Available",
    macAddress: "",
    brand: "",
    totalUsage: "0 Kb",
  },
  {
    id: 9,
    username: "GPRSRVT",
    password: "",
    profile: "Voucher 1 Minggu",
    masaBerlaku: "7d",
    status: "Expired",
    macAddress: "AA:BB:CC:DD:EE:05",
    brand: "Vivo",
    totalUsage: "1.2 Gb",
  },
  {
    id: 10,
    username: "GPRFGHF",
    password: "",
    profile: "asd",
    masaBerlaku: "1m",
    status: "Available",
    macAddress: "",
    brand: "",
    totalUsage: "0 Kb",
  },
];

export const MOCK_VOUCHER_ITEMS: VoucherItem[] = [
  ...BASE_VOUCHERS,
  ...Array.from({ length: 12 }, (_, index) => {
    const no = index + 11;
    const status: VoucherItem["status"] =
      index % 5 === 0 ? "Expired" : index % 2 === 0 ? "Used" : "Available";
    return {
      id: no,
      username: `GPRX${String(no).padStart(4, "0")}`,
      password: status === "Used" ? `pass${no}` : "",
      profile: ["Voucher 2 Jam", "Voucher 1 Hari", "Voucher 1 Minggu", "Voucher 30 Hari"][index % 4],
      masaBerlaku: ["2h", "1d", "7d", "30d"][index % 4],
      status,
      macAddress:
        status === "Available"
          ? ""
          : `AA:BB:CC:EE:${String(10 + index).padStart(2, "0")}:${String(30 + index).padStart(2, "0")}`,
      brand: status === "Available" ? "" : ["Samsung", "Xiaomi", "Oppo", "iPhone"][index % 4],
      totalUsage: status === "Available" ? "0 Kb" : `${128 + index * 64} Mb`,
    };
  }),
];
