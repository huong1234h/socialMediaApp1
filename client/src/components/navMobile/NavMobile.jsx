import { UilComment, UilEstate } from '@iconscout/react-unicons';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import Notifications from '../notifications/Notifications';
import './navMobile.scss';
const NavMobile = ()=>{
    const [notification,setNotification] = useState(false);
    const {currentUser} = useContext(AuthContext);
    const displayNotification = ()=>{
        setNotification(!notification);
    }
    const handleHiddenNotification = ()=>{
        console.log("hhhhhhhhhhhhhhhh");
        setNotification(!notification);
    }
    return (
        <>
        <div className='navMobile'>
            <Link to=''>
                <div className='item'>
                    <UilEstate size="30"/>
                </div>
            </Link>
            <Link to=''>
                <div className='item'>
                    <UilComment size="30"/>
                </div>
            </Link>
            <Link to=''>
                <div className='item' onClick={displayNotification}>
                    <NotificationsNoneIcon  sx={{ fontSize:30 }}/>
                </div>
            </Link>
            <Link to=''>
                <div className='item'>
                    <img src='/upload/image.png' alt=''/>
                </div>
            </Link>
        </div>
        {notification && <Notifications userId={currentUser?.id} onHidden={handleHiddenNotification}/>}
        </>
    );
}

export default NavMobile;