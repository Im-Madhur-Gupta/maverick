import { PersonaId } from "../enums/persona-id.enum";

export interface Persona {
  id: PersonaId;
  name: string;
  description: string;
  icon: React.ElementType;
}
