import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { UIProvider } from "@/context/UIContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { BagProvider } from "@/context/BagContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UIProvider>
      <WishlistProvider>
        <CompareProvider>
          <BagProvider>
            <App />
          </BagProvider>
        </CompareProvider>
      </WishlistProvider>
    </UIProvider>
  </StrictMode>
);