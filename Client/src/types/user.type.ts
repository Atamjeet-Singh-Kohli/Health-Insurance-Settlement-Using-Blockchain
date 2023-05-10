export interface User {
  id?: number;
  pID: string;
  fName: string;
  lName: string;
  insID?: string;
  city: string;
  state: string;
  phone: number | null;
  email: string;
  dob: Date | null;
  sex: SX | null;
}

enum SX {
  male = 1,
  female = 2,
  other = 3,
}
