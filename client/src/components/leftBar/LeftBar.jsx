import { UilEstate } from '@iconscout/react-unicons';
//import NotificationsIcon from '@mui/icons-material/Notifications';
import { UilComment, UilSetting, UilSignout } from '@iconscout/react-unicons';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import "./leftBar.scss";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

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
        <div className="menu">
          
          <div className="item">
            <UilEstate size="30"/>
            <span>Home</span>
          </div>
          <div className="item">
            <NotificationsNoneIcon  sx={{ fontSize: 30 }}/>
            <span>Notification</span>
          </div>
          <div className="item">
            <UilComment size="30"/>
            <span>Messenger</span>
          </div>
          <div className="item">
            <UilSetting size="30"/>
            <span>Setting</span>
          </div>
          <div className="item">
            <UilSignout size="30"/>
            <span>Logout</span>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default LeftBar;
