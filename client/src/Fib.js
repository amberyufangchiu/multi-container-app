import React, { useState, useEffect } from "react";
import axios from "axios";

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  const fetchValues = async () => {
    const values = await axios.get("/api/values/current");
    setValues(values.data);
  };

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get("/api/values/all");
    setSeenIndexes(seenIndexes.data);
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!index.trim()) return;

    await axios.post("/api/values", { index });
    setIndex("");
    fetchValues();
    fetchIndexes();
  };

  const handleReset = async () => {
    await axios.delete("/api/values");
    setValues({});
    setSeenIndexes([]);
    setIndex("");
  };

  return (
    <div>
      <h1>Fibonacci Calculator</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          type="number"
          placeholder="Enter your index"
        />
        <button type="submit">Submit</button>
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </form>
      <div>
        <h3>Indexes I have seen:</h3>
        <p>
          {seenIndexes.length
            ? seenIndexes.map(({ number }) => number).join(", ")
            : "No indexes yet"}
        </p>
      </div>

      <div>
        <h3>Calculated Values:</h3>
        <div>
          {Object.entries(values).length ? (
            Object.entries(values).map(([key, value]) => (
              <div
                key={key}
                className="p-3 bg-gray-100 rounded-lg text-gray-800"
              >
                For index <span>{key}</span> I calculated <span>{value}</span>
              </div>
            ))
          ) : (
            <p>No calculations yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fib;
