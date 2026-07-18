import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Layers, CheckCircle2, Flame } from "lucide-react";
import { ProblemData } from "../../types/problem.types";

function ProblemList() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<ProblemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("all");

    useEffect(() => {
        async function fetchProblems() {
            try {
                const res = await axios.get(
                    "http://localhost:4000/api/v1/problems"
                );
                setProblems(res.data.data);
            } finally {
                setLoading(false);
            }
        }
        fetchProblems();
    }, []);

    const filteredProblems = useMemo(() => {
        return problems.filter((problem) => {
            const titleMatch = problem.title
                .toLowerCase()
                .includes(search.toLowerCase());
            const difficultyMatch =
                difficulty === "all" || problem.difficulty === difficulty;
            return titleMatch && difficultyMatch;
        });
    }, [problems, search, difficulty]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-400 text-sm">Loading problems…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-6 md:px-20 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Problem Set</h1>
                <p className="text-slate-400 mt-2">
                    Sharpen your skills — pick a problem and start solving.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Total Problems"
                    value={problems.length}
                    icon={<Layers size={22} />}
                    accent="from-cyan-500/20 to-cyan-500/5 text-cyan-400"
                />
                <StatCard
                    title="Easy"
                    value={problems.filter((p) => p.difficulty === "easy").length}
                    icon={<CheckCircle2 size={22} />}
                    accent="from-green-500/20 to-green-500/5 text-green-400"
                />
                <StatCard
                    title="Medium + Hard"
                    value={problems.filter((p) => p.difficulty !== "easy").length}
                    icon={<Flame size={22} />}
                    accent="from-orange-500/20 to-orange-500/5 text-orange-400"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search
                        className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-500"
                        size={18}
                    />
                    <input
                        placeholder="Search problems..."
                        className="w-full bg-slate-800/70 rounded-xl py-3 pl-10 pr-4 outline-none border border-slate-700 focus:border-cyan-500 transition-colors placeholder:text-slate-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="bg-slate-800/70 rounded-xl px-4 border border-slate-700 focus:border-cyan-500 outline-none transition-colors"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="all">All difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full">
                    <thead className="bg-slate-900">
                        <tr className="text-left text-slate-400 text-sm">
                            <th className="p-4 font-medium">#</th>
                            <th className="font-medium">Title</th>
                            <th className="font-medium">Description</th>
                            <th className="font-medium">Difficulty</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProblems.map((problem, index) => (
                            <tr
                                key={problem._id}
                                onClick={() => navigate(`/problems/${problem._id}`)}
                                className="border-t border-slate-700 hover:bg-slate-800/70 transition cursor-pointer"
                            >
                                <td className="p-4 text-slate-500">{index + 1}</td>
                                <td className="font-semibold">{problem.title}</td>
                                <td className="text-gray-400 max-w-md truncate">
                                    {problem.description}
                                </td>
                                <td>
                                    <DifficultyBadge difficulty={problem.difficulty} />
                                </td>
                            </tr>
                        ))}

                        {filteredProblems.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-10 text-center text-slate-500">
                                    No problems match your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
    const colors = {
        easy: "bg-green-500/20 text-green-400",
        medium: "bg-yellow-500/20 text-yellow-400",
        hard: "bg-red-500/20 text-red-400",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1.5 ${
                colors[difficulty as keyof typeof colors]
            }`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {difficulty}
        </span>
    );
}

function StatCard({
    title,
    value,
    icon,
    accent,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    accent: string;
}) {
    return (
        <div
            className={`bg-gradient-to-br ${accent} rounded-xl p-6 border border-slate-700 bg-slate-800/40`}
        >
            <div className="flex items-center justify-between">
                <div className="text-gray-400">{title}</div>
                <div className="opacity-80">{icon}</div>
            </div>
            <div className="text-4xl font-bold mt-2">{value}</div>
        </div>
    );
}

export default ProblemList;