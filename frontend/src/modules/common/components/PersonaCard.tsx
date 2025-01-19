import { motion } from "framer-motion";

import { cn } from "../utils/common.utils";
import type { Persona } from "../types/persona.interface";

export interface PersonaCardProps {
  persona: Persona;
  size?: "sm" | "md";
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const PersonaCard = ({
  persona,
  size = "md",
  isSelectable = false,
  isSelected,
  onSelect,
}: PersonaCardProps) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const getTextColorClasses = () => {
    if (!isSelectable) {
      return {
        icon: "text-primary",
        heading: "text-primary",
        subheading: "text-muted",
      };
    }

    if (isSelected) {
      return {
        icon: "text-primary",
        heading: "text-primary",
        subheading: "text-primary",
      };
    }

    return {
      icon: "text-muted",
      heading: "text-muted",
      subheading: "text-muted",
    };
  };
  const textColorClasses = getTextColorClasses();

  const getSizeClasses = () => {
    if (size === "sm") {
      return {
        icon: "w-8 h-8 mb-2.5",
        heading: "text-lg mb-1",
        subheading: "text-sm",
      };
    }

    return {
      icon: "w-12 h-12 mb-4",
      heading: "text-2xl mb-2",
      subheading: "text-base",
    };
  };
  const sizeClasses = getSizeClasses();

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ y: -15 }}
      className={cn(
        "bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200",
        isSelectable ? "cursor-pointer" : "cursor-text"
      )}
      onClick={handleSelect}
    >
      <persona.icon
        size={48}
        className={cn("mx-auto", textColorClasses.icon, sizeClasses.icon)}
      />
      <h3
        className={cn(
          "text-center",
          textColorClasses.heading,
          sizeClasses.heading
        )}
      >
        {persona.name}
      </h3>
      <p
        className={cn(
          "text-center",
          textColorClasses.subheading,
          sizeClasses.subheading
        )}
      >
        {persona.description}
      </p>
    </motion.div>
  );
};

export default PersonaCard;
