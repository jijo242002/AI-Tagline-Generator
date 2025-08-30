import React from "react";

function HistoryList({ history = [] }) {
  if (!history.length) {
    return <p className="p-4 text-gray-500">No history yet</p>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded shadow mt-4">
      <h3 className="font-bold mb-2">History</h3>
      <ul className="list-disc pl-6">
        {history.map((item, index) => (
          <li key={index}>
            {item.product} → {item.tagline}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryList;

