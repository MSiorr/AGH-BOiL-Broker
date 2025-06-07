import type {
    Customer,
    Supplier,
    UnitCostsMatrix,
    UnitCostsRow,
} from "@/types";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import SuppliersHeader from "./supplier-header";
import UnitCostRow from "./unit-costs-row";

type LogisticRowProps = {
    index: number;
    supplier: Supplier;
    customers: Customer[];
    suppliers: Supplier[];
    unitCosts: UnitCostsRow;
    handleSupplierChange: (
        id: string,
        field: keyof Supplier,
        value: number
    ) => void;
    handleAddCustomer: () => void;
    handleDeleteCustomer: () => void;
    setUnitCosts: React.Dispatch<React.SetStateAction<UnitCostsMatrix>>;
    validateOn?: boolean;
};

export default function LogisticRow({
    index,
    supplier,
    customers,
    suppliers,
    unitCosts,
    handleSupplierChange,
    handleAddCustomer,
    handleDeleteCustomer,
    setUnitCosts,
    validateOn = false,
}: LogisticRowProps) {
    return (
        <TableRow key={supplier.id}>
            <SuppliersHeader
                supplier={supplier}
                handleSupplierChange={handleSupplierChange}
                validateOn={validateOn}
            />

            <UnitCostRow
                supplier={supplier}
                customers={customers}
                unitCosts={unitCosts}
                setUnitCosts={setUnitCosts}
                validateOn={validateOn}
            />

            {index === 0 && (
                <TableCell
                    rowSpan={suppliers.length}
                    className="align-middle p-0"
                >
                    <div className="flex flex-col h-full items-center justify-center gap-y-4 ml-4">
                        <Button
                            type="button"
                            className="h-12 w-12 text-2xl"
                            onClick={handleAddCustomer}
                        >
                            +
                        </Button>
                        <Button
                            type="button"
                            className="h-12 w-12 text-2xl"
                            onClick={handleDeleteCustomer}
                            disabled={customers.length <= 1}
                        >
                            -
                        </Button>
                    </div>
                </TableCell>
            )}
        </TableRow>
    );
}
