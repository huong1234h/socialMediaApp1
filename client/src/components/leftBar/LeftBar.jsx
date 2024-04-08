import { UilEstate } from '@iconscout/react-unicons';
//import NotificationsIcon from '@mui/icons-material/Notifications';
import { UilComment, UilSetting, UilSignout } from '@iconscout/react-unicons';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import axios from 'axios';
import { useContext, useState } from "react";
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from "../../context/authContext";
import Notifications from "../notifications/Notifications.jsx";
import "./leftBar.scss";

const LeftBar = () => {
  const [notification,setNotification] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [logout,setLogout] = useState(false);
  

  const handleOnNotification = ()=>{
    setNotification(!notification);
  }

  const handleHiddenNotification = ()=>{
    console.log("hhhhhhhhhhhhhhhh");
    setNotification(!notification);
  }
  const handleLogout = async () => {
    try {
      // Send a request to your backend API endpoint for logout
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL+"auth/logout", null, { // Replace with your actual logout endpoint
        withCredentials: true, // Include cookies in the request
      });
  
      if (response.status === 200) {
        setLogout(!logout);
        // Logout successful, clear any user data and redirect or reload
        console.log("Logout successful!");
        // Clear user context or local storage
        // Redirect or reload the page
      } else {
        console.error("Error logging out:", response.data);
        // Handle logout error (optional: display a message to the user)
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle logout error (optional: display a message to the user)
    }
  };
  
  console.log(notification);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
        <div className="user">
            <img
              src={"/upload/" +currentUser.profilePic}
              alt=""
            />
            <span className="nUser">{currentUser.name}
            <br/>
            <span className="wUser">huongka233.com</span>
            </span>
            
          </div>
        </div>
        {notification === true ? <Notifications userId={currentUser?.id} onHidden={handleHiddenNotification} /> : (<div className="menu">
          <Link to='/' style={{textDecoration:'none'}}>
          <div className="item">
            <UilEstate size="30"/>
            <span>Home</span>
          </div>
          </Link>
          <div className="item" onClick={handleOnNotification}>
            <NotificationsNoneIcon  sx={{ fontSize: 30 }}/>
            <span className='numerous'>12</span>
            <span>Notification</span>
            
          </div>
          <Link to="/messenger" style={{textDecoration:'none' }}>
          <div className="item">
            <UilComment size="30"/>
            <span className='numerous'>12</span>
            <span>Messenger</span>
          </div>
          </Link>
          <div className="item">
            <UilSetting size="30"/>
            <span>Setting</span>
          </div>
          <div className="item" onClick={handleLogout}>
            <UilSignout size="30"/>
            <span>Logout</span>
          </div>
        </div>)}
        {logout && <Navigate to="/login" replace={true} />} 
      </div>
    </div>
  );
};

export default LeftBar;
