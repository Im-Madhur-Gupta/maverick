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
import { useAppStore } from "@/modules/common/store/use-app-store";
import {
  Bar,
  BarChart,
  YAxis,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";
import { useEffect } from "react";
import { Skeleton } from "@/modules/common/components/ui/skeleton";

export default function Holdings() {
  const { holdings, isHoldingsLoading, fetchHoldings } = useAppStore();

  useEffect(() => {
    // Initial fetch
    fetchHoldings();

    // Set up periodic fetching every 30 seconds
    const interval = setInterval(() => {
      fetchHoldings();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchHoldings]);

  // Transform holdings data for chart when available
  const chartData =
    !isHoldingsLoading && holdings
      ? holdings.map((holding) => ({
          name: holding.coin.poolName,
          value: holding.profitPerUsd * 100, // Convert to percentage
        }))
      : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Holdings</h1>

      {isHoldingsLoading ? (
        <>
          <Card>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-[250px]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-4" />
            </CardContent>
          </Card>
        </>
      ) : holdings?.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-4xl">🔍</div>
            <p className="text-xl font-medium text-muted-foreground max-w-lg">
              Patience is key. Your Maverick is scanning the horizon for the
              best opportunities. Once it finds them, they&apos;ll show up here!
            </p>
            <p className="text-sm text-muted-foreground">
              This can take a while depending on the market conditions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Profit Distribution</CardTitle>
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
            <CardHeader>
              <CardTitle>Holdings</CardTitle>
            </CardHeader>
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
                  {holdings.map((holding, index) => {
                    const totalInvested =
                      holding.tokensBought * holding.buyingPriceUsd;
                    const currentValue =
                      holding.tokensBought * holding.currPriceUsd;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {holding.coin.poolName}
                        </TableCell>
                        <TableCell className="text-right">
                          {holding.tokensBought}
                        </TableCell>
                        <TableCell className="text-right">
                          ${holding.buyingPriceUsd}
                        </TableCell>
                        <TableCell className="text-right">
                          ${holding.currPriceUsd}
                        </TableCell>
                        <TableCell className="text-right">
                          ${totalInvested.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${currentValue.toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            holding.profitAbsUsd >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          ${holding.profitAbsUsd.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
