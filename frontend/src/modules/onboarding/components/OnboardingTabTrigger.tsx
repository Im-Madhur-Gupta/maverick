import { cn } from "@/modules/common/utils/common.utils";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { Check } from "lucide-react";

interface OnboardingTabTriggerProps {
  value: string;
  isActive: boolean;
  isDisabled: boolean;
  isCompleted: boolean;
  title: string;
}

const OnboardingTabTrigger = ({
  value,
  title,
  isActive,
  isDisabled,
  isCompleted,
}: OnboardingTabTriggerProps) => {
  return (
    <TabsTrigger
      value={value}
      disabled={isDisabled}
      className={cn(
        "flex items-center justify-center gap-2 rounded-md text-sm h-full w-1/3",
        isActive && "bg-background text-white",
        isCompleted && "text-primary"
      )}
    >
      {isCompleted ? <Check className="w-4 h-4" /> : ""}
      <span>{title}</span>
    </TabsTrigger>
  );
};

export default OnboardingTabTrigger;
