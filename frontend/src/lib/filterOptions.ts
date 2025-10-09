import { Building, Building2, Home, Mountain } from "lucide-react";

// Property type icon mapping
export const typeIconMap = {
  villa: Home,
  house: Building,
  apartment: Building2,
  land: Mountain,
};

// Get property type with icon and localized label
export function getPropertyTypeWithIcon(
  ptRaw: { id: number; key: string; labels: Record<string, string> },
  locale: string
) {
  return {
    id: ptRaw.id,
    key: ptRaw.key,
    label:
      ptRaw.labels?.[locale] ||
      ptRaw.labels?.en ||
      ptRaw.labels?.id ||
      ptRaw.labels?.es ||
      ptRaw.key,
    icon: typeIconMap[ptRaw.key as keyof typeof typeIconMap] || Home,
  };
}

// Room options for bedrooms/bathrooms
export const roomOptions = [
  { label: "1+", value: "1" },
  { label: "2+", value: "2" },
  { label: "3+", value: "3" },
  { label: "4+", value: "4" },
];
