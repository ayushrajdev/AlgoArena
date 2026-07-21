import { useEffect, useRef, useState, DragEvent, ReactNode } from 'react';
import AceEditor from 'react-ace';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import '../../imports/AceBuildImports';
import DOMPurify from 'dompurify';
import {
    FileText, Lightbulb, Code2, History, Tag, Building2, ListChecks,
    StickyNote, Play, Send, RotateCcw, ChevronDown, Loader2, CheckCircle2,
    XCircle, AlertTriangle, AlertOctagon, TerminalSquare, Eye, Sparkles,
} from 'lucide-react';

import Languages from '../../constants/Languages';
import Themes from '../../constants/Themes';
import { ProblemData, CodeStub, Solution, SubmissionResult } from '../../types/problem.types';

type languageSupport = { languageName: string; value: string };
type themeStyle = { themeName: string; value: string };

const ACE_MODE_MAP: Record<string, string> = {
    cpp: 'c_cpp',
    java: 'java',
    python: 'python',
    javascript: 'javascript',
};

const DIFFICULTY_STYLES: Record<string, { chip: string; dot: string }> = {
    easy: { chip: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/25', dot: 'bg-emerald-400' },
    medium: { chip: 'text-amber-400 bg-amber-500/10 ring-amber-500/25', dot: 'bg-amber-400' },
    hard: { chip: 'text-rose-400 bg-rose-500/10 ring-rose-500/25', dot: 'bg-rose-400' },
};

const LEFT_TABS = [
    { id: 'statement', label: 'Statement', icon: FileText },
    { id: 'editorial', label: 'Editorial', icon: Lightbulb },
    { id: 'solutions', label: 'Solutions', icon: Code2 },
    { id: 'submissions', label: 'Submissions', icon: History },
] as const;

function Description({
    problem,
    onSubmit,
    submission,
}: {
    problem: ProblemData;
    onSubmit: (code: string, language: string) => void;
    submission: SubmissionResult;
}) {
    const sanitizedMarkdown = DOMPurify.sanitize(problem.description);
    const testCases = problem.testCases ?? [];
    const codeStubs: CodeStub[] = problem.codeStubs ?? [];
    const solutions: Solution[] = problem.solutions ?? [];

    const [activeTab, setActiveTab] = useState<(typeof LEFT_TABS)[number]['id']>('statement');
    const [testCaseTab, setTestCaseTab] = useState<'input' | 'output' | 'result'>('input');
    const [activeCase, setActiveCase] = useState(0);
    const [consoleOpen, setConsoleOpen] = useState(true);

    // ---- layout / responsiveness ----
    const [leftWidth, setLeftWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
    );
    const [mobileView, setMobileView] = useState<'problem' | 'code'>('problem');

    useEffect(() => {
        const onResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // ---- editor state ----
    const [language, setLanguage] = useState<string>(codeStubs[0]?.language ?? 'cpp');
    const [theme, setTheme] = useState('monokai');
    const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>({});
    const [submittedCode, setSubmittedCode] = useState<string | null>(null);
    const editorRef = useRef<any>(null);

    const currentStub = codeStubs.find((s) => s.language === language);
    const code = codeByLanguage[language] ?? currentStub?.template ?? '';
    const submitting = submission.status === 'pending';
    const isStale = submission.status === 'completed' && submittedCode !== null && submittedCode !== code;

    // seed each language's code from its template the first time it's selected
    useEffect(() => {
        setCodeByLanguage((prev) => {
            if (prev[language] !== undefined) return prev;
            const stub = codeStubs.find((s) => s.language === language);
            return { ...prev, [language]: stub?.template ?? '' };
        });
    }, [language, codeStubs]);

    // when a submission starts resolving, jump to the Result tab and open the console
    useEffect(() => {
        if (submission.status === 'pending' || submission.status === 'completed') {
            setTestCaseTab('result');
            setConsoleOpen(true);
        }
    }, [submission.status]);

    function handleEditorChange(newValue: string) {
        setCodeByLanguage((prev) => ({ ...prev, [language]: newValue }));
    }

    function handleResetTemplate() {
        if (!currentStub) return;
        if (!window.confirm('Reset your code back to the starter template?')) return;
        setCodeByLanguage((prev) => ({ ...prev, [language]: currentStub.template }));
        editorRef.current?.setValue(currentStub.template, -1);
    }

    function handleSubmit() {
        setSubmittedCode(code);
        onSubmit(code, language);
    }

    // ---- drag-to-resize (desktop only) ----
    const startDragging = (e: DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.preventDefault();
    };
    const stopDragging = () => {
        if (isDragging) setIsDragging(false);
    };
    const onDrag = (e: DragEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const w = (e.clientX / window.innerWidth) * 100;
        if (w > 20 && w < 80) setLeftWidth(w);
    };

    return (
        <div
            className="flex flex-col lg:flex-row w-full h-[calc(100vh-57px)] bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#0b1120] text-slate-100"
            onMouseMove={onDrag}
            onMouseUp={stopDragging}
        >
            {/* Mobile Problem / Code switcher */}
            <div className="lg:hidden flex border-b border-slate-800/80 bg-[#0f172a]/95 backdrop-blur sticky top-0 z-20">
                {(['problem', 'code'] as const).map((v) => (
                    <button
                        key={v}
                        className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                            mobileView === v
                                ? 'text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-slate-500 border-b-2 border-transparent'
                        }`}
                        onClick={() => setMobileView(v)}
                    >
                        {v}
                    </button>
                ))}
            </div>

            {/* LEFT: problem panel */}
            <div
                className={`h-full overflow-auto ${mobileView === 'problem' ? 'block' : 'hidden'} lg:block`}
                style={{ width: isDesktop ? `${leftWidth}%` : '100%' }}
            >
                <div className="flex items-center gap-0.5 border-b border-slate-800/80 px-2 overflow-x-auto no-scrollbar bg-[#0f172a]/60 backdrop-blur sticky top-0 z-10">
                    {LEFT_TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-1.5 px-3.5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                activeTab === id
                                    ? 'border-cyan-400 text-white'
                                    : 'border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {activeTab === 'statement' && (
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{problem.title}</h1>
                            <DifficultyBadge difficulty={problem.difficulty} />
                        </div>

                        {(!!problem.tags?.length || !!problem.companies?.length) && (
                            <div className="flex flex-col gap-2.5 mb-6">
                                {!!problem.tags?.length && (
                                    <PillRow icon={Tag} items={problem.tags} color="bg-slate-800/80 text-slate-300 ring-1 ring-slate-700" />
                                )}
                                {!!problem.companies?.length && (
                                    <PillRow icon={Building2} items={problem.companies} color="bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/25" />
                                )}
                            </div>
                        )}

                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            className="prose prose-invert prose-sm sm:prose-base max-w-none prose-pre:bg-slate-900 prose-code:text-cyan-300"
                        >
                            {sanitizedMarkdown}
                        </ReactMarkdown>

                        {!!problem.constraints?.length && (
                            <Section icon={ListChecks} title="Constraints">
                                <ul className="bg-slate-800/40 border-l-2 border-cyan-500/40 rounded-r-lg p-4 space-y-1.5">
                                    {problem.constraints.map((c, i) => (
                                        <li key={i} className="font-mono text-sm text-slate-300">{c}</li>
                                    ))}
                                </ul>
                            </Section>
                        )}

                        {testCases.length > 0 && (
                            <Section icon={Sparkles} title="Examples">
                                <div className="space-y-3">
                                    {testCases.map((tc, i) => (
                                        <div
                                            key={tc._id ?? i}
                                            className="group bg-slate-800/60 hover:bg-slate-800 rounded-lg p-4 border border-slate-700/80 transition-colors"
                                        >
                                            <div className="text-xs text-slate-500 mb-2 font-semibold tracking-wide uppercase">
                                                Example {i + 1}
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-slate-500">Input: </span>
                                                <code className="text-cyan-300">{tc.input}</code>
                                            </div>
                                            <div className="text-sm mt-1">
                                                <span className="text-slate-500">Output: </span>
                                                <code className="text-emerald-300">{tc.output}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {!!problem.notes?.length && (
                            <Section icon={StickyNote} title="Notes">
                                <ul className="space-y-2">
                                    {problem.notes.map((n, i) => (
                                        <li key={i} className="text-sm text-slate-400 flex gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-cyan-500/70 mt-0.5 shrink-0" />
                                            <span>{n}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}
                    </div>
                )}

                {activeTab === 'editorial' && (
                    <div className="p-4 sm:p-6">
                        {problem.editorial ? (
                            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{problem.editorial}</p>
                        ) : (
                            <EmptyState icon={Lightbulb} text="Editorial coming soon." />
                        )}
                    </div>
                )}

                {activeTab === 'solutions' && <SolutionsPanel solutions={solutions} theme={theme} />}

                {activeTab === 'submissions' && (
                    <div className="p-4 sm:p-6">
                        <EmptyState icon={History} text="No submissions yet." />
                    </div>
                )}
            </div>

            {/* Drag handle */}
            <div
                className="hidden lg:flex items-center justify-center w-[6px] bg-slate-800/60 hover:bg-cyan-600/60 cursor-col-resize transition-colors h-full"
                onMouseDown={startDragging}
            />

            {/* RIGHT: editor panel */}
            <div
                className={`h-full overflow-auto flex flex-col ${mobileView === 'code' ? 'flex' : 'hidden'} lg:flex`}
                style={{ width: isDesktop ? `${100 - leftWidth}%` : '100%' }}
            >
                <div className="flex flex-wrap gap-2 items-center px-3 sm:px-4 py-2.5 border-b border-slate-800/80 bg-[#0f172a]/60 backdrop-blur sticky top-0 z-10">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !code.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 active:scale-95 shadow-lg shadow-emerald-900/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {submitting ? 'Judging…' : 'Submit'}
                    </button>

                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-amber-300 border border-amber-500/40 hover:bg-amber-500/10 active:scale-95 transition-all">
                        <Play className="w-4 h-4" />
                        Run Code
                    </button>

                    <button
                        onClick={handleResetTemplate}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>

                    <SelectField
                        value={language}
                        onChange={setLanguage}
                        options={Languages.map((l: languageSupport) => ({ value: l.value, label: l.languageName }))}
                    />
                    <SelectField
                        value={theme}
                        onChange={setTheme}
                        options={Themes.map((t: themeStyle) => ({ value: t.value, label: t.themeName }))}
                    />

                    <div className="ml-auto">
                        <StatusPill submission={submission} isStale={isStale} />
                    </div>
                </div>

                <div className="flex flex-col grow min-h-0">
                    <div className="grow min-h-[240px] m-2 mb-0 rounded-lg overflow-hidden border border-slate-800 shadow-inner">
                        <AceEditor
                            mode={ACE_MODE_MAP[language] ?? language}
                            theme={theme}
                            value={code}
                            onChange={handleEditorChange}
                            onLoad={(editor) => {
                                editorRef.current = editor;
                            }}
                            name="codeEditor"
                            style={{ width: '100%' }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                showLineNumbers: true,
                                fontSize: 15,
                                tabSize: 4,
                            }}
                            height="100%"
                        />
                    </div>

                    <div className="m-2 mt-3 rounded-lg border border-slate-800 overflow-hidden shrink-0">
                        <button
                            onClick={() => setConsoleOpen((o) => !o)}
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900/70 hover:bg-slate-900 transition-colors"
                        >
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                                <TerminalSquare className="w-4 h-4" />
                                Console
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${consoleOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {consoleOpen && (
                            <div className="p-4 bg-slate-950/50 max-h-72 overflow-auto">
                                <div className="flex items-center gap-1 mb-3">
                                    {(['input', 'output', 'result'] as const).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTestCaseTab(t)}
                                            className={`relative px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                                                testCaseTab === t ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800'
                                            }`}
                                        >
                                            {t}
                                            {t === 'result' && submission.status === 'pending' && (
                                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                            )}
                                            {t === 'result' && isStale && (
                                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {testCaseTab !== 'result' && testCases.length > 1 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {testCases.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveCase(i)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                                    activeCase === i ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                            >
                                                Case {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {testCaseTab === 'result' ? (
                                    <SubmissionResultView submission={submission} isStale={isStale} />
                                ) : (
                                    <textarea
                                        rows={4}
                                        readOnly
                                        value={
                                            testCaseTab === 'input'
                                                ? testCases[activeCase]?.input ?? ''
                                                : testCases[activeCase]?.output ?? ''
                                        }
                                        className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-sm text-slate-200 resize-none w-full focus:outline-none"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------- small presentational helpers ----------

function DifficultyBadge({ difficulty }: { difficulty: string }) {
    const s = DIFFICULTY_STYLES[difficulty];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${s?.chip ?? ''}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s?.dot ?? ''}`} />
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
    );
}

function PillRow({ icon: Icon, items, color }: { icon: any; items: string[]; color: string }) {
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 text-slate-500 mr-0.5" />
            {items.map((item) => (
                <span key={item} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                    {item}
                </span>
            ))}
        </div>
    );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: ReactNode }) {
    return (
        <div className="mt-7">
            <h3 className="flex items-center gap-2 text-sm font-semibold mb-3 text-slate-200 uppercase tracking-wide">
                <Icon className="w-4 h-4 text-cyan-400" />
                {title}
            </h3>
            {children}
        </div>
    );
}

function EmptyState({ icon: Icon, text }: { icon: any; text: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-500">
            <Icon className="w-8 h-8 opacity-40" />
            <p className="text-sm">{text}</p>
        </div>
    );
}

function SelectField({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-slate-800/80 border border-slate-700 hover:border-slate-600 focus:border-cyan-500/60 focus:outline-none rounded-lg pl-3 pr-8 py-2 text-sm text-slate-200 transition-colors cursor-pointer"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
    );
}

function StatusPill({ submission, isStale }: { submission: SubmissionResult; isStale: boolean }) {
    if (submission.status === 'pending') {
        return (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-300 bg-slate-800/70">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                Judging…
            </span>
        );
    }
    if (submission.status === 'completed' && submission.networkError) {
        return (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-red-400 bg-red-500/10">
                <AlertTriangle className="w-3.5 h-3.5" />
                {submission.networkError}
            </span>
        );
    }
    if (submission.status === 'completed') {
        if (isStale) {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-amber-400 bg-amber-500/10">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Code changed
                </span>
            );
        }
        return submission.isError ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-red-400 bg-red-500/10">
                <XCircle className="w-3.5 h-3.5" />
                Error
            </span>
        ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-500/10">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Submitted
            </span>
        );
    }
    return null;
}

