import type { Supplier } from "@/types";
import { TableCell } from "../ui/table";
import FormInput from "./form-input";

type SupplierHeaderProps = {
    supplier: Supplier;
    handleSupplierChange: (
        id: string,
        field: "supply" | "sellingPrice",
        value: number | ""
    ) => void;
    validateOn?: boolean;
};

export default function SuppliersHeader({
    supplier,
    handleSupplierChange,
    validateOn = false,
}: SupplierHeaderProps) {
    return (
        <>
            <TableCell className="font-bold">{supplier.id}</TableCell>
            <TableCell>
                <div className="grid grid-cols-2 items-center justify-items-center w-16 mx-4">
                    <span className="rotate-270 h-16">Podaż</span>
                    <FormInput
                        value={supplier.supply ?? ""}
                        onChange={(value) =>
                            handleSupplierChange(
                                supplier.id,
                                "supply",
                                value === "" ? "" : Number(value)
                            )
                        }
                        validateOn={validateOn}
                    />
                    <span className="rotate-270 h-16">Cena</span>
                    <FormInput
                        value={supplier.sellingPrice ?? ""}
                        onChange={(value) =>
                            handleSupplierChange(
                                supplier.id,
                                "sellingPrice",
                                value === "" ? "" : Number(value)
                            )
                        }
                        validateOn={validateOn}
                    />
                </div>
            </TableCell>
        </>
    );
}
