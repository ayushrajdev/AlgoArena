import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Code2 } from "lucide-react";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:3000/api/v1/auth/login",
                form,
                {
                    withCredentials: true,
                }
            );

            console.log(res.data);

            // Store access token if your backend returns it
            // localStorage.setItem("token", res.data.accessToken);

            navigate("/problems");
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-8">

                <div className="flex justify-center mb-6">
                    <div className="bg-cyan-500/10 p-4 rounded-full">
                        <Code2 size={42} className="text-cyan-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-white">
                    Welcome Back
                </h1>

                <p className="text-slate-400 text-center mt-2 mb-8">
                    Login to continue solving problems.
                </p>

                <form
                    className="space-y-5"
                    onSubmit={handleLogin}
                >
                    <div>
                        <label className="text-sm text-slate-300">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="mt-2 w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-300">
                            Password
                        </label>

                        <div className="relative mt-2">
                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-3 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 transition rounded-lg py-3 font-semibold text-black disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-cyan-400 hover:text-cyan-300"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;