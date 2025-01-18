"use client";

import { Copy, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/modules/common/components/ui/tooltip";
import { Switch } from "@/modules/common/components/ui/switch";
import { Button } from "@/modules/common/components/ui/button";
import { useToast } from "@/modules/common/hooks/use-toast";

// Dummy data - Replace with API calls
const agentInfo = {
  name: "Madhur",
  status: "Active",
  solAddress: "7xKX...9Yka",
  baseAddress: "0x71...F8e2",
  startDate: "2024-01-01",
};

const portfolioMetrics = {
  totalValue: 1039.56,
  initialInvestment: 1000,
  totalReturn: 3.96,
};

export default function Dashboard() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Address has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Hero Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agent Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Name: {agentInfo.name}
              </p>
              <p className="text-sm text-green-500">
                Status: {agentInfo.status}
              </p>
              <p className="text-sm text-muted-foreground">
                Created At: {new Date(agentInfo.startDate).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Trading Mode
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent className="w-56" sideOffset={10}>
                    <p>
                      Simulation mode is enabled as the project is in beta. All
                      trades are simulated for testing purposes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch checked disabled />
              <span className="text-sm text-muted-foreground">Simulation</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-sm text-muted-foreground">
                      SOL: {agentInfo.solAddress}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Minimum deposit: 0.1 SOL</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(agentInfo.solAddress)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-sm text-muted-foreground">
                      Base: {agentInfo.baseAddress}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Minimum deposit: 0.01 ETH</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(agentInfo.baseAddress)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${portfolioMetrics.totalValue}
            </div>
            <p className="text-xs text-muted-foreground">≈ 10.2 SOL</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Initial Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${portfolioMetrics.initialInvestment}
            </div>
            <p className="text-xs text-muted-foreground">≈ 9.8 SOL</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              +{portfolioMetrics.totalReturn}%
            </div>
            <p className="text-xs text-muted-foreground">+$39.56</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
