import { createContext, useState } from "react";
import { initialTransactions } from "../data/mockData";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [role, setRole] = useState("Admin"); // Default Role

  return (
    <AppContext.Provider
      value={{ transactions, setTransactions, role, setRole }}>
      {children}
    </AppContext.Provider>
  );
};
