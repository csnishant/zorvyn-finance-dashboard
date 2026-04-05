import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const useFinance = () => {
  const context = useContext(AppContext);

  // ❗ Safety check (important)
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }

  return context;
};
