"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
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

// Dummy data - Replace with API calls
const signalsData = [
  {
    asset: "SOL",
    signal: "buy",
    amountTraded: "15.23 SOL",
    timestamp: "2 hours ago",
    trigger: "Positive social sentiment",
  },
  {
    asset: "BONK",
    signal: "hold",
    amountTraded: "1M BONK",
    timestamp: "5 hours ago",
    trigger: "Market consolidation",
  },
  {
    asset: "SAMO",
    signal: "sell",
    amountTraded: "500 SAMO",
    timestamp: "1 day ago",
    trigger: "Sudden market sell pressure",
  },
];

const SignalIcon = ({ signal }: { signal: string }) => {
  switch (signal) {
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
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Trading Signals</h1>

      <Card>
        <CardHeader>
          <CardTitle>Trading Signals for Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Signal</TableHead>
                <TableHead>Amount Traded</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Trigger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signalsData.map((signal, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{signal.asset}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SignalIcon signal={signal.signal} />
                      <span className="capitalize">{signal.signal}</span>
                    </div>
                  </TableCell>
                  <TableCell>{signal.amountTraded}</TableCell>
                  <TableCell>{signal.timestamp}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-sm text-muted-foreground">
                          {signal.trigger}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click for detailed analysis</p>
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
    </div>
  );
}
