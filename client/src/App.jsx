import { useState, useEffect, useRef } from "react";
import "./App.css";
import twoSpies from "./assets/twospies.png";
import manySpies from "./assets/manyspies.png";
import { io } from "socket.io-client";
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const messagesScrollDiv = useRef(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null) return;
    socket.on("receive_message", (message) => {
      setMessages( currentMessages => [...currentMessages, message]);
    });
  }, [socket]);

  useEffect(() => {
    if (messagesScrollDiv?.current !== null) {
      messagesScrollDiv.current.scrollTop =
        messagesScrollDiv.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyChange = (e) => {
    setKey(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleButtonClick = () => {
    if (message === "") {
      return;
    }
    // setMessages([...messages, message]);
    const encryptedMessage = CryptoJS.AES.encrypt(message, key).toString();
    const encryptedKey = CryptoJS.AES.encrypt(key, key).toString();
    socket.emit("send_message", {message: encryptedMessage, key: encryptedKey});
    setMessage("");
  };

  const handleMessageClicked = (message) => {
    decryptMessage(message, key);
  }

  const decryptMessage = (message, chosenKey) => {
    const decrypted = CryptoJS.AES.decrypt(message?.message, chosenKey).toString(CryptoJS.enc.Utf8);
    if (decrypted === "") {
      toast.error("Incorrect Key", {autoClose: 3000, theme: "dark"});
    } else {
      // find this message in the messages array and change it to decrypted
      const newMessages = messages.map( (msg) => {
        if (JSON.stringify(msg) === JSON.stringify(message)) {
          return {...msg, message: decrypted, decrypted: true};
        }
        return msg;
      });
      setMessages(newMessages);
    }
    // toast.dark(decrypted.toString(), {autoClose: 3000});
    
  }

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      handleButtonClick();
    }
  };

  const inputStyle = {
    width: "50%", // Adjust the width as needed
    height: "100%", // Adjust the height as needed
    backgroundImage: `url(${twoSpies})`,
    backgroundSize: "cover", // This ensures the image covers the entire div
    backgroundPosition: "center", // This centers the image in the div
  };

  const chatroomStyle = {
    width: "50%", // Adjust the width as needed
    height: "100%", // Adjust the height as needed
    backgroundImage: `url(${manySpies})`,
    backgroundSize: "cover", // This ensures the image covers the entire div
    backgroundPosition: "center", // This centers the image in the div
  };

  return (
    <>
        <ToastContainer />
      <div className="blurred-middle-line"> </div>
      <div className="blurred-line top"> </div>
      <div className="blurred-line bottom"> </div>
      <div className="blurred-line left"> </div>
      <div className="blurred-line right"> </div>

      <div className="card">
        <div className="input-div" style={inputStyle}>
          <div className="input-key-div">
            <label className="input-label">Key:</label>

            <br />

            <input
              type="text"
              className="text-box"
              value={key}
              onChange={handleKeyChange}
              placeholder="key"
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

          <button onClick={handleButtonClick}>Submit</button>
        </div>
        <div className="chatroom-div" style={chatroomStyle}>
          <h1 className="chatroom-h1">Chat Room</h1>
          <div className="messages-div" ref={messagesScrollDiv}>
            <ul className="messages-ul">
              {messages.map((message, key) => {
                return (
                  <li className="message-individual" onClick={!message?.decrypted ? () => handleMessageClicked(message) : null} key={key}>
                    {message?.message}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
