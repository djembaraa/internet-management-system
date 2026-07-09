import {
  CreditCard,
  MessageCircle,
  Network,
  Radio,
  Server,
  Wifi,
  Users as UsersIcon,
} from "lucide-react";
import type { ElementType } from "react";

export interface UserResource {
  label: string;
  used: number;
  limit: number;
  color: string;
  icon: ElementType;
}

export interface UserItem {
  id: number;
  fullname: string;
  lastLogin: string;
  packages: string;
  resources: UserResource[];
}

export interface Limitation {
  label: string;
  value: string;
  color: string;
  icon: ElementType;
}

export interface UserPackage {
  id: number;
  name: string;
  price: string;
  limitations: Limitation[];
}

export const MOCK_ROOT_USERS: UserItem[] = [
  {
    id: 1,
    fullname: "test",
    lastLogin: "21-02-2026 20:40:12 WIB",
    packages: "Free",
    resources: [
      {
        label: "Router",
        used: 0,
        limit: 9999999999,
        color: "text-emerald-600 dark:text-emerald-400",
        icon: Server,
      },
      {
        label: "PPPoE",
        used: 0,
        limit: 9999999999,
        color: "text-blue-600 dark:text-blue-400",
        icon: Network,
      },
      {
        label: "Hotspot",
        used: 0,
        limit: 9999999999,
        color: "text-amber-600 dark:text-amber-400",
        icon: Wifi,
      },
    ],
  },
  {
    id: 2,
    fullname: "nizar",
    lastLogin: "02-03-2026 13:41:55 WIB",
    packages: "Free",
    resources: [
      {
        label: "Router",
        used: 1,
        limit: 9999999999,
        color: "text-emerald-600 dark:text-emerald-400",
        icon: Server,
      },
      {
        label: "PPPoE",
        used: 0,
        limit: 9999999999,
        color: "text-blue-600 dark:text-blue-400",
        icon: Network,
      },
      {
        label: "Hotspot",
        used: 200,
        limit: 9999999999,
        color: "text-amber-600 dark:text-amber-400",
        icon: Wifi,
      },
    ],
  },
];

export const MOCK_ROOT_PACKAGES: UserPackage[] = [
  {
    id: 1,
    name: "tes paket",
    price: "Rp. 10.000",
    limitations: [
      {
        label: "Router",
        value: "1",
        color: "text-emerald-600 dark:text-emerald-400",
        icon: Server,
      },
      {
        label: "PPPoE",
        value: "1",
        color: "text-blue-600 dark:text-blue-400",
        icon: Network,
      },
      {
        label: "Hotspot",
        value: "1",
        color: "text-amber-600 dark:text-amber-400",
        icon: Wifi,
      },
      {
        label: "OLT",
        value: "1",
        color: "text-orange-600 dark:text-orange-400",
        icon: Radio,
      },
      {
        label: "Payment Gateway",
        value: "Yes",
        color: "text-cyan-600 dark:text-cyan-400",
        icon: CreditCard,
      },
      {
        label: "Whatsapp",
        value: "Yes",
        color: "text-green-600 dark:text-green-400",
        icon: MessageCircle,
      },
      {
        label: "Clientarea",
        value: "Yes",
        color: "text-purple-600 dark:text-purple-400",
        icon: UsersIcon,
      },
    ],
  },
  {
    id: 2,
    name: "Trial",
    price: "Rp. 0",
    limitations: [
      {
        label: "Router",
        value: "1",
        color: "text-emerald-600 dark:text-emerald-400",
        icon: Server,
      },
      {
        label: "PPPoE",
        value: "5",
        color: "text-blue-600 dark:text-blue-400",
        icon: Network,
      },
      {
        label: "Hotspot",
        value: "5",
        color: "text-amber-600 dark:text-amber-400",
        icon: Wifi,
      },
      {
        label: "OLT",
        value: "1",
        color: "text-orange-600 dark:text-orange-400",
        icon: Radio,
      },
      {
        label: "Payment Gateway",
        value: "Yes",
        color: "text-cyan-600 dark:text-cyan-400",
        icon: CreditCard,
      },
      {
        label: "Whatsapp",
        value: "Yes",
        color: "text-green-600 dark:text-green-400",
        icon: MessageCircle,
      },
      {
        label: "Clientarea",
        value: "Yes",
        color: "text-purple-600 dark:text-purple-400",
        icon: UsersIcon,
      },
    ],
  },
];
