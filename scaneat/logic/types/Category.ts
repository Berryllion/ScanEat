import { Dish } from "./Dish";

export interface Category {
  id: number;
  name: string;
  dishes: Array<Dish>;
}