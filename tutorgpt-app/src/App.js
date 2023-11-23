import React, { useState } from 'react';
import './App.css'

function App() {
  const [message, setMessage] = useState(' ');
  const [response, setResponse] = useState(' ');

  const handleSubmitQuestion = (e) => {
    fetch('http://localhost:3000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
    .then((res) => res.json())
    .then((data) => setResponse(data.message));
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmitQuestion}>
        <textarea value={message} 
        onChange={(e) => setMessage(e.target.value)}>
        </textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default App;
