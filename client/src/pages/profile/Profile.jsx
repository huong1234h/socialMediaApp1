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
  console.log("profileUserId: ",userId);
  const { isLoading, error, data: userData } = useQuery(["user"], () =>
    makeRequest.get("/users/find/" + userId).then((res) => res.data)
  );

  const { isLoading: userPostsLoading, error: userPostsError, data: userPostsData } = useQuery(
    ["userPosts"],
    () => makeRequest.get(`/posts/${currentUser?.id}`).then((res) => res.data)
  );



  const { isLoading: isRelationshipLoading, error: relationshipError, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => res.data)
  );

  const { isLoading: isNRelationshipLoading, error: nRelationshipError, data: nRelationshipData } = useQuery(
    ["nRelationship"],
    () =>
      makeRequest.get(`/relationships/numberFd/${currentUser?.id}`).then((res) => res.data)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) =>
      following
        ? makeRequest.delete("/relationships?userId=" + userId)
        : makeRequest.post("/relationships", { userId }),
    {
      onSuccess: () => {
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
            <img src={userData.coverPic} alt="" className="cover" />
          </div>

          <div className="profileContainer">
            <div className="uInfo">
              <div className="profilePic">
                <img src={userData.profilePic} alt="" className="profilePic" />
              </div>

              <div className="center">
                <div className="userName">{userData.name}
                  <span className="location">Live in {userData?.city}</span>
                </div>
                <div className="info">
                  <div className="item">
                    Theo dõi
                    <span>{relationshipData?.length}</span>
                  </div>
                  <div className="item">
                    Đang theo dõi
                    <span>{nRelationshipData?.length}</span>
                  </div>
                  <div className="item">
                    Bài viết
                    <span>
                      {userPostsLoading ? (
                        "..."
                      ) : userPostsError ? (
                        "Error Loading"
                      ) : userPostsData ? (
                        userPostsData?.length // Assuming 'length' property holds number of posts
                      ) : (
                        "No posts yet"
                      )}
                    </span>
                  </div>
                </div>
                <div className="button-profile">
                  {isRelationshipLoading ? (
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

            <CurrentPost userId={userId}/>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={userData} />}
    </div>
  );
};

export default Profile;
