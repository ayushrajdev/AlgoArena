import { useState, DragEvent } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import '../../imports/AceBuildImports';
import DOMPurify from 'dompurify';

import Languages from '../../constants/Languages';
import Themes from '../../constants/Themes';
import { ProblemData } from '../../types/problem.types';

type languageSupport = { languageName: string; value: string };
type themeStyle = { themeName: string; value: string };

function Description({ problem }: { problem: ProblemData }) {
    const sanitizedMarkdown = DOMPurify.sanitize(problem.description);
    const testCases = problem.testCases ?? [];

    const [activeTab, setActiveTab] = useState('statement');
    const [testCaseTab, setTestCaseTab] = useState('input');
    const [activeCase, setActiveCase] = useState(0);
    const [leftWidth, setLeftWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [theme, setTheme] = useState('monokai');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    async function handleSubmission() {
        setSubmitting(true);
        setResult(null);
        try {
            const response = await axios.post(
                'http://localhost:3000/api/v1/submissions',
                {
                    code,
                    language,
                    userId: '69c23fc6abcc6633382566ba',
                    problemId: problem._id,
                },
            );
            setResult(response.data?.data?.verdict ?? 'Submitted');
        } catch (error) {
            setResult('Submission failed');
        } finally {
            setSubmitting(false);
        }
    }

    const startDragging = (e: DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.preventDefault();
    };

    const stopDragging = () => {
        if (isDragging) setIsDragging(false);
    };

    const onDrag = (e: DragEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const newLeftWidth = (e.clientX / window.innerWidth) * 100;
        if (newLeftWidth > 10 && newLeftWidth < 90) {
            setLeftWidth(newLeftWidth);
        }
    };

    const isActiveTab = (tabName: string) =>
        activeTab === tabName ? 'tab tab-active' : 'tab';

    const isInputTabActive = (tabName: string) =>
        testCaseTab === tabName ? 'tab tab-active' : 'tab';

    return (
        <div
            className="flex w-screen h-[calc(100vh-57px)] bg-[#0f172a] text-white"
            onMouseMove={onDrag}
            onMouseUp={stopDragging}
        >
            <div
                className="leftPanel h-full overflow-auto"
                style={{ width: `${leftWidth}%` }}
            >
                <div role="tablist" className="tabs tabs-boxed w-3/5">
                    <a onClick={() => setActiveTab('statement')} role="tab" className={isActiveTab('statement')}>
                        Problem Statement
                    </a>
                    <a onClick={() => setActiveTab('editorial')} role="tab" className={isActiveTab('editorial')}>
                        Editorial
                    </a>
                    <a onClick={() => setActiveTab('submissions')} role="tab" className={isActiveTab('submissions')}>
                        Submissions
                    </a>
                </div>

                {activeTab === 'statement' && (
                    <div className="markdownViewer p-[20px]">
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-2xl font-bold">{problem.title}</h1>
                            <DifficultyBadge difficulty={problem.difficulty} />
                        </div>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose prose-invert">
                            {sanitizedMarkdown}
                        </ReactMarkdown>

                        {testCases.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-3">Examples</h3>
                                <div className="space-y-4">
                                    {testCases.map((tc, i) => (
                                        <div key={i} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                            <div className="text-sm text-slate-400 mb-2">Example {i + 1}</div>
                                            <div className="text-sm">
                                                <span className="text-slate-400">Input: </span>
                                                <code className="text-cyan-300">{tc.input}</code>
                                            </div>
                                            <div className="text-sm mt-1">
                                                <span className="text-slate-400">Output: </span>
                                                <code className="text-green-300">{tc.output}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'editorial' && (
                    <div className="p-[20px] text-slate-400">Editorial coming soon.</div>
                )}

                {activeTab === 'submissions' && (
                    <div className="p-[20px] text-slate-400">No submissions yet.</div>
                )}
            </div>

            <div
                className="divider cursor-col-resize w-[5px] bg-slate-700 h-full"
                onMouseDown={startDragging}
            ></div>

            <div
                className="rightPanel h-full overflow-auto flex flex-col"
                style={{ width: `${100 - leftWidth}%` }}
            >
                <div className="flex gap-x-1.5 justify-start items-center px-4 py-2 basis-[5%]">
                    <button
                        className="btn btn-success btn-sm"
                        onClick={handleSubmission}
                        disabled={submitting || !code.trim()}
                    >
                        {submitting ? 'Submitting…' : 'Submit'}
                    </button>
                    <button className="btn btn-warning btn-sm">Run Code</button>

                    <select
                        className="select select-info w-full select-sm max-w-xs"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        {Languages.map((l: languageSupport) => (
                            <option key={l.value} value={l.value}>{l.languageName}</option>
                        ))}
                    </select>

                    <select
                        className="select select-info w-full select-sm max-w-xs"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        {Themes.map((t: themeStyle) => (
                            <option key={t.value} value={t.value}>{t.themeName}</option>
                        ))}
                    </select>

                    {result && (
                        <span className={`text-sm font-semibold ml-auto ${
                            result.toLowerCase().includes('fail') ? 'text-red-400' : 'text-green-400'
                        }`}>
                            {result}
                        </span>
                    )}
                </div>

                <div className="flex flex-col editor-console grow-[1]">
                    <div className="editorContainer grow-[1]">
                        <AceEditor
                            mode={language}
                            theme={theme}
                            value={code}
                            onChange={(e: string) => setCode(e)}
                            name="codeEditor"
                            className="editor"
                            style={{ width: '100%' }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                showLineNumbers: true,
                                fontSize: 16,
                            }}
                            height="100%"
                        />
                    </div>

                    <div className="collapse bg-base-200 rounded-none">
                        <input type="checkbox" className="peer" defaultChecked />
                        <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
                            Console
                        </div>
                        <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
                            <div role="tablist" className="tabs tabs-boxed w-3/5 mb-4">
                                <a onClick={() => setTestCaseTab('input')} role="tab" className={isInputTabActive('input')}>
                                    Input
                                </a>
                                <a onClick={() => setTestCaseTab('output')} role="tab" className={isInputTabActive('output')}>
                                    Output
                                </a>
                            </div>

                            {testCases.length > 1 && (
                                <div className="flex gap-2 mb-3">
                                    {testCases.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveCase(i)}
                                            className={`px-3 py-1 rounded-md text-sm ${
                                                activeCase === i ? 'bg-neutral text-white' : 'bg-base-300'
                                            }`}
                                        >
                                            Case {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {testCaseTab === 'input' ? (
                                <textarea
                                    rows={4}
                                    cols={70}
                                    readOnly
                                    value={testCases[activeCase]?.input ?? ''}
                                    className="bg-neutral text-white rounded-md resize-none p-2"
                                />
                            ) : (
                                <textarea
                                    rows={4}
                                    cols={70}
                                    readOnly
                                    value={testCases[activeCase]?.output ?? ''}
                                    className="bg-neutral text-white rounded-md resize-none p-2"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
    const colors = {
        easy: 'bg-green-500/20 text-green-400',
        medium: 'bg-yellow-500/20 text-yellow-400',
        hard: 'bg-red-500/20 text-red-400',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[difficulty as keyof typeof colors]}`}>
            {difficulty}
        </span>
    );
}

export default Description;