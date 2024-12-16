import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function HomeP() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const debts = JSON.parse(localStorage.getItem("debts")) || [];

    const income = debts.filter(debt => debt.type === "income")
                         .reduce((acc, debt) => acc + (debt.convertedPrice || 0), 0);
    const expense = debts.filter(debt => debt.type === "expense")
                          .reduce((acc, debt) => acc + (debt.convertedPrice || 0), 0);

    setTotalIncome(income);
    setTotalExpense(expense);
  }, []);

  const total = totalIncome + totalExpense;
  const incomePercentage = (totalIncome / total) * 100 || 0;
  const expensePercentage = (totalExpense / total) * 100 || 0;

  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Percentage',
        data: [incomePercentage, expensePercentage],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: ['#388e3c', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Daromad va Xarajatlar Foizi',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="homep-container">
      <h4>Daromad va Xarajatlar Foizi</h4>
      <div style={{ position: 'relative', width: '100%', height: '50vh' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
