import PersonaCard from "@/modules/common/components/PersonaCard";
import { PERSONAS } from "@/modules/common/constants/personas.constant";
import { PersonaId } from "@/modules/common/enums/persona-id.enum";
import { SelectedPersonaId } from "../types/selected-persona-id.interface";

export interface SelectablePersonaCardsProps {
  selectedPersonaId: SelectedPersonaId;
  onSelectPersona: (personaId: PersonaId) => void;
}

const SelectablePersonaCards = ({
  selectedPersonaId,
  onSelectPersona,
}: SelectablePersonaCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {PERSONAS.map((persona) => {
        const isPersonaSelected = selectedPersonaId === persona.id;
        return (
          <PersonaCard
            key={persona.id}
            size="sm"
            persona={persona}
            isSelectable={true}
            isSelected={isPersonaSelected}
            onSelect={() => onSelectPersona(persona.id)}
          />
        );
      })}
    </div>
  );
};

export default SelectablePersonaCards;
