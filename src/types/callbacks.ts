import type {User} from "@/types/users.ts";

export interface Callback {
    id: number;
    user_id: number | null;
    title: string;
    message: string;
    email: string;
    status: string;
    user?: User;
    date: string;
    update_date: string;
}