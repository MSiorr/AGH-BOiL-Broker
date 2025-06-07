import {Card, CardTitle} from "../ui/card";
import type {ZZTResult} from "@/lib/zzt.ts";

type ResponseViewProps = {
    result: ZZTResult;
};

export default function ResponseView({result}: ResponseViewProps) {

    const totalProfitCalc = result.revenueTotal - (result.transportCostTotal + result.purchaseCostTotal);

    return (
        <Card className="flex grow flex-col max-h-[calc(100vh-16px)] items-center justify-center p-8 relative">
            <CardTitle className="text-2xl font-bold mb-4">Wyniki</CardTitle>
            <div className="absolute bottom-0 right-0 p-4 bg-black text-center flex gap-4 text-lg rounded-xl">
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
        </Card>
    );
}
