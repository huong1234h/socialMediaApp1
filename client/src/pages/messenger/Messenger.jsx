import { UilMessage, UilSmileBeam, UilTrash, UilUser } from '@iconscout/react-unicons';
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import axios from "axios";
import Picker from 'emoji-picker-react';
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import { io } from "socket.io-client";
import Conversation from "../../components/conversation/Conversation.jsx";
import Message from "../../components/message/Message.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import { AuthContext } from "../../context/authContext.js";
import { DarkModeContext } from "../../context/darkModeContext";
import "./messenger.scss";

const Messenger = () => {
  const { currentUser } = useContext(AuthContext);
  //_____/messenger/:userId/conversationId
  
  
  
  const location = useLocation();
  
  
  console.log("requestedChat",location.state?.requestedChat[0]);
  const { darkMode } = useContext(DarkModeContext);
  // console.log("requestedChat : ",requestedChat[0].id);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(location.state?.requestedChat[0]===undefined ? null : location.state?.requestedChat[0]);
  const [ listMessage, setListMessage] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState([]) ;
  const [message, setMessage] = useState("");
  const [activeChatBox,setActiveChatBox] = useState(false);
  const [showPicker,setShowPicker] = useState(false);
  const [showOption,setShowOption] = useState(false);
  const socket = useRef();
  const scrollRef = useRef();
  

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const onEmojiClick = (emojiObject,event)=>{
    setMessage((prevMessage => prevMessage + emojiObject.emoji));
    setShowPicker(false);
  }

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
    console.log("arrivalMessage",arrivalMessage);
    arrivalMessage &&
      (currentChat?.attendant1 === arrivalMessage.senderId ||
        currentChat?.attendant2 === arrivalMessage.senderId) &&
      setListMessage((prev) => [...prev, arrivalMessage]);
      
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser?.id);
    socket.current.on("getUsers",(users)=>{
      setOnlineUsers(users);
    });
  }, [currentUser]);

  console.log(onlineUsers);
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
      } catch (err) {

      }
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
  const checkOnlineUser = (receiverId)=>{
    return onlineUsers?.some((u)=>u.userId === receiverId);
  }
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [listMessage]);

  console.log(listMessage);
  console.log(message);

  const displayChatBox = ()=>{
    
    setActiveChatBox(!activeChatBox);
  }

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <Navbar />
      <div className="messenger">
        <div className={`chatMenuC`}>
          <div className="name">Đoạn Chat</div>
          <input placeholder="Search for friends" className="chatMenuInput" />
          <div className="listConversations">
            {conversations.map((c, index) => {
              return (
                <div onClick={() => setCurrentChat(c)} key={index}>
                  <Conversation c={c} userId={currentUser?.id} displayChatBox={displayChatBox} onlineUsers={onlineUsers}/>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`chatBox`}>
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
                          : `${receiver?.profilePic}`
                      } 
                      alt=""
                    />
                    {checkOnlineUser(receiver?.id) && <span>h</span>}
                  </div>
                  <div className="name_user">
                    {receiver?.name}
                    <br></br>
                    {checkOnlineUser(receiver?.id) && <span>Active now</span>}
                  </div>
                </div>
                <div className="toggle" onClick={()=>{setShowOption(!showOption)}}>
                  <MoreHorizSharpIcon />
                </div>
                {showOption && <div className="option">
                  <div className='item accessProfile'><UilUser/> Trang cá nhân</div>
                  <hr></hr>
                  <div className="item deleteConversation"><UilTrash/>Xóa đoạn chat</div>
                </div>}
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
                <div className="emoji" onClick={()=>{setShowPicker(!showPicker)}}><UilSmileBeam/></div>
                <div className='inputMessage'><input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              placeholder="Aa"
            /></div>
            <div className="buttonSend"><button type="submit" onClick={handleSendMessage}>
              Send <span><UilMessage/></span>
            </button></div>
            {showPicker && <div className='picker_container'><Picker
        pickerStyle={{ width: '120%' }}
        onEmojiClick={onEmojiClick} /> </div>}
          </div>
            </>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default Messenger;
