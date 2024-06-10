import axios from 'axios';
import { useEffect, useState } from 'react';
import './conversation.scss';

const Conversation = function ({ c, userId, index ,displayChatBox,onlineUsers}) {
  // Determine receiver ID based on conversation participants
  const receiverId = c.attendant1 === userId ? c.attendant2 : c.attendant1;
  console.log(c);
  // State to manage receiver data
  const [receiver, setReceiver] = useState(null);
  const [online,setOnline] = useState(false);
  

  // Fetch receiver details using useEffect hook
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/users/find/${receiverId}`);
        setReceiver(response.data); // Assuming data is in response.data
      } catch (err) {
        console.error('Error fetching user data:', err); // Handle errors gracefully
      }
    };
    getUser();
  }, [receiverId]); // Dependency on receiverId for refetching

  useEffect(()=>{
    const checkOnline = ()=>{
      return onlineUsers?.some((u)=> u.userId === receiverId);
    }
    console.log(checkOnline);
    setOnline(checkOnline);
    
  },[onlineUsers]);

  // Render conversation information
  return (
    <div className='conversation' key={index} onClick={displayChatBox}>
      <div className='image'>
        <img
          src={
            receiver?.profilePic === null
              ? '/upload/image.png' // Placeholder for null receiver
              : `${receiver?.profilePic}` // Construct image path
          }
          alt=""
        />
        {online && <span>h</span>} {/* Placeholder for initials/avatar */}
      </div>
      <span>
        {receiver?.name || 'Unknown User'} {/* Handle potential undefined receiver name */}
        <br />
        <span className='newMess'>New message for you</span>
      </span>
    </div>
  );
};

export default Conversation;
