"use client";

import { Card, CardTitle } from "../ui/card";
import {
    type deltaResults,
    type detailedRevenue,
    type optimalPlan,
    type ZZTResult,
} from "@/lib/zzt.ts";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import React from "react";
import RevenueView from "./revenue-view";
import DeltasView from "./deltas-view";
import OptimalPlanView from "./optimal-plan-view";

type ResponseViewProps = {
    result: ZZTResult;
};

export default function ResponseView({ result }: ResponseViewProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const totalProfitCalc =
        result.revenueTotal -
        (result.transportCostTotal + result.purchaseCostTotal);

    return (
        <Card className="flex grow flex-col max-h-[calc(100vh-16px)] items-center justify-center p-8 relative">
            <CardTitle className="text-2xl font-bold mb-4">Wyniki</CardTitle>

            <Table className="w-2/4 m-auto text-center border-collapse border">
                <TableBody>
                    <TableRow>
                        <TableCell></TableCell>
                        {result.colLabels.map((label) => (
                            <TableCell className="border font-bold">
                                {label}
                            </TableCell>
                        ))}
                    </TableRow>
                    {result.rowLabels.map((label, index) => (
                        <TableRow>
                            <TableCell className="border font-bold">
                                {label}
                            </TableCell>
                            {result.zData[index].map((value, jndex) => {
                                const planData = result.planData[index][jndex];

                                return (
                                    <TableCell className="border p-0">
                                        <div className="grid grid-cols-2 grid-rows-2 aspect-[5/2]">
                                            <p className="flex grow items-center justify-center">
                                                {value}
                                            </p>
                                            <p
                                                className={
                                                    "row-start-2 col-start-2 flex grow items-center justify-center " +
                                                    (typeof planData == "number"
                                                        ? "border border-red-400"
                                                        : "")
                                                }
                                            >
                                                {planData}
                                            </p>
                                        </div>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="absolute top-0 left-0 p-4 bg-secondary text-lg rounded-xl">
                <Button
                    type="button"
                    className="w-32 h-12"
                    onClick={() => {
                        console.log(result.history);
                        setIsOpen(true);
                    }}
                >
                    Historia
                </Button>
            </div>

            <div className="absolute bottom-1/2 translate-y-1/2 right-0 p-4 bg-secondary text-center flex gap-4 text-lg rounded-xl">
                <p>
                    {result.deltaReadable.map((p) => (
                        <p>{p}</p>
                    ))}
                </p>
                <p>
                    Koszt transportu = {result.transportCostTotal} <br />
                    Koszt zakupu = {result.purchaseCostTotal} <br />
                    Koszt całkowity ={" "}
                    {result.purchaseCostTotal + result.transportCostTotal}{" "}
                    <br />
                    <br />
                    Przychód całkowity = {result.revenueTotal} <br />
                    Zysk = {result.totalProfit} <br />
                    <br />
                    <p
                        className={
                            result.totalProfit == totalProfitCalc
                                ? "text-green-400"
                                : "text-red-600"
                        }
                    >
                        {result.revenueTotal} - ({result.transportCostTotal} +{" "}
                        {result.purchaseCostTotal}) = {totalProfitCalc}
                    </p>
                </p>
            </div>

            <div className="absolute bottom-0 right-0 p-4 bg-secondary text-lg rounded-xl">
                <h2>Legenda:</h2>
                <div className="mt-5 w-100 grid grid-cols-2 grid-rows-2 aspect-[5/2] border font-bold">
                    <p className="flex grow items-center justify-center">
                        Zyski jednostkowe
                    </p>
                    <p className="row-start-2 col-start-2 flex grow items-center justify-center border border-red-400">
                        Optymalne przewozy
                    </p>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[calc(100vh-16px)] overflow-y-auto flex flex-col gap-y-8 px-16 max-w-1/2">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold mb-4">
                            Historia
                        </DialogTitle>
                    </DialogHeader>
                    {result.history &&
                        result.history.length > 0 &&
                        result.history.map(
                            (item) =>
                                item &&
                                ((item.name == "revenue" && (
                                    <RevenueView
                                        data={item.data as detailedRevenue}
                                    />
                                )) ||
                                    (item.name == "deltaResults" && (
                                        <DeltasView
                                            data={item.data as deltaResults}
                                        />
                                    )) ||
                                    (item.name == "optimalPlan" && (
                                        <OptimalPlanView
                                            data={item.data as optimalPlan}
                                        />
                                    )))
                        )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
