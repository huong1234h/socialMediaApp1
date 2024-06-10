import { UilBrightness, UilMoon, UilSearch } from '@iconscout/react-unicons';
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import "./navbar.scss";
const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [name,setName] = useState("");
  const navigate = useNavigate();
  console.log(currentUser);
  const handleSearch = (e)=>{
    e.preventDefault();
    navigate(`/search/${name}`);
    setName("");
  }

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
          <UilSearch size="30" onClick={handleSearch}/>
          <input type="text" placeholder="Search..." onChange={(e)=>{setName(e.target.value)}} value={name}/>
      </div>
     
      <div className="right">
        <div className="user">
          <button type='submit'>Create</button>
          <Link to={`/profile/${currentUser.id}`}>
          <img
            src={currentUser.profilePic}
            alt=""
          />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
