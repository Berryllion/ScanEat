import { Category } from "./Category";

export interface Dish {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: Category;
}