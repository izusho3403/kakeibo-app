const form = document.getElementById("form");
const list = document.getElementById("list");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");

let income = 0;
let expense = 0;

// Chart.js の設定
const ctx = document.getElementById("myChart").getContext("2d");
let chart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["収入", "支出"],
    datasets: [{
      data: [income, expense],
      backgroundColor: ["#4CAF50", "#F44336"]
    }]
  }
});

// フォーム送信処理
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const item = document.getElementById("item").value;
  const amount = parseInt(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  const li = document.createElement("li");
  li.textContent = `${item}: ${amount}円 (${type === "income" ? "収入" : "支出"})`;
  list.appendChild(li);

  if (type === "income") {
    income += amount;
  } else {
    expense += amount;
  }

  updateSummary();
  updateChart();

  form.reset();
});

// 集計を更新
function updateSummary() {
  totalIncome.textContent = income;
  totalExpense.textContent = expense;
  balance.textContent = income - expense;
}

// グラフを更新
function updateChart() {
  chart.data.datasets[0].data = [income, expense];
  chart.update();
}

