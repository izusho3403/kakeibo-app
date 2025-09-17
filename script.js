// ここに自分のApps ScriptのURLを貼る
const scriptURL = "https://script.google.com/macros/s/AKfycby3VrNFitYAzCdOw74r0E5nq7sfVwnWdLnO5fTsbBIUccKqDYaAwn4hLDE1i-vcZKUCmA/exec";

// データ管理用
let data = [];

// DOM
const form = document.getElementById("recordForm");
const table = document.getElementById("summaryTable");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");

let incomeChart, expenseChart;

// 初期化
function initCharts() {
  const incomeCtx = document.getElementById("incomeChart").getContext("2d");
  incomeChart = new Chart(incomeCtx, {
    type: "pie",
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
  });

  const expenseCtx = document.getElementById("expenseChart").getContext("2d");
  expenseChart = new Chart(expenseCtx, {
    type: "pie",
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
  });
}

// データ更新
function updateDisplay() {
  // 表の更新
  table.innerHTML = `
    <tr>
      <th>日付</th><th>区分</th><th>項目</th><th>金額</th>
    </tr>`;
  data.forEach(d => {
    const row = table.insertRow();
    row.insertCell().innerText = d.date;
    row.insertCell().innerText = d.type;
    row.insertCell().innerText = d.item;
    row.insertCell().innerText = d.amount;
  });

  // 合計計算
  const totalIncome = data.filter(d => d.type === "収入").reduce((a, b) => a + b.amount, 0);
  const totalExpense = data.filter(d => d.type === "支出").reduce((a, b) => a + b.amount, 0);
  totalIncomeEl.innerText = totalIncome + "円";
  totalExpenseEl.innerText = totalExpense + "円";
  balanceEl.innerText = (totalIncome - totalExpense) + "円";

  // グラフ更新
  const incomeData = {};
  const expenseData = {};
  data.forEach(d => {
    if (d.type === "収入") incomeData[d.item] = (incomeData[d.item] || 0) + d.amount;
    if (d.type === "支出") expenseData[d.item] = (expenseData[d.item] || 0) + d.amount;
  });

  incomeChart.data.labels = Object.keys(incomeData);
  incomeChart.data.datasets[0].data = Object.values(incomeData);
  incomeChart.data.datasets[0].backgroundColor = Object.keys(incomeData).map(() => "#16a085");
  incomeChart.update();

  expenseChart.data.labels = Object.keys(expenseData);
  expenseChart.data.datasets[0].data = Object.values(expenseData);
  expenseChart.data.datasets[0].backgroundColor = Object.keys(expenseData).map(() => "#e74c3c");
  expenseChart.update();
}

// スプレッドシートに送信
function saveToSheet(date, type, item, amount) {
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({ date, type, item, amount }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") alert("スプレッドシートに保存しました！");
    })
    .catch(error => console.error("Error:", error));
}

// フォーム送信処理
form.addEventListener("submit", e => {
  e.preventDefault();

  const date = new Date().toLocaleDateString();
  const type = document.getElementById("type").value;
  const item = document.getElementById("item").value;
  const amount = parseInt(document.getElementById("amount").value);

  const entry = { date, type, item, amount };
  data.push(entry);

  updateDisplay();
  saveToSheet(date, type, item, amount);

  form.reset();
});

// ページロード時にグラフ初期化
window.onload = () => {
  initCharts();
};