function SubmissionResultView({ submission, isStale }: { submission: SubmissionResult; isStale: boolean }) {
    if (submission.status === 'idle') {
        return (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-500 border border-dashed border-slate-800 rounded-lg animate-fade-in">
                <Send className="w-6 h-6 opacity-40" />
                <p className="text-sm">Submit your code to see the result here.</p>
            </div>
        );
    }

    if (submission.status === 'pending') {
        return (
            <div className="flex items-center gap-2.5 text-slate-400 text-sm py-6 animate-fade-in">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                Running your code against the test cases…
            </div>
        );
    }

    if (submission.networkError) {
        return (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-lg p-4 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-300">{submission.networkError}</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {isStale && (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-3">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-300">
                        You've edited the code since this run. Resubmit to see a result for the current code.
                    </p>
                </div>
            )}

            {submission.isError ? (
                <>
                    <div className="flex items-center gap-2 mb-2.5">
                        <AlertOctagon className="w-4 h-4 text-red-400" />
                        <p className="text-red-400 font-semibold text-sm">Compilation / Runtime Error</p>
                    </div>
                    <pre className="bg-slate-900 text-red-300 text-xs p-3.5 rounded-lg overflow-x-auto whitespace-pre-wrap border border-red-500/20 leading-relaxed">
                        {submission.errorMessage}
                    </pre>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2 mb-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <p className="text-emerald-400 font-semibold text-sm">Ran successfully</p>
                    </div>
                    {(() => {
                        const data = submission.resultData ?? {};
                        const hasKnownFields = 'verdict' in data || 'passed' in data;
                        const hasAnyData = Object.keys(data).length > 0;
                        if (hasKnownFields) {
                            return (
                                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-3.5 text-sm text-slate-300 space-y-1">
                                    {'verdict' in data && (
                                        <p>Verdict: <span className="text-emerald-300 font-medium">{String(data.verdict)}</span></p>
                                    )}
                                    {'passed' in data && (
                                        <p>Passed: <span className="font-medium">{String(data.passed)}</span></p>
                                    )}
                                </div>
                            );
                        }
                        if (hasAnyData) {
                            return (
                                <pre className="bg-slate-900 text-slate-300 text-xs p-3.5 rounded-lg overflow-x-auto whitespace-pre-wrap border border-slate-800 leading-relaxed">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            );
                        }
                        return <p className="text-slate-500 text-sm">No additional details were returned.</p>;
                    })()}
                </>
            )}
        </div>
    );
}

