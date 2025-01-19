import { SelectedPersonaId } from "@/modules/onboarding/types/selected-persona-id.interface";

export interface CreateAgentData {
  name: string;
  description: string;
  personaId: SelectedPersonaId;
}
