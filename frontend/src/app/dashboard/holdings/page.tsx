"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/common/components/ui/table";
import {
  Bar,
  BarChart,
  YAxis,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";

// Dummy data - Replace with API calls
const holdingsData = [
  {
    pool: "SOL/USDC",
    tokensHeld: 10,
    entryPrice: 100.25,
    currentPrice: 103.45,
    totalInvested: 1002.5,
    currentValue: 1034.5,
    profit: 32,
    percentage: 45,
  },
  {
    pool: "BONK/USDC",
    tokensHeld: 1000000,
    entryPrice: 0.00001,
    currentPrice: 0.000012,
    totalInvested: 10,
    currentValue: 12,
    profit: 2,
    percentage: 30,
  },
  {
    pool: "SAMO/USDC",
    tokensHeld: 1000,
    entryPrice: 0.015,
    currentPrice: 0.014,
    totalInvested: 15,
    currentValue: 14,
    profit: -1,
    percentage: 25,
  },
];

const chartData = holdingsData.map((holding) => ({
  name: holding.pool,
  value: holding.percentage,
}));

export default function Holdings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Holdings</h1>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: "#ffffff", opacity: 0.1 }} />
                <Bar dataKey="value" fill="#FF6F3C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Holdings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool</TableHead>
                <TableHead className="text-right">Tokens Held</TableHead>
                <TableHead className="text-right">Entry Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Total Invested</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdingsData.map((holding, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{holding.pool}</TableCell>
                  <TableCell className="text-right">
                    {holding.tokensHeld}
                  </TableCell>
                  <TableCell className="text-right">
                    ${holding.entryPrice}
                  </TableCell>
                  <TableCell className="text-right">
                    ${holding.currentPrice}
                  </TableCell>
                  <TableCell className="text-right">
                    ${holding.totalInvested}
                  </TableCell>
                  <TableCell className="text-right">
                    ${holding.currentValue}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      holding.profit >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ${holding.profit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
