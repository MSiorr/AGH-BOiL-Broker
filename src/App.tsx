import { useState } from "react";
import "./App.css";
import LogisticsForm from "./components/LogisticForm/logistics-form";
import { ThemeProvider } from "./components/theme-provider";
import type { FormData } from "./types";
import ResponseView from "./components/Response/respone-view";
import {ZZT, type ZZTResult} from "@/lib/zzt.ts";

function App() {
    const [result, setResult] = useState<ZZTResult | undefined>(undefined);

    const handleFormSubmit = (formData: FormData) => {
        setResult(ZZT(formData));
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <main className="gap-x-2 p-2 min-w-screen min-h-screen flex justify-between">
                <LogisticsForm onSubmit={handleFormSubmit} />

                {result && <ResponseView result={result} />}
            </main>
        </ThemeProvider>
    );
}

export default App;
