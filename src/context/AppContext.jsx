import { createContext, useState } from "react";
import { initialTransactions } from "../data/mockData";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [role, setRole] = useState(
    () => localStorage.getItem("role") || "admin",
  );

  const handleSetRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  return (
    <AppContext.Provider
      value={{ transactions, setTransactions, role, setRole: handleSetRole }}>
      {children}
    </AppContext.Provider>
  );
};
