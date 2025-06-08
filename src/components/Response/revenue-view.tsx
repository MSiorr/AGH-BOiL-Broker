import type { detailedRevenue } from "@/lib/zzt";

export default function detailedRevenue({ data }: { data: detailedRevenue }) {
    return (
        <div className="flex flex-col gap-y-2">
            <h2 className="text-2xl font-bold">Szczegółowe przychody</h2>
            <table className="w-full table-auto border-collapse border">
                <tbody>
                    <tr>
                        <th className="border px-4 py-2 text-center" />
                        {data[0].map((_, index) => (
                            <th
                                key={index}
                                className="border px-4 py-2 text-center"
                            >
                                {`O${index + 1}`}
                            </th>
                        ))}
                    </tr>
                    {data.map((row, index) => (
                        <tr key={index} className="border-b">
                            <td className="font-bold">{`D${index + 1}`}</td>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="border px-4 py-2 text-center"
                                >
                                    {typeof cell === "number"
                                        ? cell.toFixed(2)
                                        : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
