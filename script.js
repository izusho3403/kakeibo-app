// Apps ScriptのデプロイURLを貼る
const scriptURL = "https://script.google.com/macros/s/AKfycbymnjeB25BWn0U-j0EmAdKCLDJ546jD3GYbnB76bKJDzWjpFyPVRLHGISuvXn4vD97M/exec";

let data = [];
const form = document.getElementById("recordForm");
const table = document.getElementById("summaryTable");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");

let incomeChart, expenseChart;

// グラフ初期化
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

// 表示更新
function updateDisplay() {
  table.innerHTML = `
    <tr><th>日付</th><th>区分</th><th>項目</th><th>金額</th></tr>`;
  data.forEach(d => {
    const row = table.insertRow();
    row.insertCell().innerText = d.date;
    row.insertCell().innerText = d.type;
    row.insertCell().innerText = d.item;
    row.insertCell().innerText = d.amount;
  });

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
  incomeChart.update();

  expenseChart.data.labels = Object.keys(expenseData);
  expenseChart.data.datasets[0].data = Object.values(expenseData);
  expenseChart.update();
}

// スプレッドシートに送信
function saveToSheet(date, type, item, amount) {
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({ date, type, item, amount }),
    headers: { "Content-Type": "application/json" }
  })
    .then(response => response.text())
    .then(text => {
      console.log("サーバー応答:", text);
      alert("保存結果: " + text);
    })
    .catch(error => console.error("送信エラー:", error));
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

window.onload = () => initCharts();

