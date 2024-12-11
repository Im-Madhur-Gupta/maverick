'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AgentService } from '@/services/agent';
import { Trade, Portfolio, AgentStats } from '@/types/agent';

export default function Dashboard() {
    const { agentId } = useParams();
    const [trades, setTrades] = useState<Trade[]>([]);
    const [portfolio, setPortfolio] = useState<Portfolio>();
    const [stats, setStats] = useState<AgentStats>();
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tradesData, portfolioData, statsData, statusData] = await Promise.all([
                    AgentService.getTrades(agentId as string),
                    AgentService.getPortfolio(agentId as string),
                    AgentService.getStats(agentId as string),
                    AgentService.getAgentStatus(agentId as string)
                ]);

                setTrades(tradesData);
                setPortfolio(portfolioData);
                setStats(statsData);
                setIsActive(statusData.isActive);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Refresh trades every 3 seconds
        const tradeInterval = setInterval(async () => {
            try {
                const newTrades = await AgentService.getTrades(agentId as string);
                setTrades(newTrades);
            } catch (error) {
                console.error('Error fetching trades:', error);
            }
        }, 3000);

        // Refresh portfolio every 10 seconds
        const portfolioInterval = setInterval(async () => {
            try {
                const newPortfolio = await AgentService.getPortfolio(agentId as string);
                setPortfolio(newPortfolio);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
            }
        }, 10000);

        return () => {
            clearInterval(tradeInterval);
            clearInterval(portfolioInterval);
        };
    }, [agentId]);

    const toggleAgent = async () => {
        try {
            if (isActive) {
                await AgentService.stopAgent(agentId as string);
            } else {
                await AgentService.startAgent(agentId as string);
            }
            setIsActive(!isActive);
        } catch (error) {
            console.error('Error toggling agent:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Maverick Dashboard</h1>
                    <button
                        onClick={toggleAgent}
                        className={`px-6 py-3 rounded-lg font-bold ${
                            isActive 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isActive ? 'Stop Agent' : 'Start Agent'}
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 mb-2">Total Value</h3>
                        <p className="text-2xl font-bold">${portfolio?.totalValue || '0.00'}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 mb-2">Win Rate</h3>
                        <p className="text-2xl font-bold">{stats?.winRate || 0}%</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 mb-2">Total Trades</h3>
                        <p className="text-2xl font-bold">{stats?.totalTrades || 0}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 mb-2">Total PnL</h3>
                        <p className={`text-2xl font-bold ${stats?.totalPnL && stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stats?.totalPnL ? `${stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL}%` : '0%'}
                        </p>
                    </div>
                </div>

                {/* Portfolio */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-400">
                                    <th className="pb-4">Token</th>
                                    <th className="pb-4">Balance</th>
                                    <th className="pb-4">Value</th>
                                    <th className="pb-4">PnL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio?.tokens.map((token) => (
                                    <tr key={token.address} className="border-t border-gray-700">
                                        <td className="py-4">{token.symbol}</td>
                                        <td className="py-4">{token.balance}</td>
                                        <td className="py-4">${token.value}</td>
                                        <td className={`py-4 ${token.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {token.pnl >= 0 ? '+' : ''}{token.pnl}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Trades */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Recent Trades</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-400">
                                    <th className="pb-4">Type</th>
                                    <th className="pb-4">Token</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4">Price</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.map((trade) => (
                                    <tr key={trade.id} className="border-t border-gray-700">
                                        <td className={`py-4 ${trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                            {trade.type}
                                        </td>
                                        <td className="py-4">{trade.tokenSymbol}</td>
                                        <td className="py-4">{trade.amount}</td>
                                        <td className="py-4">${trade.price}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-sm ${
                                                trade.status === 'COMPLETED' ? 'bg-green-900/50 text-green-400' :
                                                trade.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400' :
                                                'bg-red-900/50 text-red-400'
                                            }`}>
                                                {trade.status}
                                            </span>
                                        </td>
                                        <td className="py-4">{new Date(trade.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
} 