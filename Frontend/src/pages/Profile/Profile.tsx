import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pencil, Check, X, Loader2 } from "lucide-react";

interface UserProfile {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
}

interface AttemptedProblem {
    problemId: string;
    title: string;
    difficulty: "easy" | "medium" | "hard";
    status: "solved" | "attempted" | "failed";
    lastAttemptedAt: string;
}

function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [attempts, setAttempts] = useState<AttemptedProblem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "solved" | "attempted" | "failed">("all");

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", username: "", bio: "" });

    useEffect(() => {
        async function fetchData() {
            try {
                const [userRes, attemptsRes] = await Promise.all([
                    axios.get("http://localhost:4000/api/v1/users/me"),
                    axios.get("http://localhost:4000/api/v1/users/me/attempts"),
                ]);
                setUser(userRes.data.data);
                setAttempts(attemptsRes.data.data);
                setForm({
                    name: userRes.data.data.name ?? "",
                    username: userRes.data.data.username ?? "",
                    bio: userRes.data.data.bio ?? "",
                });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    async function handleSave() {
        if (!user) return;
        setSaving(true);
        try {
            const res = await axios.put(
                `http://localhost:4000/api/v1/users/${user._id}`,
                form
            );
            setUser(res.data.data);
            setEditing(false);
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        if (!user) return;
        setForm({ name: user.name, username: user.username, bio: user.bio ?? "" });
        setEditing(false);
    }

    const filteredAttempts = attempts.filter(
        (a) => filter === "all" || a.status === filter
    );

    const solvedCount = attempts.filter((a) => a.status === "solved").length;

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0B1120]">
                <Loader2 className="animate-spin text-cyan-400" size={28} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0B1120] text-slate-400">
                Couldn't load your profile.
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full overflow-y-auto bg-[#0B1120] text-slate-100 font-sans">
            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* PROFILE HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 pb-10 border-b border-slate-800">
                    <img
                        src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-20 h-20 rounded-full border border-slate-700 shrink-0"
                    />

                    <div className="flex-1 w-full">
                        {!editing ? (
                            <>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-2xl font-semibold">{user.name}</h1>
                                        <p className="text-slate-500 text-sm mt-0.5">@{user.username}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </button>
                                </div>
                                <p className="text-slate-400 text-sm mt-3 max-w-md">
                                    {user.bio || "No bio yet."}
                                </p>
                                <p className="text-slate-600 text-sm mt-2">{user.email}</p>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Name</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none rounded-lg px-3 py-2 text-sm transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Username</label>
                                    <input
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none rounded-lg px-3 py-2 text-sm transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">Bio</label>
                                    <textarea
                                        value={form.bio}
                                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                        rows={2}
                                        className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none rounded-lg px-3 py-2 text-sm resize-none transition-colors"
                                    />
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-1.5 bg-cyan-400 text-[#0B1120] font-medium text-sm px-4 py-2 rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-60"
                                    >
                                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
                                    >
                                        <X size={14} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* STATS */}
                <div className="flex gap-10 py-8 border-b border-slate-800">
                    <div>
                        <div className="text-2xl font-semibold text-cyan-400">{attempts.length}</div>
                        <div className="text-slate-500 text-sm mt-0.5">attempted</div>
                    </div>
                    <div>
                        <div className="text-2xl font-semibold text-green-400">{solvedCount}</div>
                        <div className="text-slate-500 text-sm mt-0.5">solved</div>
                    </div>
                    <div>
                        <div className="text-2xl font-semibold text-slate-300">
                            {attempts.length > 0 ? Math.round((solvedCount / attempts.length) * 100) : 0}%
                        </div>
                        <div className="text-slate-500 text-sm mt-0.5">success rate</div>
                    </div>
                </div>

                {/* ATTEMPTED PROBLEMS */}
                <div className="py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Attempted problems</h2>
                        <div className="flex gap-1 text-sm">
                            {(["all", "solved", "attempted", "failed"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${
                                        filter === f
                                            ? "bg-slate-800 text-white"
                                            : "text-slate-500 hover:text-slate-300"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredAttempts.length === 0 ? (
                        <p className="text-slate-500 text-sm py-8 text-center">
                            No problems here yet.
                        </p>
                    ) : (
                        <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
                            {filteredAttempts.map((a) => (
                                <Link
                                    key={a.problemId}
                                    to={`/problems/${a.problemId}`}
                                    className="flex items-center justify-between py-4 px-2 hover:bg-slate-900/40 transition-colors"
                                >
                                    <div>
                                        <div className="font-medium">{a.title}</div>
                                        <div className="text-slate-600 text-xs mt-0.5">
                                            Last attempted {new Date(a.lastAttemptedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <DifficultyLabel difficulty={a.difficulty} />
                                        <StatusBadge status={a.status} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DifficultyLabel({ difficulty }: { difficulty: string }) {
    const colors: Record<string, string> = {
        easy: "text-green-400",
        medium: "text-amber-400",
        hard: "text-red-400",
    };
    return <span className={`text-sm font-medium ${colors[difficulty]}`}>{difficulty}</span>;
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        solved: "bg-green-500/10 text-green-400",
        attempted: "bg-amber-500/10 text-amber-400",
        failed: "bg-red-500/10 text-red-400",
    };
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>
            {status}
        </span>
    );
}

export default ProfilePage;