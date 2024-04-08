import { UilImagePlus, UilLocationPinAlt, UilRainbow, UilTimes } from "@iconscout/react-unicons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { makeRequest } from "../../axios"; // Assuming makeRequest handles Axios calls
import { AuthContext } from "../../context/authContext";
import "./storyForm.scss";

const StoryForm = ({onHidden,setOpenForm,openForm}) => {
  const [story, setStory] = useState(null);
   // Use state for image URL
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      // Handle errors gracefully (e.g., display user-friendly message)
    }
  };
  const mutation = useMutation(
    (newStory) =>{ return makeRequest.post("/stories", newStory)},
    {
      onSuccess: () => queryClient.invalidateQueries(["stories"]),
    }
  );

  const handleClick = async (e) => {
    let storyUrl ;
    storyUrl = await upload(story);
    mutation.mutate({
      img: storyUrl, // Use the stored image URL
      // Add other story data here (e.g., location, music)
    });
    setStory(null);
    setOpenForm(!openForm);
  };
  

  return (
    <div className="storyForm">
      
      <div className="form">
      <div className="title">
        <div className="name">Tạo tin</div>
        <div className="exit" onClick={onHidden}><UilTimes size="30"/></div>
      </div>
        <div className="frame">
          {!story ? (
            <div className="add_img">No image for your story</div>
          ) : (
            <img className="file" src={URL.createObjectURL(story)} alt="" /> // Use imageUrl directly
          )}
        </div>
        <div className="data">
          <div className="item image_file">
          <input type="file" id="file" style={{display:"none"}} onChange={(e) => setStory(e.target.files[0])}/>
          
          <label htmlFor="file">
              <div className="item_second">
                <UilImagePlus size="30"/>
                <span>Thêm ảnh</span>
              </div>
            </label>
          </div>
          <div className="item location">
            <UilLocationPinAlt />
            <span>Thêm vị trí</span>
          </div>
          <div className="item music">
            <UilRainbow />
            <span>Thêm âm nhạc</span>
          </div>
        </div>
        <div className="create">
            <button onClick={handleClick}>Tạo tin</button>
        </div>
      </div>
      
    </div>
  );
};

export default StoryForm;
