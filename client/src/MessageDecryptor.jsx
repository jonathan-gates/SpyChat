import React, { useState } from "react";
import Popup from "reactjs-popup";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const MessageDecryptor = ({ messages, setMessages, passKey, socket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  const setNewMessages = (message, decrypted) => {
    // find this message in the messages array and change it to decrypted
    const newMessages = messages.map((msg) => {
        if (JSON.stringify(msg) === JSON.stringify(message)) {
          return { ...msg, message: decrypted, decrypted: true };
        }
        return msg;
      });
      setMessages(newMessages);
  }

  const handleClosePopup = () => {
    setIsOpen(false);
    setInputValue("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleMessageClicked = (message) => {
    // check if owner message and can be decrypted automatically
    if (socket.id === message?.id) {
      const decrypted = CryptoJS.AES.decrypt(
        message?.message,
        passKey
      ).toString(CryptoJS.enc.Utf8);
      if (decrypted !== "") {
        setNewMessages(message, decrypted);
        return;
      }
    }
    // otherwise open to get key
    setCurrentMessage(message);
    setIsOpen(true);
  };

  const decryptMessage = (message, chosenKey) => {
    handleClosePopup();

    const decrypted = CryptoJS.AES.decrypt(
      message?.message,
      chosenKey
    ).toString(CryptoJS.enc.Utf8);
    if (decrypted === "") {
      toast.error("Incorrect Key", { autoClose: 3000, theme: "dark" });
    } else {
      setNewMessages(message, decrypted);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
        decryptMessage(currentMessage, inputValue)
    }
  };

  const getMessageClass = (message) => {
    let name = "";
    if (message?.decrypted) {
        name = "message-individual";
    } else {
        name = "message-individual-clickable";
    }
    if (socket.id === message?.id) {
        console.log("first")
        name += " message-own";
    }
    return name;
  }

  return (
    <>
      <ul className="messages-ul">
        {messages.map((message, index) => {
          return (
            <li
              className={getMessageClass(message)}
              onClick={
                !message?.decrypted ? () => handleMessageClicked(message) : null
              }
              key={index}
            >
              {message?.message}
            </li>
          );
        })}
      </ul>

      <Popup open={isOpen} modal nested>
        {() => (
          <div className="modal dark-popup">
            <button onClick={handleClosePopup}>&times;</button>
            <br />
            <br />

            <div className="content">
              {currentMessage?.message}
            </div>
            <br />
            <input
              className="text-box"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="key"
              onKeyDown={handleInputKeyPress}
            />
            <br />
            <br />
            <button onClick={() => decryptMessage(currentMessage, inputValue)}>Decrypt</button>
          </div>
        )}
      </Popup>
    </>
  );
};

export default MessageDecryptor;
