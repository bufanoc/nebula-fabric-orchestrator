
export interface Policy {
  id: string;
  name: string;
  type: string;
  tenant: string;
  status: 'active' | 'inactive';
  appliedTo: number;
  created: string;
  description: string;
}

export const POLICY_TYPES = [
  "Access Control",
  "Quality of Service", 
  "Network Isolation",
  "Traffic Control"
] as const;

export type PolicyType = typeof POLICY_TYPES[number];
