export enum UserType {
  CLIENT = "client",
  PRO = 'pro',
  ADMIN = 'admin',
}

export interface User {
  email: string;
  firstname: string;
  lastname: string;
  type: UserType;
  restaurantId?: string;
}
