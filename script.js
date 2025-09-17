let records = [];
let incomeChart, expenseChart;

// 入力フォーム処理
document.getElementById("recordForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const item = document.getElementById("item").value;
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  addRecord(item, amount, type);
  this.reset();
});

// データ追加
function addRecord(item, amount, type) {
  records.push({ item, amount, type });
  updateSummary();
}

// 集計と表示更新
function updateSummary() {
  let summary = {};
  records.forEach(r => {
    let key = `${r.type}:${r.item}`;
    if (!summary[key]) summary[key] = 0;
    summary[key] += r.amount;
  });

  // 表を更新
  let table = document.getElementById("summaryTable");
  table.innerHTML = "<tr><th>区分</th><th>項目</th><th>金額</th></tr>";
  for (let key in summary) {
    let [type, item] = key.split(":");
    let row = table.insertRow();
    row.insertCell(0).innerText = type;
    row.insertCell(1).innerText = item;
    row.insertCell(2).innerText = summary[key] + "円";
  }

  // 収入と支出を分けて集計
  let incomeData = {};
  let expenseData = {};
  for (let key in summary) {
    let [type, item] = key.split(":");
    if (type === "収入") {
      incomeData[item] = summary[key];
    } else if (type === "支出") {
      expenseData[item] = summary[key];
    }
  }

  // 収入グラフ
  let incomeCtx = document.getElementById("incomeChart").getContext("2d");
  if (incomeChart) incomeChart.destroy();
  incomeChart = new Chart(incomeCtx, {
    type: "pie",
    data: {
      labels: Object.keys(incomeData),
      datasets: [{
        data: Object.values(incomeData),
        backgroundColor: ["#36a2eb", "#4bc0c0", "#9966ff", "#ff9f40", "#ffcd56"]
      }]
    }
  });

  // 支出グラフ
  let expenseCtx = document.getElementById("expenseChart").getContext("2d");
  if (expenseChart) expenseChart.destroy();
  expenseChart = new Chart(expenseCtx, {
    type: "pie",
    data: {
      labels: Object.keys(expenseData),
      datasets: [{
        data: Object.values(expenseData),
        backgroundColor: ["#ff6384", "#ff9f40", "#36a2eb", "#4bc0c0", "#9966ff"]
      }]
    }
  });

  // 保存ボタンに処理を割り当て
  document.getElementById("saveButton").onclick = function() {
    saveToSheet(summary);
  };
}

// スプレッドシートに保存
function saveToSheet(summary) {
  const today = new Date().toLocaleDateString("ja-JP");

  let rows = [];
  for (let key in summary) {
    let [type, item] = key.split(":");
    rows.push({
      date: today,
      item: item,
      amount: summary[key],
      type: type
    });
  }

  fetch("YOUR_WEB_APP_URL", { https://script.google.com/macros/s/AKfycby3VrNFitYAzCdOw74r0E5nq7sfVwnWdLnO5fTsbBIUccKqDYaAwn4hLDE1i-vcZKUCmA/exec 
    method: "POST",
    body: JSON.stringify(rows)
  })
  .then(res => res.text())
  .then(txt => alert("保存しました: " + txt))
  .catch(err => alert("エラー: " + err));
}
