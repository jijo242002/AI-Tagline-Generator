import React, { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("Casual");
  const [count, setCount] = useState(3);
  const [taglines, setTaglines] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:5000";

  // Fetch history on page load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`);
      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to fetch history.");
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/tagline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          audience,
          tone,
          count,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate taglines");
      }

      const data = await response.json();
      setTaglines(data.taglines || []);
      fetchHistory(); // refresh history after new taglines
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>✨ AI Tagline Generator</h1>

      {/* Form */}
      <form onSubmit={handleGenerate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />

        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />

        <input
          type="text"
          placeholder="Target Audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          required
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />

        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        >
          <option value="Funny">Funny</option>
          <option value="Professional">Professional</option>
          <option value="Luxury">Luxury</option>
          <option value="Casual">Casual</option>
        </select>

        <input
          type="number"
          min="1"
          max="10"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />

        <button type="submit" disabled={loading} style={{ padding: "10px 20px", marginTop: "10px" }}>
          {loading ? "Generating..." : "Generate Taglines"}
        </button>
      </form>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Generated Taglines */}
      <h2>🎯 Generated Taglines</h2>
      <ul>
        {taglines.map((tagline, idx) => (
          <li key={idx}>{tagline}</li>
        ))}
      </ul>

      {/* History */}
      <h2>📜 History</h2>
      {history.length === 0 ? (
        <p>No taglines generated yet.</p>
      ) : (
        <ul>
          {history.map((item) => (
            <li key={item.id}>
              <strong>{item.product_name}:</strong> {item.tagline} <em>({item.tone})</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
