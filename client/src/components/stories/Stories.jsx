import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./stories.scss";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
      return res.data;
    })
  );

  const addStoryMutation = useMutation((newStory) =>
    makeRequest.post("/stories", newStory)
  );

  const handleAddStory = () => {
    const newStory = {
      // Add necessary properties for the new story
    };
    addStoryMutation.mutate(newStory);
  };

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={handleAddStory}>+</button>
      </div>
      {error ? (
        "Lỗi tải thông tin!"
      ) : isLoading ? (
        "Đang tải"
      ) : (
        data.map((story) => (
          <div className="story" key={story.id}>
            <img src={story.img} alt="" />
            <span>{story.name}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Stories;