import React, { useState } from "react";

function TaglineForm({ onGenerate, suggestions = [] }) {
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("funny");
  const [count, setCount] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ product, description, audience, tone, count });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 space-y-4"
    >
      {/* Product Name */}
      <div>
        <label className="block font-semibold mb-1">📦 Product Name</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your product name"
          required
        />
      </div>

      {/* Product Description */}
      <div>
        <label className="block font-semibold mb-1">📝 Product Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your product..."
          rows={3}
          required
        />
      </div>

      {/* Target Audience */}
      <div>
        <label className="block font-semibold mb-1">🎯 Target Audience</label>
        <input
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. students, professionals"
          required
        />
      </div>

      {/* Tone */}
      <div>
        <label className="block font-semibold mb-1">🎨 Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
        >
          <option value="funny">Funny</option>
          <option value="professional">Professional</option>
          <option value="luxury">Luxury</option>
          <option value="casual">Casual</option>
        </select>
      </div>

      {/* Number of Taglines */}
      <div>
        <label className="block font-semibold mb-1">#️⃣ Number of Taglines</label>
        <input
          type="number"
          min="1"
          max="10"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300"
      >
        🚀 Generate Taglines
      </button>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-2 text-green-700">
            ✅ Generated Taglines:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            {suggestions.map((s, i) => (
              <li key={i} className="bg-gray-100 rounded p-2">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

export default TaglineForm;

