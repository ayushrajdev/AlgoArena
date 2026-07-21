import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    ProblemData,
    SubmissionResult,
    EvaluationResponse,
} from '../../types/problem.types';
import Description from './Description';
import socket from '../../socket';

function ProblemDescription() {
    const { problemId } = useParams<{ problemId: string }>();
    const [problem, setProblem] = useState<ProblemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const [submission, setSubmission] = useState<SubmissionResult>({ status: 'idle' });
    const pendingSubmissionId = useRef<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchProblem() {
            setLoading(true);
            setError(false);
            try {
                const res = await axios.get(
                    `http://localhost:4000/api/v1/problems/${problemId}`,
                );
                if (!cancelled) setProblem(res.data.data);
            } catch {
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        if (problemId) fetchProblem();

        return () => {
            cancelled = true;
        };
    }, [problemId, reloadKey]);

    useEffect(() => {
        socket.emit('send-userId', '6a5f39c7eeb4e17e942c043a');

        socket.on('evaluation-response', (evt: EvaluationResponse) => {
            // Ignore stray/late events that don't belong to the submission we're tracking
            if (pendingSubmissionId.current && evt?.submissionId !== pendingSubmissionId.current) {
                return;
            }

            // Be defensive about the "error" flag shape — accept boolean true
            // or a stringified "true" rather than assuming strict boolean.
            const isError = evt?.error === true || String(evt?.error).toLowerCase() === 'true';

            setSubmission({
                status: 'completed',
                submissionId: evt?.submissionId,
                isError,
                errorMessage: isError
                    ? (typeof evt?.data === 'string' && evt.data.trim()
                        ? evt.data
                        : 'Your code failed to run, but no error details were returned.')
                    : undefined,
                resultData: !isError && evt?.data && typeof evt.data === 'object'
                    ? (evt.data as Record<string, unknown>)
                    : undefined,
            });
            pendingSubmissionId.current = null;
        });

        return () => {
            socket.off('evaluation-response');
        };
    }, [problemId]);

    const submitCode = useCallback(
        async (code: string, language: string) => {
            if (!problem) return;
            setSubmission({ status: 'pending' });
            try {
                const response = await axios.post(
                    'http://localhost:3000/api/v1/submissions',
                    {
                        code,
                        language,
                        userId: '6a5f39c7eeb4e17e942c043a',
                        problemId: problem._id,
                    },
                );
                const submissionId = response.data?.data?._id ?? response.data?.data?.submissionId;
                pendingSubmissionId.current = submissionId ?? null;
                // The actual verdict/error arrives later via the 'evaluation-response' socket event.
            } catch (err) {
                let networkError = 'Something went wrong submitting your code. Please try again.';
                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        networkError =
                            err.response.data?.message ?? `Server error (${err.response.status}). Please try again.`;
                    } else if (err.request) {
                        networkError = 'Could not reach the server. Check your connection and try again.';
                    }
                }
                setSubmission({ status: 'completed', isError: true, networkError });
                pendingSubmissionId.current = null;
            }
        },
        [problem],
    );

    if (loading) {
        return <ProblemDescriptionSkeleton />;
    }

    if (error || !problem) {
        return (
            <div className="min-h-[calc(100vh-57px)] bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4">
                <p className="text-slate-400">Couldn't load this problem.</p>
                <button
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 transition-colors"
                    onClick={() => setReloadKey((k) => k + 1)}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <Description
            problem={problem}
            onSubmit={submitCode}
            submission={submission}
        />
    );
}

function ProblemDescriptionSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-57px)] bg-[#0f172a] animate-pulse">
            <div className="w-full lg:w-1/2 h-full p-5 space-y-4 border-r border-slate-800">
                <div className="h-7 w-2/3 bg-slate-800 rounded" />
                <div className="h-5 w-24 bg-slate-800 rounded-full" />
                <div className="space-y-2 mt-6">
                    <div className="h-3 w-full bg-slate-800 rounded" />
                    <div className="h-3 w-11/12 bg-slate-800 rounded" />
                    <div className="h-3 w-4/5 bg-slate-800 rounded" />
                </div>
                <div className="h-24 w-full bg-slate-800 rounded-lg mt-6" />
                <div className="h-24 w-full bg-slate-800 rounded-lg" />
            </div>
            <div className="hidden lg:block w-1/2 h-full bg-slate-900" />
        </div>
    );
}

export default ProblemDescription;