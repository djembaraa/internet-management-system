export interface PppoeClientItem {
  id: number;
  name: string;
  service: string;
  profile: string;
  localAddress: string;
  remoteAddress: string;
  status: "connected" | "disconnected" | "disable" | "expired";
  isExpired?: boolean;
}

const BASE_CLIENTS: PppoeClientItem[] = [
  {
    id: 1,
    name: "Budi Susanto",
    service: "pppoe",
    profile: "Paket 20Mbps",
    localAddress: "10.10.10.1",
    remoteAddress: "10.10.10.25",
    status: "connected",
  },
  {
    id: 2,
    name: "Siti Aminah",
    service: "pppoe",
    profile: "Paket 10Mbps",
    localAddress: "10.10.10.1",
    remoteAddress: "10.10.10.26",
    status: "expired",
    isExpired: true,
  },
  {
    id: 3,
    name: "Toko Makmur",
    service: "pppoe",
    profile: "Paket 50Mbps",
    localAddress: "10.10.10.1",
    remoteAddress: "10.10.10.27",
    status: "connected",
  },
  {
    id: 4,
    name: "Andi Pratama",
    service: "pppoe",
    profile: "Paket 10Mbps",
    localAddress: "10.10.10.1",
    remoteAddress: "10.10.10.28",
    status: "disable",
  },
  {
    id: 5,
    name: "Warung Sejahtera",
    service: "pppoe",
    profile: "Paket 20Mbps",
    localAddress: "10.10.10.1",
    remoteAddress: "10.10.10.29",
    status: "disable",
  },
];

export const MOCK_PPPOE_CLIENTS: PppoeClientItem[] = [
  ...BASE_CLIENTS,
  ...Array.from({ length: 17 }, (_, index) => {
    const no = index + 6;
    return {
      id: no,
      name: `Pelanggan ${String(no).padStart(2, "0")}`,
      service: "pppoe",
      profile: ["Paket 10Mbps", "Paket 20Mbps", "Paket 30Mbps", "Paket 50Mbps"][
        index % 4
      ],
      localAddress: "10.10.10.1",
      remoteAddress: `10.10.${Math.floor((index + 10) / 10) + 10}.${30 + index}`,
      status:
        index % 6 === 0
          ? "expired"
          : index % 5 === 0
            ? "disconnected"
            : index % 4 === 0
              ? "disable"
              : "connected",
      isExpired: index % 6 === 0,
    };
  }),
];
