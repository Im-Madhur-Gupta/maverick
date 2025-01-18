"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Tabs, TabsList } from "@/modules/common/components/ui/tabs";
import { useToast } from "@/modules/common/hooks/use-toast";
import OnboardingTabTrigger from "@/modules/onboarding/components/OnboardingTabTrigger";
import OnboardingTabContent from "@/modules/onboarding/components/OnboardingTabContent";
import ConnectWalletStepContent from "@/modules/onboarding/components/ConnectWalletStepContent";
import VerifyWalletStepContent from "@/modules/onboarding/components/VerifyWalletStepContent";
import CreateAgentStepContent from "@/modules/onboarding/components/CreateAgentStepContent";
import { CreateAgentData } from "@/modules/onboarding/types/create-agent-data.interface";
import { OnboardingStepValue } from "@/modules/onboarding/enums/onboarding-step-value.enum";
import { ONBOARDING_STEPS } from "@/modules/onboarding/constants/onboarding-steps.constant";

export default function Onboarding() {
  const router = useRouter();
  const { toast } = useToast();

  // TODO: Maybe rename to activeStepValue and completedStepsValues

  const [activeStep, setActiveStep] = useState(
    OnboardingStepValue.ConnectWallet
  );
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<OnboardingStepValue[]>(
    []
  );
  const [createAgentData, setCreateAgentData] = useState<CreateAgentData>({
    name: "",
    description: "",
    personaId: null,
  });

  const handleWalletConnect = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement wallet connection logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
      toast({
        title: "Success",
        description: "Wallet connected successfully!",
      });
      setCompletedSteps([...completedSteps, OnboardingStepValue.ConnectWallet]);
      setActiveStep(OnboardingStepValue.VerifyWallet);
    } catch {
      toast({
        title: "Error",
        description: "Unable to connect to a wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOwnership = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement nonce fetching and signature verification
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
      toast({
        title: "Success",
        description: "Wallet ownership verified!",
      });
      setCompletedSteps([...completedSteps, OnboardingStepValue.VerifyWallet]);
      setActiveStep(OnboardingStepValue.CreateAgent);
    } catch {
      toast({
        title: "Error",
        description: "Signature rejected. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    if (!createAgentData.name || !createAgentData.personaId) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement agent creation logic

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
      toast({
        title: "Success",
        description: "Your Maverick Agent is ready!",
      });
      setCompletedSteps([...completedSteps, OnboardingStepValue.CreateAgent]);

      router.push("/dashboard");
    } catch {
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    return ONBOARDING_STEPS.map((step) => {
      const commonProps = {
        value: step.value,
        title: step.title,
        description: step.description,
      };

      switch (step.value) {
        case OnboardingStepValue.ConnectWallet:
          return (
            <OnboardingTabContent key={step.value} {...commonProps}>
              <ConnectWalletStepContent
                isLoading={isLoading}
                onConnect={handleWalletConnect}
              />
            </OnboardingTabContent>
          );
        case OnboardingStepValue.VerifyWallet:
          return (
            <OnboardingTabContent key={step.value} {...commonProps}>
              <VerifyWalletStepContent
                isLoading={isLoading}
                onVerify={handleVerifyOwnership}
              />
            </OnboardingTabContent>
          );
        case OnboardingStepValue.CreateAgent:
          return (
            <OnboardingTabContent key={step.value} {...commonProps}>
              <CreateAgentStepContent
                isLoading={isLoading}
                agentData={createAgentData}
                onAgentDataChange={(updatedAgentData) =>
                  setCreateAgentData((currentAgentData) => ({
                    ...currentAgentData,
                    ...updatedAgentData,
                  }))
                }
                onCreateAgent={handleCreateAgent}
              />
            </OnboardingTabContent>
          );
      }
    });
  };

  return (
    <main className="min-h-screen my-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-12 text-center text-primary"
      >
        Your Maverick Awaits! Let&apos;s Set It Up
      </motion.h1>

      <div
        className={`${
          activeStep === OnboardingStepValue.CreateAgent
            ? "max-w-3xl"
            : "max-w-xl"
        } mx-auto transition-all duration-300`}
      >
        <Tabs
          value={activeStep}
          onValueChange={(value) => setActiveStep(value as OnboardingStepValue)}
        >
          <TabsList className="w-full justify-between mb-8">
            {ONBOARDING_STEPS.map((step) => (
              <OnboardingTabTrigger
                key={step.value}
                value={step.value}
                title={step.title}
                isActive={activeStep === step.value}
                isDisabled={
                  !completedSteps.includes(step.value) &&
                  activeStep !== step.value
                }
                isCompleted={completedSteps.includes(step.value)}
              />
            ))}
          </TabsList>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {renderStepContent()}
          </div>
        </Tabs>
      </div>
    </main>
  );
}
