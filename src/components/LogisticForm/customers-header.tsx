import type { Customer } from "@/types";
import { TableCell, TableRow } from "../ui/table";
import FormInput from "./form-input";

type CustomerHeaderProps = {
    customers: Customer[];
    handleCustomerChange: (
        id: string,
        field: "demand" | "buyingPrice",
        value: number
    ) => void;
    validateOn?: boolean;
};

export default function CustomersHeader({
    customers,
    handleCustomerChange,
    validateOn = false,
}: CustomerHeaderProps) {
    return (
        <>
            <TableRow>
                <TableCell colSpan={2} />
                {customers.map((customer) => (
                    <TableCell key={customer.id} className="text-center">
                        {customer.id}
                    </TableCell>
                ))}
            </TableRow>
            <TableRow>
                <TableCell colSpan={2} />
                {customers.map((customer) => (
                    <TableCell key={customer.id}>
                        <div className="flex justify-center w-fit mx-auto">
                            <div className="text-center flex flex-col w-fit items-center gap-y-2 mx-auto">
                                <span>Popyt</span>
                                <FormInput
                                    value={customer.buyingPrice}
                                    onChange={(value) =>
                                        handleCustomerChange(
                                            customer.id,
                                            "buyingPrice",
                                            value
                                        )
                                    }
                                    validateOn={validateOn}
                                />
                            </div>
                            <div className="text-center flex flex-col items-center w-fit gap-y-2 mx-auto">
                                <span>Cena</span>
                                <FormInput
                                    value={customer.demand}
                                    onChange={(value) =>
                                        handleCustomerChange(
                                            customer.id,
                                            "demand",
                                            value
                                        )
                                    }
                                    validateOn={validateOn}
                                />
                            </div>
                        </div>
                    </TableCell>
                ))}
            </TableRow>
        </>
    );
}
