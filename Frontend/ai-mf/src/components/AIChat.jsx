import React, { useState } from "react";

function AIChat({ onSubmit, aiResponse, history }) {
  const [input, setInput] = useState("");

  return (
    <div>
      <h2>AI Chat Assistant</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(input);
          setInput("");
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button type="submit">Ask</button>
      </form>

      {aiResponse && (
        <div>
          <strong>AI:</strong> {aiResponse.text}
          <ul>
            {aiResponse.suggestedQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      <h3>Past Interactions</h3>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            <strong>Q:</strong> {item.input} <br />
            <strong>A:</strong> {item.response}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AIChat;
