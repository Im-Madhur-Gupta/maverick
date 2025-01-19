import { TabsContent } from "@radix-ui/react-tabs";

interface OnboardingTabContentProps {
  value: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const OnboardingTabContent = ({
  value,
  title,
  description,
  children,
}: OnboardingTabContentProps) => {
  return (
    <TabsContent value={value} className="flex flex-col items-center gap-y-4">
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      <p className="text-muted-foreground text-center mb-4">{description}</p>
      {children}
    </TabsContent>
  );
};

export default OnboardingTabContent;
