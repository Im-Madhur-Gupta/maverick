import { OnboardingStep } from "../types/onboarding-step.interface";
import { OnboardingStepValue } from "../enums/onboarding-step-value.enum";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    value: OnboardingStepValue.ConnectWallet,
    title: "Connect Wallet",
    description:
      "To get started, connect your Solana wallet securely. This allows Maverick to identify your account.",
  },
  {
    value: OnboardingStepValue.VerifyWallet,
    title: "Verify Ownership",
    description:
      "Sign a message with your wallet to confirm ownership of your address.",
  },
  {
    value: OnboardingStepValue.CreateAgent,
    title: "Create Your Maverick",
    description:
      "Bring your Maverick to life! Shape its trading style and and get ready to conquer the markets.",
  },
];
