export interface SubAccount {
  id: number;
  username: string;
  role: string;
}

export const MOCK_SUB_ACCOUNTS: SubAccount[] = [
  { id: 1, username: "operator1", role: "Operator" },
  { id: 2, username: "teknisi1", role: "Technician" },
];
