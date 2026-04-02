/**
 * Finance Dashboard Logic Utilities
 * Ye functions pure app mein calculations handle karenge.
 */

// 1. Basic Summary: Total Balance, Income, and Expense
export const calculateSummary = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { balance: 0, income: 0, expense: 0 };
  }

  return transactions.reduce(
    (acc, t) => {
      const amount = Number(t.amount) || 0;
      if (t.type === "income") {
        acc.income += amount;
        acc.balance += amount;
      } else if (t.type === "expense") {
        acc.expense += amount;
        acc.balance -= amount;
      }
      return acc;
    },
    { balance: 0, income: 0, expense: 0 },
  );
};

// 2. Category Breakdown: Spending per category (For Pie Chart/Insights)
export const calculateCategoryStats = (transactions) => {
  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const stats = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});

  // Object ko array mein convert karna (Charts ke liye easy rehta hai)
  return Object.keys(stats).map((key) => ({
    name: key,
    value: stats[key],
  }));
};

// 3. Get Highest Spending Category (For Insights Requirement #4)
export const getHighestSpendingCategory = (transactions) => {
  const categoryStats = calculateCategoryStats(transactions);
  if (categoryStats.length === 0) return "N/A";

  const highest = categoryStats.reduce((prev, current) =>
    prev.value > current.value ? prev : current,
  );

  return highest.name;
};

// 4. Monthly Trend: Data formatted for Bar/Line Charts
export const calculateMonthlyTrend = (transactions) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const trend = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const monthName = months[date.getMonth()];

    if (!acc[monthName]) {
      acc[monthName] = { name: monthName, income: 0, expense: 0 };
    }

    if (t.type === "income") acc[monthName].income += Number(t.amount);
    if (t.type === "expense") acc[monthName].expense += Number(t.amount);

    return acc;
  }, {});

  return Object.values(trend);
};
