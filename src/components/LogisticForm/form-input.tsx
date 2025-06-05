import type { Customer, Supplier } from "@/types";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export default function FormInput({
    value,
    onChange,
    size = "small",
    validateOn = false,
}: {
    value: string | number | keyof Supplier | keyof Customer;
    onChange: (value: string | number) => void;
    size?: "small" | "large";
    validateOn?: boolean;
}) {
    return (
        <Input
            type="number"
            value={value}
            inputMode="numeric"
            onChange={(e) =>
                onChange(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                )
            }
            className={cn(
                "aspect-square p-0 no-arrows text-center",
                size === "large" ? "w-32 h-32" : "w-16 h-16",
                ((validateOn && value == "") || value == undefined) &&
                    "border-2 border-red-500/50 focus:border-red-500 focus:ring-red-500 focus:ring-2 focus:ring-offset-0"
            )}
        />
    );
}
