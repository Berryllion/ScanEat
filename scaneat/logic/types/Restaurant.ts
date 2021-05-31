import { Category } from "./Category";
import { Dish } from "./Dish";
import { Order } from "./Order";

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  image: string;
  city: string;
  latt: number;
  long: number;
  categories: Array<Category>;
  dishes: Array<Dish>;
  orders?: Array<Order>;
}