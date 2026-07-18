import { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = (location.state as { from?: string })?.from || "/problems";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await login(email, password);
            navigate(redirectTo, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0B1120] text-slate-100 px-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="font-semibold text-lg">
                        algo<span className="text-cyan-400">.judge</span>
                    </span>
                    <h1 className="text-2xl font-semibold mt-6">Welcome back</h1>
                    <p className="text-slate-400 text-sm mt-1">Log in to continue solving.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none rounded-lg px-3 py-2.5 text-sm transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none rounded-lg px-3 py-2.5 text-sm transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 bg-cyan-400 text-[#0B1120] font-medium py-2.5 rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-60"
                    >
                        {submitting && <Loader2 size={16} className="animate-spin" />}
                        Log in
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-cyan-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;