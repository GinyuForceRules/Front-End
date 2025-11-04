import React, { useState } from "react";

function Welcome() {
  return <h1>Welcome to React!</h1>;
}

function UserCard({ name }) {
  return (
    <div>
      <h2>User: {name}</h2>
    </div>
  );
}

function Button({ text }) {
  return <button>{text}</button>;
}

function ProductInfo({ name, price }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Price: ${price}</p>
    </div>
  );
}

function StudentList({ students }) {
  return (
    <ul>
      {students.map((student, index) => (
        <li key={index}>{student}</li>
      ))}
    </ul>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

function TextInput() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p>Current Input: {text}</p>
    </div>
  );
}

export default function App() {
  const students = ["Alice", "Bob", "Charlie"];

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <Welcome />
      <UserCard name="John Doe" />
      <Button text="Click Me" />

      <hr />

      <ProductInfo name="Laptop" price={999} />
      <StudentList students={students} />

      <hr />

      <Counter />
      <TextInput />
    </div>
  );
}
