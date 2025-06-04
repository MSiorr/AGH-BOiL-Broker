import { useState } from "react";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";

function App() {
    const [state, setState] = useState(0);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <main className="flex grow items-center justify-center text-foreground">
                <Button
                    className="text-foreground"
                    onClick={() => setState((prev) => prev + 1)}
                >
                    Click me! {state}
                </Button>
            </main>
        </ThemeProvider>
    );
}

export default App;
