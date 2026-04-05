const now = new Date();

// Helper to get relative dates
const subDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

export const initialTransactions = [
  {
    id: "tx-1",
    date: subDays(0), // TODAY (Tests 24H)
    category: "Salary",
    amount: 5000,
    type: "income",
    description: "Principal Monthly Settlement",
  },
  {
    id: "tx-2",
    date: subDays(1), // YESTERDAY (Tests 7D)
    category: "Food",
    amount: 150,
    type: "expense",
    description: "Procurement of Sustenance & Provisions",
  },
  {
    id: "tx-3",
    date: subDays(3), // 3 DAYS AGO (Tests 7D)
    category: "Freelance",
    amount: 1200,
    type: "income",
    description: "External engineering consultation",
  },
  {
    id: "tx-4",
    date: subDays(5), // 5 DAYS AGO (Tests 7D)
    category: "Rent",
    amount: 2500,
    type: "expense",
    description: "Operational Node Lease Agreement",
  },
  {
    id: "tx-5",
    date: subDays(12), // 12 DAYS AGO (Tests 1M)
    category: "Shopping",
    amount: 450,
    type: "expense",
    description: "High-Performance Workstation Hardware",
  },
  {
    id: "tx-6",
    date: subDays(18), // 18 DAYS AGO (Tests 1M)
    category: "Investment",
    amount: 800,
    type: "income",
    description: "Capital Scaling Dividend Payout",
  },
  {
    id: "tx-7",
    date: subDays(25), // 25 DAYS AGO (Tests 1M)
    category: "Transport",
    amount: 95,
    type: "expense",
    description: "Logistics Flux & Asset Migration",
  },
  {
    id: "tx-8",
    date: subDays(45), // 1.5 MONTHS AGO (Tests 1Y)
    category: "Utilities",
    amount: 230,
    type: "expense",
    description: "Global Node Resource Maintenance",
  },
  {
    id: "tx-9",
    date: subDays(60), // 2 MONTHS AGO (Tests 1Y)
    category: "Salary",
    amount: 5000,
    type: "income",
    description: "Secondary Session Yield Liquidation",
  },
  {
    id: "tx-10",
    date: subDays(120), // 4 MONTHS AGO (Tests 1Y)
    category: "Entertainment",
    amount: 110,
    type: "expense",
    description: "Creative Stimulation Simulation",
  },
  {
    id: "tx-11",
    date: subDays(200), // ~7 MONTHS AGO (Tests 1Y)
    category: "Food",
    amount: 280,
    type: "expense",
    description: "Executive Dining & Provisioning",
  },
  {
    id: "tx-12",
    date: subDays(300), // ~10 MONTHS AGO (Tests 1Y)
    category: "Investment",
    amount: 4500,
    type: "income",
    description: "Strategic Asset Principal Liquidation",
  },
  {
    id: "tx-13",
    date: subDays(400), // OVER A YEAR AGO (Tests ALL only)
    category: "Health",
    amount: 350,
    type: "expense",
    description: "Bio-Metric Optimization Protocol",
  },
];
