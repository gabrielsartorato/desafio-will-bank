export interface ICustomer {
  customerID: string;
  agency: string;
  account: string;
}

export interface ICustomerBank {
  bank: string;
  customers: ICustomer[];
}
