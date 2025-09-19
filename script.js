document.getElementById("kakeibo-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = {
    date: document.getElementById("date").value,
    item: document.getElementById("item").value,
    amount: document.getElementById("amount").value,
    type: document.getElementById("type").value
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbz2Ve0bjWK854tZqkKhq9bbH4Y5WuKygey-M-70bUiv684jUTYQs4zUuwq8JwpYz3Oiyg/exec", {
      method: "POST",
      body: JSON.stringify([data])
    });

    if (response.ok) {
      document.getElementById("message").textContent = "✅ 保存しました！";
      document.getElementById("kakeibo-form").reset();
    } else {
      document.getElementById("message").textContent = "❌ 保存できませんでした。";
    }
  } catch (error) {
    document.getElementById("message").textContent = "⚠️ 通信エラーが発生しました。";
  }
});
