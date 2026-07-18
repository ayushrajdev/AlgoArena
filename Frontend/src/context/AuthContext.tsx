import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import api from "../lib/axios";
import { User } from "../types/user.types";

interface RegisterPayload {
    name: string;
    username: string;
    email: string;
    password: string;
}

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshUser() {
        try {
            const res = await api.get("/users/me");
            setUser(res.data.data);
        } catch {
            setUser(null);
        }
    }

    useEffect(() => {
        refreshUser().finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });
        setUser(res.data.data);
    }

    async function register(payload: RegisterPayload) {
        const res = await api.post("/auth/register", payload);
        setUser(res.data.data);
    }

    async function logout() {
        await api.post("/auth/logout");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}