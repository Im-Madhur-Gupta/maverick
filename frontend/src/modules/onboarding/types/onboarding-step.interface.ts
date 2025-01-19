import { OnboardingStepValue } from "../enums/onboarding-step-value.enum";

export interface OnboardingStep {
  value: OnboardingStepValue;
  title: string;
  description: string;
}
