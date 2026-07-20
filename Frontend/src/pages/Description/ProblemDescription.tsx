import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ProblemData } from '../../types/problem.types';
import Description from './Description';
import socket from '../../socket';

function ProblemDescription() {
    const { problemId } = useParams<{ problemId: string }>();
    const [problem, setProblem] = useState<ProblemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchProblem() {
            try {
                const res = await axios.get(
                    `http://localhost:4000/api/v1/problems/${problemId}`,
                );
                setProblem(res.data.data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        if (problemId) fetchProblem();
    }, [problemId]);

    useEffect(() => {
        socket.emit("send-userId","6a5b4eb9c76790a5681284e9")
        socket.on('evaluation-response', (data) => {
            console.log(data);
            
        });

        return () => {
            socket.off('evaluation-response');
        };
    }, [problemId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
                <p className="text-slate-400">Couldn't load this problem.</p>
            </div>
        );
    }

    return <Description problem={problem} />;
}

export default ProblemDescription;









