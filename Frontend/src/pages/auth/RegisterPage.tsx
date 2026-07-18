import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function update(field: keyof typeof form, value: string) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setSubmitting(true);
        try {
            await register(form);
            navigate("/problems", { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0B1120] text-slate-100 px-6 py-16">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="font-semibold text-lg">
                        algo<span className="text-cyan-400">.judge</span>
                    </span>
                    <h1 className="text-2xl font-semibold mt-6">Create your account</h1>
                    <p className="text-slate-400 text-sm mt-1">Start solving in under a minute.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Name</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none rounded-lg px-3 py-2.5 text-sm transition-colors"
                            placeholder="Jane Doe"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Username</label>
                        <input
                            required
                            value={form.username}
                            onChange={(e) => update("username", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none rounded-lg px-3 py-2.5 text-sm transition-colors"
                            placeholder="janedoe"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none rounded-lg px-3 py-2.5 text-sm transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={form.password}
                            onChange={(e) => update("password", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none rounded-lg px-3 py-2.5 text-sm transition-colors"
                            placeholder="At least 6 characters"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 bg-cyan-400 text-[#0B1120] font-medium py-2.5 rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-60"
                    >
                        {submitting && <Loader2 size={16} className="animate-spin" />}
                        Create account
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-cyan-400 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;