function SolutionsPanel({ solutions, theme }: { solutions: Solution[]; theme: string }) {
    const [revealed, setRevealed] = useState(false);
    const [solLang, setSolLang] = useState(solutions[0]?.language ?? 'cpp');

    if (!solutions.length) {
        return (
            <div className="p-4 sm:p-6">
                <EmptyState icon={Code2} text="No solution available yet." />
            </div>
        );
    }

    if (!revealed) {
        return (
            <div className="p-4 sm:p-6">
                <div className="flex flex-col items-center gap-3 bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-8 text-center">
                    <Eye className="w-6 h-6 text-slate-500" />
                    <p className="text-slate-300 text-sm">Try solving it yourself first — solutions are hidden by default.</p>
                    <button
                        onClick={() => setRevealed(true)}
                        className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        Show Solution
                    </button>
                </div>
            </div>
        );
    }

    const active = solutions.find((s) => s.language === solLang) ?? solutions[0];

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-wrap gap-1.5 mb-3">
                {solutions.map((s) => (
                    <button
                        key={s.language}
                        onClick={() => setSolLang(s.language)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                            solLang === s.language ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        {s.language}
                    </button>
                ))}
            </div>
            <div className="rounded-lg overflow-hidden border border-slate-800 shadow-inner h-[420px]">
                <AceEditor
                    mode={ACE_MODE_MAP[active.language] ?? active.language}
                    theme={theme}
                    value={active.code}
                    readOnly
                    name="solutionViewer"
                    width="100%"
                    height="100%"
                    setOptions={{ showLineNumbers: true, fontSize: 15, useWorker: false }}
                />
            </div>
        </div>
    );
}

export default Description;