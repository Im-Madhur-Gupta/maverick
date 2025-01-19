"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
} from "@reown/appkit/react";
import type { Provider } from "@reown/appkit-adapter-solana";
import bs58 from "bs58";

import { Tabs, TabsList } from "@/modules/common/components/ui/tabs";
import { useToast } from "@/modules/common/hooks/use-toast";
import OnboardingTabTrigger from "@/modules/onboarding/components/OnboardingTabTrigger";
import OnboardingTabContent from "@/modules/onboarding/components/OnboardingTabContent";
import ConnectWalletStepContent from "@/modules/onboarding/components/ConnectWalletStepContent";
import VerifyWalletStepContent from "@/modules/onboarding/components/VerifyWalletStepContent";
import CreateAgentStepContent from "@/modules/onboarding/components/CreateAgentStepContent";
import { CreateAgentData } from "@/modules/common/types/create-agent-data.interface";
import { OnboardingStepValue } from "@/modules/onboarding/enums/onboarding-step-value.enum";
import { ONBOARDING_STEPS } from "@/modules/onboarding/constants/onboarding-steps.constant";
import { useAppStore } from "@/modules/common/store/use-app-store";

export default function Onboarding() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const router = useRouter();
  const { toast } = useToast();

  const { generateSignatureMessage, login, createAgent } = useAppStore();

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
      await open({
        view: "Connect",
      });
      // Successful connection handled in useEffect below
    } catch {
      toast({
        title: "Error",
        description: "Unable to connect to a wallet. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      toast({
        title: "Success",
        description: "Wallet connected successfully!",
      });
      setCompletedSteps((currentCompletedSteps) => [
        ...currentCompletedSteps,
        OnboardingStepValue.ConnectWallet,
      ]);
      setActiveStep(OnboardingStepValue.VerifyWallet);
      setIsLoading(false);
    }
  }, [isConnected, toast]);

  /**
   * Signs a message using the wallet provider and returns the signature in base58 format.
   *
   * @param message - The message to sign
   * @returns A base58-encoded signature string
   * @throws Error if the wallet is not connected
   */
  const signMessage = async (message: string): Promise<string> => {
    if (!walletProvider || !isConnected) {
      throw Error("User is not connected");
    }

    const encodedMessage = new TextEncoder().encode(message);
    const signatureBytes = await walletProvider.signMessage(encodedMessage);

    const signatureBase58 = bs58.encode(signatureBytes);

    return signatureBase58;
  };

  const handleVerifyOwnership = async () => {
    setIsLoading(true);
    try {
      if (!address) {
        throw Error("User is not connected");
      }

      // TODO: Add a check to see if the user has already verified their wallet

      const signatureMessage = await generateSignatureMessage(address);

      const signature = await signMessage(signatureMessage);

      await login(address, signatureMessage, signature);

      toast({
        title: "Success",
        description: "Wallet ownership verified!",
      });
      setCompletedSteps([...completedSteps, OnboardingStepValue.VerifyWallet]);
      setActiveStep(OnboardingStepValue.CreateAgent);
    } catch {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    if (!createAgentData.name) {
      return toast({
        title: "Error",
        description: "Please fill in the name of your Maverick",
        variant: "destructive",
      });
    }

    if (createAgentData.personaId === null) {
      return toast({
        title: "Error",
        description: "Please select a persona for your Maverick",
        variant: "destructive",
      });
    }

    setIsLoading(true);
    try {
      // Improve the below API call params
      await createAgent({
        name: createAgentData.name,
        description: createAgentData.description,
        persona: createAgentData.personaId,
      });

      toast({
        title: "Success",
        description: "Your Maverick is ready!",
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
