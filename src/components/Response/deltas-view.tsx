import type { deltaResults } from "@/lib/zzt";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";

export default function DeltasView({ data }: { data: deltaResults }) {
    const [deltas, setDeltas] = useState<number[][]>(
        Array.from({ length: data.mapSize.y }, () =>
            Array(data.mapSize.x).fill(null)
        )
    );

    useEffect(() => {
        const deltasCpy = [...deltas];
        data.deltas.forEach((deltaData) => {
            const [row, col, value] = deltaData;
            if (row < deltasCpy.length && col < deltasCpy[0].length) {
                deltasCpy[row][col] = value;
            }
        });
        setDeltas(deltasCpy);
    }, [data.deltas, deltas]);

    return (
        <div className="flex flex-col gap-y-2">
            <h2 className="text-2xl font-bold">Delty</h2>
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
                    {deltas.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="border-b">
                            <TableCell className="font-bold">
                                {`D${
                                    data.withFakes &&
                                    rowIndex == deltas.length - 1
                                        ? "F"
                                        : rowIndex + 1
                                }`}
                            </TableCell>
                            {row.map((cell, cellIndex) => (
                                <TableCell
                                    key={cellIndex}
                                    className="border px-4 py-2 text-center"
                                >
                                    {cell ? cell.toFixed(2) : "x"}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
