import type {Product} from "@/types/products.ts";
import type {User} from "@/types/users.ts";

export interface Order {
    id: number;
    number: string;
    status: string;
    user: User;
    date: string;
    change_date: string;
    delivery_date: string;
    comment: string;
    products: Omit<Product, 'variations'>[];
}