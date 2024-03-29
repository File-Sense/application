import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/index.css";
import App from "./App";
import ReactQueryProvider from "#/components/providers/reactquery-provider";
import { ThemeProvider } from "#/components/providers/theme-provider";
import ErrorBoundry from "#/components/error-boundry";
import GlobalError from "#/components/global-error";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReactQueryProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <ErrorBoundry fallback={<GlobalError />}>
            <App />
          </ErrorBoundry>
        </ThemeProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
