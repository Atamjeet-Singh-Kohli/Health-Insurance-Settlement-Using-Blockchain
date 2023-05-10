import { User } from './user.type';

export interface Bill {
  id?: number;
  bID?: number;
  cID?: number;
  patient: any;
  billID: string;
  date: Date | null;
  amount?: string;
  status?: string;
}

export const BillStatus = [
  "Bill Generated",
  "Claim Submitted \n Awaiting Agency Response",
  "Claim Accepted", "Claim Rejected", "Bill Payed"

]
