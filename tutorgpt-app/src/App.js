import React, { useState } from 'react';

function App() {
  const [question, setField1] = useState(''); // 'question' variable stores 'Question' text input field
  const [userUnderstanding, setField2] = useState(''); // 'userUnderstanding' variable stores 'What I Understand' text input field
  const [userConfusion, setField3] = useState(''); // 'userConfusion' stores 'What I'm Confused About' text input field

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form submission logic here
    console.log(`Field 1: ${question}, Field 2: ${userUnderstanding}, Field 3: ${userConfusion}`);

    // Clear the form fields
    setField1('');
    setField2('');
    setField3('');
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <input
            type="text"
            value={question}
            onChange={(e) => setField1(e.target.value)}
            style={{ width:"300px" }}
          />
        </label>

        <label>
          What I Understand:
          <input
            type="text"
            value={userUnderstanding}
            onChange={(e) => setField2(e.target.value)}
            style={{ width:"300px" }}
          />
        </label>

        <label>
          What I'm Confused About:
          <input
            type="text"
            value={userConfusion}
            onChange={(e) => setField3(e.target.value)}
            style={{ width:"300px" }}
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
