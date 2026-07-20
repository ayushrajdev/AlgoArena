import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const SAMPLE_PROBLEMS = [
    { id: 1, title: 'Two Sum', difficulty: 'easy' },
    { id: 2, title: 'LRU Cache', difficulty: 'medium' },
    { id: 3, title: 'Median of Two Sorted Arrays', difficulty: 'hard' },
    { id: 4, title: 'Valid Parentheses', difficulty: 'easy' },
];

function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);



    return (
        <div className="min-h-screen w-full overflow-y-auto bg-[#0B1120] text-slate-100 font-sans">
            {/* NAV */}
            <header className="border-b border-slate-800/80">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="font-semibold tracking-tight text-lg">
                        algo<span className="text-cyan-400">.judge</span>
                    </span>

                    <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
                        <a
                            href="#features"
                            className="hover:text-white transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#problems"
                            className="hover:text-white transition-colors"
                        >
                            Problems
                        </a>
                    </nav>

                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/login"
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="text-sm font-medium bg-white text-[#0B1120] px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Get started
                        </Link>
                    </div>

                    <button
                        className="md:hidden text-slate-300"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden border-t border-slate-800 px-6 py-4 flex flex-col gap-4 text-sm">
                        <a href="#features" onClick={() => setMenuOpen(false)}>
                            Features
                        </a>
                        <a href="#problems" onClick={() => setMenuOpen(false)}>
                            Problems
                        </a>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            onClick={() => setMenuOpen(false)}
                            className="bg-white text-[#0B1120] text-center px-4 py-2 rounded-lg font-medium"
                        >
                            Get started
                        </Link>
                    </div>
                )}
            </header>

            {/* HERO */}
            <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                    Practice code.
                    <br />
                    Get judged instantly.
                </h1>
                <p className="text-slate-400 text-lg mt-5 max-w-xl mx-auto">
                    Solve algorithm problems, run against real test cases, and
                    see exactly how your solution stacks up.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <Link
                        to="/signup"
                        className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-[#0B1120] font-medium px-6 py-3 rounded-lg hover:bg-cyan-300 transition-colors"
                    >
                        Start solving
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        to="/problems"
                        className="inline-flex items-center justify-center gap-2 border border-slate-700 px-6 py-3 rounded-lg hover:border-slate-500 transition-colors"
                    >
                        Browse problems
                    </Link>
                </div>
            </section>

            {/* FEATURES — simple, no cards */}
            <section id="features" className="border-t border-slate-800/80">
                <div className="max-w-3xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-10 text-center">
                    <div>
                        <div className="text-cyan-400 font-mono text-sm mb-2">
                            01
                        </div>
                        <h3 className="font-semibold mb-1">Real editor</h3>
                        <p className="text-slate-400 text-sm">
                            Syntax highlighting and multi-language support,
                            right in the browser.
                        </p>
                    </div>
                    <div>
                        <div className="text-cyan-400 font-mono text-sm mb-2">
                            02
                        </div>
                        <h3 className="font-semibold mb-1">Instant judging</h3>
                        <p className="text-slate-400 text-sm">
                            Submit and see your result against real test cases
                            immediately.
                        </p>
                    </div>
                    <div>
                        <div className="text-cyan-400 font-mono text-sm mb-2">
                            03
                        </div>
                        <h3 className="font-semibold mb-1">Track progress</h3>
                        <p className="text-slate-400 text-sm">
                            See what you've solved and pick up where you left
                            off.
                        </p>
                    </div>
                </div>
            </section>

            {/* PROBLEM PREVIEW — plain table, matches app style */}
            <section id="problems" className="border-t border-slate-800/80">
                <div className="max-w-3xl mx-auto px-6 py-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">
                            A few problems to try
                        </h2>
                        <Link
                            to="/problems"
                            className="text-sm text-cyan-400 hover:underline"
                        >
                            See all
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
                        {SAMPLE_PROBLEMS.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center justify-between py-4 hover:bg-slate-900/40 px-2 transition-colors cursor-pointer"
                            >
                                <span className="font-medium">{p.title}</span>
                                <DifficultyLabel difficulty={p.difficulty} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-slate-800/80">
                <div className="max-w-3xl mx-auto px-6 py-16 text-center">
                    <h2 className="text-2xl font-semibold">Ready to start?</h2>
                    <p className="text-slate-400 mt-2">
                        Free to use. No setup required.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 bg-cyan-400 text-[#0B1120] font-medium px-6 py-3 rounded-lg hover:bg-cyan-300 transition-colors mt-6"
                    >
                        Create free account
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-800/80">
                <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <span>algo.judge</span>
                    <span>© {new Date().getFullYear()}</span>
                </div>
            </footer>
        </div>
    );
}

function DifficultyLabel({ difficulty }: { difficulty: string }) {
    const colors: Record<string, string> = {
        easy: 'text-green-400',
        medium: 'text-amber-400',
        hard: 'text-red-400',
    };
    return (
        <span className={`text-sm font-medium ${colors[difficulty]}`}>
            {difficulty}
        </span>
    );
}

export default LandingPage;
