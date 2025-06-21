const USER_ID = 1;  // Default test user

async function askAI() {
  const question = document.getElementById("question").value;
  const responseDiv = document.getElementById("answer");

  if (!question) {
    responseDiv.innerText = "Please enter a question.";
    return;
  }

  responseDiv.innerText = "Thinking...";

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: question, user_id: USER_ID }),
    });

    const data = await res.json();

    if (data.answer) {
      responseDiv.innerText = data.answer;
      loadHistory(); // Fetch updated history
    } else if (data.error) {
      responseDiv.innerText = `Error: ${data.error}`;
    } else {
      responseDiv.innerText = "No response received.";
    }
  } catch (err) {
    responseDiv.innerText = "Request failed. Check console.";
    console.error(err);
  }
}

async function loadHistory() {
  const historyDiv = document.getElementById("history");

  try {
    const res = await fetch(`/history/${USER_ID}`);
    const data = await res.json();

    if (data.history) {
      historyDiv.innerHTML = "";

      data.history.forEach((entry, index) => {
        const qaBlock = document.createElement("div");
        qaBlock.style.marginBottom = "1em";
        qaBlock.innerHTML = `
          <strong>Q${index + 1}:</strong> ${entry.question}<br/>
          <strong>A:</strong> ${entry.answer}<br/>
          <em style="font-size: 0.8em; color: gray;">${entry.timestamp}</em>
        `;
        historyDiv.appendChild(qaBlock);
      });
    }
  } catch (err) {
    historyDiv.innerText = "Failed to load history.";
    console.error(err);
  }
}

// Load history on page load
window.onload = loadHistory;
