import { Rocket, Crown, FishIcon } from "lucide-react";

import { PersonaId } from "../enums/persona-id.enum";
import { Persona } from "../types/persona.interface";

export const PERSONAS: Persona[] = [
  {
    id: PersonaId.MOON_CHASER,
    name: "Moon Chaser",
    icon: Rocket,
    description: "Aim for the stars with high-risk, high-reward strategies",
  },
  {
    id: PersonaId.MEME_LORD,
    name: "Meme Lord",
    icon: Crown,
    description: "Rule the meme world with trend-setting trades",
  },
  {
    id: PersonaId.WHALE_WATCHER,
    name: "Whale Watcher",
    icon: FishIcon,
    description: "Follow the big players and ride the waves",
  },
];
