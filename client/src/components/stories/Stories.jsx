import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import StoryForm from "../storyForm/StoryForm";
import "./stories.scss";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [openForm,setOpenForm] = useState(false);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
      return res.data;
    })
  );

  //TODO Add story using react-query mutations and use upload function.

  return (
    <div>
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={()=>{setOpenForm(!openForm)}}>+</button>
      </div>
      {error
        ? "Lỗi tải thông tin!"
        : isLoading
        ? "Đang tải"
        : data.map((story) => (
            <div className="story" key={story.id}>
              <div className="profilePic">
                  <img src="/upload/image.png" alt=""/>
              </div>
              <img src={"/upload/"+story.img} alt="" />
              <span>{story.name}</span>
            </div>
          ))}
    </div>
    {openForm && <StoryForm onHidden={()=>{setOpenForm(!openForm)}} setOpenForm={setOpenForm} openForm={openForm}/>}
    </div>
  );
};

export default Stories;
