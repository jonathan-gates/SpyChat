import { useState, useEffect, useRef } from "react";
import "./App.css";
import twoSpies from "./assets/twospies.png";
import manySpies from "./assets/manyspies.png";

function App() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const messagesScrollDiv = useRef(null);

  useEffect(() => {
    if (messagesScrollDiv?.current !== null) {
      messagesScrollDiv.current.scrollTop = messagesScrollDiv.current.scrollHeight;
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

  const inputStyle = {
    width: '50%', // Adjust the width as needed
    height: '100%', // Adjust the height as needed
    backgroundImage: `url(${twoSpies})`,
    backgroundSize: 'cover', // This ensures the image covers the entire div
    backgroundPosition: 'center', // This centers the image in the div
  };

  const chatroomStyle = {
    width: '50%', // Adjust the width as needed
    height: '100%', // Adjust the height as needed
    backgroundImage: `url(${manySpies})`,
    backgroundSize: 'cover', // This ensures the image covers the entire div
    backgroundPosition: 'center', // This centers the image in the div
  };

  return (
    <>
      <div className="card">
        <div className="input-div" style={inputStyle}>
          <div className="input-password-div">
            <label className="input-label">Password:</label>

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
          <label className="input-label">Message:</label>
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
        <div className="chatroom-div" style={chatroomStyle}>
          <h1 className="chatroom-h1">Chat Room</h1>
          <div
            className="messages-div"
            ref={messagesScrollDiv}
          >
            <ul className="messages-ul">
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
