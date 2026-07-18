export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    role: "user" | "admin";
}