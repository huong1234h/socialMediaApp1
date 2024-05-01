import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";
import CurrentPost from "../../components/currentPost/CurrentPost";
import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update";
import { AuthContext } from "../../context/authContext";
import "./profile.scss";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "Đang tải..."
      ) : (
        <>
          <div className="images">
            <img src={"/upload/"+data.coverPic} alt="" className="cover" />
          </div>
          
          <div className="profileContainer">
            <div className="uInfo">
            <div className="profilePic">
              <img src={"/upload/"+data.profilePic} alt="" className="profilePic" />
            </div>
            
              <div className="center">
                <div className="userName">{data.name}
                <span className="location">Live in {data?.city}
                  </span></div>
                <div className="info">
                  <div className="item">
                    Theo dõi
                    <span>455</span>
                  </div>
                  <div className="item">
                    Đang theo dõi
                    <span>155</span>
                  </div>
                  <div className="item">
                    Bài viết
                    <span>64</span>
                  </div>
                </div>
                <div className="button-profile">
            {rIsLoading ? (
                  "Đang tải..."
                ) : userId === currentUser.id ? (
                  <>
                  <button className="update-btn" onClick={() => setOpenUpdate(true)}>Cập nhật</button>
                  <button className="create-story">Tạo tin</button>
                  </>
                ) : (
                  <>
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Đang theo dõi"
                      : "Theo dõi"}
                  </button>
                  <button className="chat">Nhắn tin</button>
                  </>
                )}
            </div>
              </div>
            </div>
            <CurrentPost/>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
