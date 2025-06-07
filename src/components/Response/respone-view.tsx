import {Card, CardTitle} from "../ui/card";
import type {ZZTResult} from "@/lib/zzt.ts";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";

type ResponseViewProps = {
    result: ZZTResult;
};

export default function ResponseView({result}: ResponseViewProps) {

    const totalProfitCalc = result.revenueTotal - (result.transportCostTotal + result.purchaseCostTotal);

    return (
        <Card className="flex grow flex-col max-h-[calc(100vh-16px)] items-center justify-center p-8 relative">
            <CardTitle className="text-2xl font-bold mb-4">Wyniki</CardTitle>


            <Table className="w-2/4 m-auto text-center border-collapse border">
                <TableBody>
                <TableRow>
                    <TableCell></TableCell>
                    {result.colLabels.map((label) => <TableCell className="border font-bold">{label}</TableCell>)}
                </TableRow>
                {result.rowLabels.map((label, index) =>
                    <TableRow>
                        <TableCell className="border font-bold">{label}</TableCell>
                        {result.zData[index].map((value, jndex) => {
                            const planData = result.planData[index][jndex];

                            return (<TableCell className="border p-0">
                                <div className="grid grid-cols-2 grid-rows-2 aspect-[5/2]">
                                    <p className="flex grow items-center justify-center">{value}</p>
                                    <p className={"row-start-2 col-start-2 flex grow items-center justify-center " + (typeof planData == 'number' ? "border border-red-400" : "")}>{planData}</p>
                                </div>
                            </TableCell>);
                        })}
                    </TableRow>
                )}
                </TableBody>
            </Table>

            <div className="absolute bottom-1/2 translate-y-1/2 right-0 p-4 bg-secondary text-center flex gap-4 text-lg rounded-xl">
                <p>
                    {result.deltaReadable.map(p => <p>{p}</p>)}
                </p>
                <p>
                    Zysk całkowity = {result.totalProfit} <br/>
                    Koszt transportu = {result.transportCostTotal} <br/>
                    Koszt zakupu = {result.purchaseCostTotal} <br/>
                    Przychód = {result.revenueTotal} <br/>
                    <br/>
                    <p className={result.totalProfit == totalProfitCalc ? "text-green-400" : "text-red-600"}>
                        {result.revenueTotal} - ({result.transportCostTotal} + {result.purchaseCostTotal})
                        = {totalProfitCalc}
                    </p>
                </p>
            </div>

            <div className="absolute bottom-0 right-0 p-4 bg-secondary text-lg rounded-xl">
                <h2>Legenda:</h2>
                <div className="mt-5 w-100 grid grid-cols-2 grid-rows-2 aspect-[5/2] border font-bold">
                    <p className="flex grow items-center justify-center">Profit indywidualny</p>
                    <p className="row-start-2 col-start-2 flex grow items-center justify-center border border-red-400">Optymalny transport</p>
                </div>
            </div>
        </Card>
    );
}
