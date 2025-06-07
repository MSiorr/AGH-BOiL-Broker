import type {
    Customer,
    Supplier,
    UnitCostsMatrix,
    UnitCostsRow,
} from "@/types";
import { TableCell } from "../ui/table";
import FormInput from "./form-input";

type UnitCostRowProps = {
    customers: Customer[];
    supplier: Supplier;
    unitCosts: UnitCostsRow;
    setUnitCosts: React.Dispatch<React.SetStateAction<UnitCostsMatrix>>;
    validateOn?: boolean;
};

export default function UnitCostRow({
    customers,
    supplier,
    unitCosts,
    setUnitCosts,
    validateOn = false,
}: UnitCostRowProps) {
    return (
        <>
            {customers.map((customer) => (
                <TableCell key={customer.id}>
                    <FormInput
                        value={unitCosts[customer.id] ?? ""}
                        onChange={(value) => {
                            setUnitCosts((prev) => {
                                const result: UnitCostsMatrix = {
                                    ...prev,
                                    [supplier.id]: {
                                        ...prev[supplier.id],
                                        [customer.id]:
                                            value === "" ? -1 : Number(value),
                                    },
                                };
                                return result;
                            });
                        }}
                        validateOn={validateOn}
                        size="large"
                    />
                </TableCell>
            ))}
        </>
    );
}
