import { UilBrightness, UilMoon, UilSearch } from '@iconscout/react-unicons';
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import "./navbar.scss";
const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  return (
    <div className="navbar">
      <div className="left">
        <div className='menu'>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span>n10ltwnn07</span>
          </Link>
          {/* <UilEstate size="30"/> */}
          {darkMode ? (
            <UilMoon onClick={toggle}  size="30"/>
          ) : (
            <UilBrightness onClick={toggle}  size="30"/>
          )}
        </div>
      </div>
      <div className="search">
          <UilSearch size="30"/>
          <input type="text" placeholder="Search..." />
      </div>
      <div className="right">
        <div className="user">
          <button type='submit'>Create</button>
          <img
            src={"/upload/" + currentUser.profilePic}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
