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
import { Skeleton } from "@/modules/common/components/ui/skeleton";
import { useToast } from "@/modules/common/hooks/use-toast";
import { useAppStore } from "@/modules/common/store/use-app-store";
import { cn } from "@/modules/common/utils/common.utils";

export default function Dashboard() {
  const { toast } = useToast();
  const { agent, isAgentLoading, portfolio, isPortfolioLoading } =
    useAppStore();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Address has been copied to your clipboard.",
    });
  };

  // Computed portfolio metrics

  let portfolioGainsValue = "",
    portfolioGainsPercentage = "",
    isPortfolioProfitable = true;
  if (!isPortfolioLoading) {
    isPortfolioProfitable = portfolio!.currRealisedUsd >= portfolio!.startUsd;
    portfolioGainsValue = (
      portfolio!.currRealisedUsd - portfolio!.startUsd
    ).toFixed(2);
    portfolioGainsPercentage = (
      ((portfolio!.currRealisedUsd - portfolio!.startUsd) * 100) /
      portfolio!.startUsd
    ).toFixed(2);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agent Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isAgentLoading ? (
                <>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Name: {agent!.name}
                  </p>
                  <p className="text-sm text-green-500">
                    Status: {agent!.isActive ? "Active" : "Inactive"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created At: {new Date(agent!.createdAt).toLocaleString()}
                  </p>
                </>
              )}
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
                {isAgentLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <>
                    <p>
                      SOL: {agent!.solanaAddress.slice(0, 8)}...
                      {agent!.solanaAddress.slice(-8)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(agent!.solanaAddress)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* <div className="flex items-center justify-between">
                {isAgentLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <>
                    <p>Base: {"-"}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard("")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div> */}
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
              {isPortfolioLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                `$${portfolio!.currRealisedUsd}`
              )}
            </div>
            {/* TODO: Make the value dynamic */}
            {/* <p className="text-xs text-muted-foreground">≈ 10.2 SOL</p> */}
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
              {isPortfolioLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                `$${portfolio!.startUsd}`
              )}
            </div>
            {/* TODO: Make the value dynamic */}
            {/* <p className="text-xs text-muted-foreground">≈ 9.8 SOL</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
          </CardHeader>
          <CardContent>
            {isPortfolioLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <>
                <div
                  className={cn(
                    "text-2xl font-bold",
                    isPortfolioProfitable ? "text-green-500" : "text-red-500"
                  )}
                >
                  {portfolioGainsPercentage}%
                </div>
                <p className="text-xs text-muted-foreground">
                  ${portfolioGainsValue}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
