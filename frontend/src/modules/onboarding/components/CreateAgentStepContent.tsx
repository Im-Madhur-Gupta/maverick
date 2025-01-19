import { Loader2, Info } from "lucide-react";
import { Button } from "@/modules/common/components/ui/button";
import { Input } from "@/modules/common/components/ui/input";
import { Textarea } from "@/modules/common/components/ui/textarea";
import { CreateAgentData } from "../../common/types/create-agent-data.interface";
import SelectablePersonaCards from "./SelectablePersonaCards";
import { PersonaId } from "@/modules/common/enums/persona-id.enum";
import { Label } from "@/modules/common/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/modules/common/components/ui/tooltip";

export interface CreateAgentContentProps {
  isLoading: boolean;
  agentData: CreateAgentData;
  onAgentDataChange: (updatedAgentData: Partial<CreateAgentData>) => void;
  onCreateAgent: () => void;
}

const CreateAgentStepContent = ({
  isLoading,
  agentData,
  onAgentDataChange,
  onCreateAgent,
}: CreateAgentContentProps) => {
  const handleNameChange = (name: string) => {
    onAgentDataChange({ name });
  };

  const handleDescriptionChange = (description: string) => {
    onAgentDataChange({ description });
  };

  const handleSelectPersona = (personaId: PersonaId) => {
    onAgentDataChange({ personaId });
  };

  return (
    <div className="flex flex-col items-center gap-y-6 w-full">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name" className="text-sm text-primary">
          Name *
        </Label>
        <Input
          id="name"
          type="text"
          required
          placeholder="Enter your agent's name (e.g., Moon Rider)"
          value={agentData.name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        {/* TODO: Add random name generator*/}
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description" className="text-sm text-primary">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Add a brief description to identify your agent."
          value={agentData.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
        />
      </div>

      <div className="grid w-full items-center gap-5">
        <Label className="text-sm text-primary flex items-center gap-2">
          <span>Persona *</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="w-fit">
                <Info className="w-3 h-3" />
              </TooltipTrigger>
              <TooltipContent className="w-48" sideOffset={10}>
                <p>
                  Choose a persona to shape your Maverick&apos;s trading
                  strategy and style.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <SelectablePersonaCards
          selectedPersonaId={agentData.personaId}
          onSelectPersona={handleSelectPersona}
        />
      </div>

      <Button onClick={onCreateAgent} disabled={isLoading} size="sm" className="mt-5">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Unleash Your Maverick
      </Button>
    </div>
  );
};

export default CreateAgentStepContent;
