import React, { useState } from 'react';
import './App.css'

function App() {
  const [question, setQuestion] = useState(' ');
  const [message1, setMessage1] = useState(' ');
  const [message2, setMessage2] = useState(' ');
  const [response, setResponse] = useState(' ');

  const handleSubmitQuestion = (e) => {
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })
    .then((res) => res.json())
    .then((data) => setResponse(data.question));
  };
  
  const handleSubmitMessage1 = (e) => {
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message1 }),
    })
    .then((res) => res.json())
    .then((data) => setResponse(data.message1));
  };

  const handleSubmitMessage2 = (e) => {
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message2 }),
    })
    .then((res) => res.json())
    .then((data) => setResponse(data.message2));
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmitQuestion}>
        <textarea value={question} 
        onChange={(e) => setQuestion(e.target.value)}>
        </textarea>
        <button type="submit">Submit</button>
      </form>
      <form onSubmit={handleSubmitMessage1}>
        <textarea value={message1} 
        onChange={(e) => setMessage1(e.target.value)}>
        </textarea>
        <button type="submit">Submit</button>
      </form>
      <form onSubmit={handleSubmitMessage2}>
        <textarea value={message2} 
        onChange={(e) => setMessage2(e.target.value)}>
        </textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default App;
