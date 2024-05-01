import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import io from "socket.io-client";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import BtnFollow from "../btnFollow/BtnFollow";
import RecommendUser from "../recommendUser/RecommendUser";
import "./rightBar.scss";

const socket = io("http://localhost:8900");

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recommendUser, setRecommendUser] = useState(false);
  const [createdConversation,setCreatedConversation] = useState(false);
  const userId = currentUser.id;
  const { isLoading, error, data } = useQuery(["users"], () =>
    makeRequest.get(`/users/${userId}`).then((res) => {
      return res.data;
    })
  );

  useEffect(() => {
    socket.emit("addUser", currentUser?.id);
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [currentUser]);
  console.log(onlineUsers);

  const {
    isLoading: relationshipsLoading,
    error: relationshipsError,
    data: relationships,
  } = useQuery(["relationships"], () =>
    makeRequest.get(`/users/friends?userId=${userId}`).then((res) => res.data)
  );

  const checkOnlineUser = (friendId) => {
    return onlineUsers?.some((u) => u.userId === friendId);
  };

  const handleAccessChat = async (userId) => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND_URL + `conversations/add`,{
        att1Id:currentUser?.id,
        att2Id : userId,
      });
      setCreatedConversation(true);
    } catch (err) {
      setCreatedConversation(false);
    }
  };

  console.log("relationships", relationships);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <div className="recommendTab">
            <div className="title">Gợi ý</div>
            <div
              className="all"
              onClick={() => {
                setRecommendUser(!recommendUser);
              }}
            >
              Xem tất cả
            </div>
          </div>
          {error
            ? "Lỗi tải thông tin!"
            : isLoading
            ? "Đang tải"
            : data.slice(0, 2).map((user, index) => (
                <div className="user user-recommend" key={index} >
                  <div className="userInfo">
                    <img src={"/upload/image.png"} alt="" />
                  </div>
                  <div className="name">{user.name}</div>
                  <div className="buttons">
                    <BtnFollow userId={user.id} />
                  </div>
                </div>
              ))}
        </div>

        <div className="item">
          <span>Đang hoạt động</span>
          {relationships?.map((relationship, index) => {
            return (
              <div className="user" key={index} onClick={()=>{handleAccessChat(relationship.userId);}}>
                <div className="userInfo">
                  <img
                    src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                    alt=""
                  />
                  {checkOnlineUser(relationship.userId) && (
                    <div className="online" />
                  )}
                  <span>{relationship.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {recommendUser && data && (
        <RecommendUser
          data={data}
          onHidden={() => {
            setRecommendUser(!recommendUser);
          }}
        />
      )}
      {createdConversation && <Navigate to="/messenger" replace={true}/>}
    </div>
  );
};

export default RightBar;
