import React, { useState } from "react";
import "./App.css";

function App() {
  const [question, setField1] = useState(""); // 'question' variable stores 'Question' text input field
  const [userUnderstanding, setField2] = useState(""); // 'userUnderstanding' variable stores 'What I Understand' text input field
  const [userConfusion, setField3] = useState(""); // 'userConfusion' stores 'What I'm Confused About' text input field
  const [uploadedPdf, setUploadedPdf] = useState(null);

  const [loading, setLoading] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "TutorGPT",
      content: "Welcome to TutorGPT! What can I help you with?",
    },
  ]);
  const addMessageToChatHistory = (newMessage) => {
    setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("userUnderstanding", userUnderstanding);
      formData.append("userConfusion", userConfusion);
      formData.append("threadId", threadId);
      if (uploadedPdf) {
        formData.append("file", uploadedPdf);
      }
      addMessageToChatHistory({ role: "You", content: question });
      setLoading("Waiting for response...");

      const response = await fetch("/api/submit-form", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (data && data.response) {
        setThreadId(data.thread);
        setLoading("");
        addMessageToChatHistory({ role: "TutorGPT", content: data.response });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    // Clear the form fields
    setField1("");
    setField2("");
    setField3("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadedPdf(file);
  };

  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      {/* Top div */}
      <div style={{ padding: "20px", borderBottom: "1px solid #ccc" }}>
        {/* Add any content you want at the top of the page here */}
        <h1>Welcome to TutorGPT</h1>
        <p>
          (1) Upload a PDF with your class notes or lecture notes to get started
        </p>
        {/* File upload input */}
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        {uploadedPdf && <p>Uploaded PDF: {uploadedPdf.name}</p>}
      </div>
      {/* Bottom Div */}
      <div
        style={{
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        {/* Left side (form for user) */}
        <div style={{ width: "50%", padding: "20px" }}>
          <p>
            (2) Now, tell us what you need help with, what you understand so far,
            and what you are confused about.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-question">
              <label htmlFor="question">
                Question: <br></br>
                <textarea
                  type="text"
                  id="question"
                  value={question}
                  onChange={(e) => setField1(e.target.value)}
                  style={{ width: "100%", padding: "5px", height: "50px" }}
                />
              </label>
            </div>

            <div className="form-question">
              <label htmlFor="understanding">
                What I Understand: <br></br>
                <textarea
                  type="text"
                  id="understanding"
                  value={userUnderstanding}
                  onChange={(e) => setField2(e.target.value)}
                  style={{ width: "100%", padding: "5px", height: "50px" }}
                />
              </label>
            </div>

            <div className="form-question">
              <label htmlFor="confusion">
                What I'm Confused About: <br></br>
                <textarea
                  type="text"
                  id="confusion"
                  value={userConfusion}
                  onChange={(e) => setField3(e.target.value)}
                  style={{ width: "100%", padding: "5px", height: "50px" }}
                />
              </label>
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
        {/* Right side (model output) */}
        <div
          style={{
            width: "50%",
            padding: "20px",
            overflowY: "scroll",
            height: "400px",
          }}
        >
          <label htmlFor="model-log">TutorGPT Log:</label>
          <div
            id="modelLog"
            style={{
              width: "100%",
              padding: "5px",
              verticalAlign: "top",
              lineHeight: "1.5",
            }}
          >
            {chatHistory.map((message, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <strong>
                  {message.role === "TutorGPT" ? "TutorGPT: " : "You: "}
                </strong>
                {message.content}
              </div>
            ))}
            <div>{loading}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
