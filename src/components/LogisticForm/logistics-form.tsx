import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Customer, Supplier, UnitCostsMatrix } from "@/types";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import CustomersHeader from "./customers-header";
import LogisticRow from "./logistic-row";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import {testData} from "@/App.tsx";

type LogisticFormProps = {
    onSubmit?: (data: {
        suppliers: Supplier[];
        customers: Customer[];
        unitCosts: UnitCostsMatrix;
        clientDemandFulfillment: string | null;
    }) => void;
};

const defaultValue = (testValue: number) => testData ? testValue : -1;

export default function LogisticsForm({ onSubmit }: LogisticFormProps) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([
        { id: "D1", supply: defaultValue(20), sellingPrice: defaultValue(10) },
        { id: "D2", supply: defaultValue(30), sellingPrice: defaultValue(12) },
    ]);

    const [customers, setCustomers] = useState<Customer[]>([
        { id: "O1", demand: defaultValue(10), buyingPrice: defaultValue(30) },
        { id: "O2", demand: defaultValue(28), buyingPrice: defaultValue(25) },
        { id: "O3", demand: defaultValue(27), buyingPrice: defaultValue(30) },
    ]);

    const [unitCosts, setUnitCosts] = useState<UnitCostsMatrix>({
        D1: { O1: defaultValue(8), O2: defaultValue(14), O3: defaultValue(17) },
        D2: { O1: defaultValue(12), O2: defaultValue(9), O3: defaultValue(19) },
    });

    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(
        null
    );

    const [validateOn, setValidateOn] = useState<boolean>(false);
    const [formIsValid, setFormIsValid] = useState<boolean>(true);

    const handleSupplierChange = (
        supplierId: string,
        field: keyof Supplier,
        value: number
    ) => {
        setSuppliers((prevSuppliers) =>
            prevSuppliers.map((supplier) =>
                supplier.id === supplierId
                    ? { ...supplier, [field]: value }
                    : supplier
            )
        );
    };

    const handleCustomerChange = (
        customerId: string,
        field: keyof Customer,
        value: number
    ) => {
        setCustomers((prevCustomers) =>
            prevCustomers.map((customer) =>
                customer.id === customerId
                    ? { ...customer, [field]: value }
                    : customer
            )
        );
    };

    const handleAddSupplier = () => {
        setSuppliers((prevSuppliers) => {
            const newSupplier: Supplier = {
                id: `D${prevSuppliers.length + 1}`,
                supply: -1,
                sellingPrice: -1,
            };
            const updatedSuppliers = [...prevSuppliers, newSupplier];

            setUnitCosts((prevCosts) => {
                const newCosts: UnitCostsMatrix = { ...prevCosts };
                newCosts[newSupplier.id] = {};
                customers.forEach((customer) => {
                    newCosts[newSupplier.id][customer.id] = -1;
                });
                return newCosts;
            });

            return updatedSuppliers;
        });
    };

    const handleAddCustomer = () => {
        setCustomers((prevCustomers) => {
            const newCustomer: Customer = {
                id: `O${prevCustomers.length + 1}`,
                demand: -1,
                buyingPrice: -1,
            };
            const updatedCustomers = [...prevCustomers, newCustomer];

            setUnitCosts((prevCosts) => {
                const newCosts: UnitCostsMatrix = {};
                suppliers.forEach((supplier) => {
                    newCosts[supplier.id] = {
                        ...prevCosts[supplier.id],
                        [newCustomer.id]: -1,
                    };
                });
                return newCosts;
            });

            return updatedCustomers;
        });
    };

    const handleDeleteSupplier = () => {
        setSuppliers((prevSuppliers) => {
            const updatedSuppliers = prevSuppliers.slice(0, -1);
            const lastSupplierId = prevSuppliers[prevSuppliers.length - 1].id;
            setUnitCosts((prevCosts) => {
                const newCosts: UnitCostsMatrix = { ...prevCosts };
                delete newCosts[lastSupplierId];
                return newCosts;
            });

            return updatedSuppliers;
        });
    };

    const handleDeleteCustomer = () => {
        setCustomers((prevCustomers) => {
            const updatedCustomers = prevCustomers.slice(0, -1);
            const lastCustomerId = prevCustomers[prevCustomers.length - 1].id;

            setUnitCosts((prevCosts) => {
                const newCosts: UnitCostsMatrix = {};
                suppliers.forEach((supplier) => {
                    newCosts[supplier.id] = { ...prevCosts[supplier.id] };
                    delete newCosts[supplier.id][lastCustomerId];
                });
                return newCosts;
            });

            return updatedCustomers;
        });
    };

    const validateInputs = () => {
        const isValid =
            suppliers.every((supplier) => {
                return (
                    supplier.supply >= 0 &&
                    supplier.sellingPrice >= 0
                );
            }) &&
            customers.every((customer) => {
                return (
                    customer.demand >= 0 &&
                    customer.buyingPrice >= 0
                );
            }) &&
            Object.values(unitCosts).every((costRow) => {
                return Object.values(costRow).every((cost) => {
                    return (
                        cost >= 0
                    );
                });
            });

        if (!isValid) {
            setValidateOn(true);
            setFormIsValid(false);
        } else {
            setValidateOn(false);
            setFormIsValid(true);
        }
        return isValid;
    };

    const handleSubmit = () => {
        if (validateInputs() && onSubmit)
            onSubmit({
                suppliers,
                customers,
                unitCosts,
                clientDemandFulfillment: selectedCustomer,
            });
    };

    return (
        <Card className="w-fit p-4 max-w-1/2 h-[calc(100vh-16px)]">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Problem Pośrednika w Logistyce - formularz
                </CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col gap-y-4 justify-between">
                <form className="overflow-auto max-h-[calc(100vh-280px)]">
                    <Table>
                        <TableBody>
                            <CustomersHeader
                                customers={customers}
                                handleCustomerChange={handleCustomerChange}
                                validateOn={validateOn}
                            />
                            {suppliers.map((supplier, index) => (
                                <LogisticRow
                                    key={supplier.id}
                                    supplier={supplier}
                                    customers={customers}
                                    unitCosts={unitCosts[supplier.id]}
                                    handleSupplierChange={handleSupplierChange}
                                    setUnitCosts={setUnitCosts}
                                    index={index}
                                    suppliers={suppliers}
                                    handleAddCustomer={handleAddCustomer}
                                    handleDeleteCustomer={handleDeleteCustomer}
                                    validateOn={validateOn}
                                />
                            ))}
                            <TableRow>
                                <TableCell colSpan={2} />
                                <TableCell colSpan={customers.length}>
                                    <div className="flex justify-center w-fit mx-auto gap-x-4">
                                        <Button
                                            type="button"
                                            className="h-12 w-12 text-2xl"
                                            onClick={handleAddSupplier}
                                        >
                                            +
                                        </Button>
                                        <Button
                                            type="button"
                                            className="h-12 w-12 text-2xl"
                                            onClick={handleDeleteSupplier}
                                            disabled={suppliers.length <= 1}
                                        >
                                            -
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {!formIsValid && (
                        <div className="text-red-500/60 font-bold mt-4 text-center w-full bg-red-600/20 py-2 px-4 border-2 border-red-500/30 rounded-lg">
                            Proszę uzupełnić wszystkie pola poprawnie.
                        </div>
                    )}
                </form>

                <div className="w-full text-center mt-8">
                    <Label className="text-md">
                        Wymuszenie spełnienia popytu dla klienta
                    </Label>
                    <Select
                        value={selectedCustomer ?? "none"}
                        onValueChange={(value) => {
                            setSelectedCustomer(
                                value === "none" ? null : value
                            );
                        }}
                    >
                        <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Wybierz opcję" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Nie wymuszaj</SelectItem>
                            {customers.map((customer) => (
                                <SelectItem
                                    key={customer.id}
                                    value={customer.id}
                                >
                                    {customer.id}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        type="button"
                        className="mt-4 w-full"
                        onClick={handleSubmit}
                    >
                        Generuj rozwiązanie
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
