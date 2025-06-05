import { useState } from "react";
import "./App.css";
import LogisticsForm from "./components/LogisticForm/logistics-form";
import { ThemeProvider } from "./components/theme-provider";
import type { FormData } from "./types";
import ResponseView from "./components/Response/respone-view";

function App() {
    const [formData, setFormData] = useState<FormData | undefined>(undefined);

    const handleFormSubmit = ({
        suppliers,
        customers,
        unitCosts,
        clientDemandFulfillment,
    }: FormData) => {
        setFormData({
            suppliers,
            customers,
            unitCosts,
            clientDemandFulfillment,
        });
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <main className="gap-x-2 p-2 min-w-screen min-h-screen flex justify-between">
                <LogisticsForm onSubmit={handleFormSubmit} />

                {formData && <ResponseView formData={formData} />}
            </main>
        </ThemeProvider>
    );
}

export default App;
