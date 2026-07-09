export interface PaymentGatewayBank {
  name: string;
  label: string;
  accountNumber: string;
  status: string;
  lastUpdate: string;
}

export interface MootaAccount {
  fullname: string;
  email: string;
}

export const MOCK_BANKS: PaymentGatewayBank[] = [
  {
    name: "ALTAFOCUS MEDIA CENTER PT",
    label: "BCA Bisnis",
    accountNumber: "8161700053",
    status: "Active",
    lastUpdate: "12:07:21 03-03-2026",
  },
];

export const MOCK_MOOTA: MootaAccount = {
  fullname: "AltaFocus",
  email: "finance@altafocus.id",
};
