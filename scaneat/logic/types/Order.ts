import { OrderDish } from "./OrderDish";

export enum OrderStatus {
  WAITING = "waiting",
  CONFIRMED = "confirmed",
  REFUSED = "refused",
  FINISHED = "finished",
}

export interface Order {
  id: number;
  price: number;
  table: number;
  status: OrderStatus;
  paid: boolean;
  restaurantName: string;
  dishes?: Array<OrderDish>;
  createdAt: Date;
}