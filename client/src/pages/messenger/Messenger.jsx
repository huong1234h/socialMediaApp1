import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Conversation from "../../components/conversation/Conversation.jsx";
import Message from "../../components/message/Message.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import { AuthContext } from "../../context/authContext.js";
import { DarkModeContext } from "../../context/darkModeContext";
import "./messenger.scss";

const Messenger = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [listMessage, setListMessage] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const socket = useRef();
  const scrollRef = useRef();

  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_URL);

    socket.current.on("getMessage", (data) => {
      console.log(data); // Log received data
      setArrivalMessage({
        senderId: data.senderId || currentUser?.id, // Use senderId from data or fallback to currentUser
        receiveUserId: data.receiveUserId,
        contentMessage: data.contentMessage,
        zoomId: data.zoomId,
        createAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      (currentChat?.attendant1 === arrivalMessage.senderId ||
        currentChat?.attendant2 === arrivalMessage.senderId) &&
      setListMessage((prev) => [...prev, arrivalMessage]);
      
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser?.id);
  }, [currentUser]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_URL + `conversations/${currentUser.id}`
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser.id]);

  useEffect(() => {
    const getReceiver = async () => {
      try {
        let receiverId =
          currentChat.attendant1 === currentUser?.id
            ? currentChat?.attendant2
            : currentChat?.attendant1;
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL +"users/find/" + receiverId
        );
        setReceiver(response.data);
      } catch (err) {}
    };
    getReceiver();
  }, [currentChat?.id]);

  // console.log(conversations);
  console.log(currentChat?.id);
  useEffect(() => {
    const getChatBox = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL +`messages/${currentChat?.id}`
        );
        setListMessage(response.data);
      } catch (err) {}
    };
    getChatBox();
  }, [currentChat?.id]);
  console.log(arrivalMessage);

  const handleSendMessage = async () => {
    const sendedData = {
      sendUserId: currentUser?.id,
      receiveUserId: receiver?.id,
      contentMessage: message,
      zoomId: currentChat?.id,
    };

    socket.current.emit("sendMessage", {
      sendUserId: currentUser?.id,
      receiveUserId: receiver?.id,
      contentMessage: message,
      zoomId: currentChat?.id,
    });

    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL +`messages/`, sendedData);
      setListMessage([...listMessage, sendedData]);
      setMessage("");
    } catch (err) {
      console.log(err.response.data);
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [listMessage]);

  console.log(listMessage);
  console.log(message);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <Navbar />
      <div className="messenger">
        <div className="chatMenuC">
          <div className="name">Đoạn Chat</div>
          <input placeholder="Search for friends" className="chatMenuInput" />
          <div className="listConversations">
            {conversations.map((c, index) => {
              return (
                <div onClick={() => setCurrentChat(c)} key={index}>
                  <Conversation c={c} userId={currentUser?.id} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="chatBox">
          {currentChat === null ? (
            <div className="noChatBox">No Conversation</div>
          ) : (
            <>
              <div className="chatMenu">
                <div className="infoReceiver">
                  <div className="image">
                    <img
                      src={
                        receiver?.profilePic === null
                          ? "/upload/image.png"
                          : `/upload/${receiver?.profilePic}`
                      } 
                      alt=""
                    />
                    <span>h</span>
                  </div>
                  <div className="name_user">
                    {receiver?.name}
                    <br></br>
                    <span>Active now</span>
                  </div>
                </div>
                <div className="toggle">
                  <MoreHorizSharpIcon />
                </div>
              </div>
              
              <div className="chatWrapper" >
                
                {listMessage.map((m, index) => {
                  return (
                    <div ref={scrollRef}>
                    <Message
                      own={currentUser?.id === m?.sendUserId}
                      m={m}
                      key={index}
                    />
                    </div>
                  );
                })}
                
              </div>
              <div className="chatBottom">
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              placeholder="Aa"
            />
            <button type="submit" onClick={handleSendMessage}>
              Send
            </button>
          </div>
            </>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default Messenger;
