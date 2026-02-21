import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { BarChart, Activity, ShieldAlert, Clock } from 'lucide-react';

interface AnalyticsSummary {
    total_requests: number;
    endpoints: Record<string, number>;
    status_codes: Record<string, number>;
    error_rates: number;
    avg_response_time: number;
}

export const AdminAnalytics: React.FC = () => {
    const [data, setData] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch from our new FastAPI backend
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/analytics/summary');
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;

    return (
        <Layout>
            <div className="container mx-auto p-6 space-y-8">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">API Usage Analytics</h1>
                        <p className="text-gray-400">Monitor system performance and rate limits</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <Activity className="text-blue-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-400">Total Requests</p>
                                <p className="text-2xl font-bold text-white">{data?.total_requests || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <ShieldAlert className="text-yellow-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-400">Rate Limits (429)</p>
                                <p className="text-2xl font-bold text-white">{data?.status_codes['429'] || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <Clock className="text-green-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-400">Avg Response</p>
                                <p className="text-2xl font-bold text-white">{data?.avg_response_time || 0} ms</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <BarChart className="text-purple-500 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-400">Active Endpoints</p>
                                <p className="text-2xl font-bold text-white">{Object.keys(data?.endpoints || {}).length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Top Endpoints</h3>
                        <div className="space-y-4">
                            {Object.entries(data?.endpoints || {}).sort((a, b) => b[1] - a[1]).map(([path, count]) => (
                                <div key={path} className="flex justify-between items-center text-gray-300">
                                    <code className="text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded">{path}</code>
                                    <span className="font-mono">{count} calls</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">HTTP Status Distribution</h3>
                        <div className="space-y-4">
                            {Object.entries(data?.status_codes || {}).map(([code, count]) => {
                                const percentage = ((count / (data?.total_requests || 1)) * 100).toFixed(1);
                                return (
                                    <div key={code} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">{code}</span>
                                            <span className="text-white">{count} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${code.startsWith('2') ? 'bg-green-500' : code === '429' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
