import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppProvider } from "./context/appContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <App />
    </AppProvider>
    <ReactQueryDevtools></ReactQueryDevtools>
    <ToastContainer
      position="top-center"
      autoClose="2000"
      theme="dark"
      hideProgressBar
      closeButton={false}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      transition={Slide}
      stacked
    />
  </QueryClientProvider>
);
