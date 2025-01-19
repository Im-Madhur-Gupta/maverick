"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { useEffect } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/modules/common/components/ui/tooltip";
import { useAppStore } from "@/modules/common/store/use-app-store";
import { Skeleton } from "@/modules/common/components/ui/skeleton";
import { lamportsToSol } from "@/modules/common/utils/asset.utils";

const SignalIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case "buy":
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    case "sell":
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    case "hold":
      return <Minus className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
};

export default function Signals() {
  const { processedSignals, isProcessedSignalsLoading, fetchProcessedSignals } =
    useAppStore();

  useEffect(() => {
    // Initial fetch
    fetchProcessedSignals();

    // Set up periodic fetching every 30 seconds
    const interval = setInterval(() => {
      fetchProcessedSignals();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchProcessedSignals]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trading Signals</h1>

      {isProcessedSignalsLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : processedSignals?.length === 0 ? (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-4xl">🎯</div>
            <p className="text-xl font-medium text-muted-foreground max-w-lg">
              Your Maverick is fetching signals for the coins in your portfolio.
              Once identified, they&apos;ll appear right here!
            </p>
            <p className="text-sm text-muted-foreground underline">
              Stay tuned! Soon, you&apos;ll receive signals for all coins,
              including those not in your portfolio.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Trading Signals for Your Holdings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Signal</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Strength</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedSignals.map((signal, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {signal.coin.tokenName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <SignalIcon type={signal.type} />
                        <span className="capitalize">
                          {signal.type.toLowerCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {lamportsToSol(signal.amount)} {signal.coin.tokenName}
                    </TableCell>
                    <TableCell>
                      {new Date(signal.sentAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-sm text-muted-foreground">
                            {signal.strength}%
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Signal strength based on market analysis</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
