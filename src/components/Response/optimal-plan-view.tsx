import type { optimalPlan } from "@/lib/zzt";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

export default function OptimalPlanView({ data }: { data: optimalPlan }) {
    return (
        <div className="flex flex-col gap-y-2">
            <h2 className="text-2xl font-bold">Przewozy</h2>
            <Table className="w-full table-auto border-collapse border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="border px-4 py-2 text-center" />
                        {Array.from({
                            length: data.mapSize.x,
                        }).map((_, index) => (
                            <TableHead
                                key={index}
                                className="border px-4 py-2 text-center"
                            >
                                {`O${
                                    data.withFakes &&
                                    index == data.mapSize.x - 1
                                        ? "F"
                                        : index + 1
                                }`}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.plan.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="border-b">
                            <TableCell className="font-bold">
                                {`D${
                                    data.withFakes &&
                                    rowIndex == data.plan.length - 1
                                        ? "F"
                                        : rowIndex + 1
                                }`}
                            </TableCell>
                            {row.map((cell, cellIndex) => (
                                <TableCell
                                    key={cellIndex}
                                    className="border px-4 py-2 text-center"
                                >
                                    {cell !== null ? cell.toFixed(2) : "-"}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
