import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";

// Feature type
export type Feature = {
  id: number;
  key: string;
  category_key: string;
  labels: Record<string, string>; // { en: "...", id: "...", es: "..." }
};

export type FeatureCategoryWithItems = {
  key: string;
  labels: Record<string, string>;
  items: Feature[];
};

interface ListingFeaturesProps {
  features: FeatureCategoryWithItems[];
  selected: number[];
  onChange: (selected: number[]) => void;
  locale: string;
  disabled?: boolean;
}

export default function ListingFeatures({
  features,
  selected,
  onChange,
  locale,
  disabled = false,
}: ListingFeaturesProps) {
  function handleToggle(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter((fId) => fId !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-6">
      {features?.map((cat) => (
        <div key={cat.key}>
          <h3 className="font-semibold text-slate-700 mb-2">
            {cat.labels[locale] || cat.labels["en"]}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {cat.items.map((feature) => (
              <FormField
                key={feature.id}
                name="features"
                render={() => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={selected.includes(feature.id)}
                        onCheckedChange={() => handleToggle(feature.id)}
                        id={`feature-${feature.id}`}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor={`feature-${feature.id}`}
                      className="cursor-pointer"
                    >
                      {feature.labels[locale] || feature.labels["en"]}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
