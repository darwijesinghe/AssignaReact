import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// CSS
import "./index.css";

// Providers
import { LoadingProvider } from "./context/loading-context";
import GlobalLoadingSync from "./components/loading-sync/global-loading-sync";
import { AuthProvider } from "./context/auth-context";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastProvider } from "./context/toast-context";

import App from "./App"

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LoadingProvider>
          {/* Sync React Query global fetching with your overlay */}
          <GlobalLoadingSync />
          <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
            <AuthProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </LoadingProvider>
      </BrowserRouter>
      {/* DevTools here */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
