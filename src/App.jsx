import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef?.current !== null) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleButtonClick = () => {
    if (message === "") {
      return;
    }
    setMessages([...messages, message]);
    setMessage("");
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleButtonClick();
    }
  };

  return (
    <>
      <div className="card">
        <div className="input-div">
          <div className="input-password-div">
            <label style={{fontSize: '1.7em'}}>Password:</label>

            <br />

            <input
              type="text"
              className="text-box"
              value={password}
              onChange={handlePasswordChange}
              placeholder="password"
            />
          </div>

          <br />
          <br />

          <div className="input-message-div">
          <label style={{fontSize: '1.7em'}}>Message:</label>
          <br />
          <input
            type="text"
            className="text-box"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleInputKeyPress}
            placeholder="message"
          />
          </div>

          <br />
          <br />

          <button onClick={handleButtonClick} >Submit</button>
        </div>
        <div className="chatroom-div">
          <h1 style={{ marginTop: 0, textAlign: "center" }}>Chat Room</h1>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              maxHeight: "75%",
              minHeight: "75%",
            }}
            ref={containerRef}
          >
            <ul style={{ listStyleType: "none", textAlign: "center" }}>
              {messages.map((message, key) => (
                <li className="message-individual" key={key}>
                  {message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
