import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Code2, Eye, EyeOff } from "lucide-react";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/api/v1/auth/register",
                {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                },
                {
                    withCredentials: true,
                }
            );

            navigate("/login");
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Unable to register. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

                <div className="flex justify-center mb-6">
                    <div className="bg-cyan-500/10 p-4 rounded-full">
                        <Code2 className="text-cyan-400" size={42} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-white">
                    Create Account
                </h1>

                <p className="text-slate-400 text-center mt-2 mb-8">
                    Join and start solving coding problems.
                </p>

                <form
                    onSubmit={handleRegister}
                    className="space-y-5"
                >
                    <div>
                        <label className="text-slate-300 text-sm">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                            className="mt-2 w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 text-sm">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                            className="mt-2 w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 text-sm">
                            Password
                        </label>

                        <div className="relative mt-2">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Create password"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
                            />

                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-300 text-sm">
                            Confirm Password
                        </label>

                        <div className="relative mt-2">
                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
                                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
                            />

                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword ? (
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
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all rounded-lg py-3 font-semibold text-black disabled:opacity-60"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-cyan-400 hover:text-cyan-300"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;