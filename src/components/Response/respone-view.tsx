import type { FormData } from "@/types";
import { Card, CardTitle } from "../ui/card";

type ResponseViewProps = {
    formData: FormData;
};

export default function ResponseView({ formData }: ResponseViewProps) {
    return (
        <Card className="flex grow flex-col max-h-[calc(100vh-16px)] items-center justify-center p-8">
            <CardTitle className="text-2xl font-bold mb-4">Wyniki</CardTitle>

            <div>
                <h3 className="text-lg font-semibold mb-2">Dane wejściowe:</h3>
                <pre className="bg-gray-100 p-4 rounded-md text-black">
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>
        </Card>
    );
}
