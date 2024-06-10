import { UilImagePlus, UilLocationPinAlt, UilRainbow, UilSpinnerAlt, UilTimes } from "@iconscout/react-unicons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";
import { v4 } from "uuid";
import { imageDb } from "../../Config";
import { makeRequest } from "../../axios"; // Assuming makeRequest handles Axios calls
import { AuthContext } from "../../context/authContext";
import "./storyForm.scss";

const StoryForm = ({onHidden,setOpenForm,openForm}) => {
  const [img, setImg] = useState(null);
   // Use state for image URL
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [loading,setLoading] = useState(false);

 
  const handleSendImg = async () => {
    try {
      if (img !== null) {
        const imgRef = ref(imageDb, `files/${v4()}`);
        await uploadBytes(imgRef, img);
        const url = await getDownloadURL(imgRef);
        console.log("link" , url);
        return url;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Display an error message to the user
    }
  };
  

  const mutation = useMutation(
    (newStory) =>{ return makeRequest.post("/stories", newStory)},
    {
      
      onSuccess: () => {setLoading(false);
        queryClient.invalidateQueries(["stories"])},
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      let imgUrl = await handleSendImg();
      mutation.mutate({
        img: imgUrl, // Use the stored image URL
        // Add other story data here (e.g., location, music)
      });
      setImg(null);
      setOpenForm(!openForm);
    }
    catch(err){

    }
  
  };
  

  return (
    <div className="storyForm">
      
      <div className="form">
      <div className="title">
        <div className="name">Tạo tin</div>
        <div className="exit" onClick={onHidden}><UilTimes size="30"/></div>
      </div>
        <div className="frame">
          {!img ? (
            <div className="add_img">No image for your story</div>
          ) : (
            <img className="file" src={URL.createObjectURL(img)} alt="" /> // Use imageUrl directly
          )}
        </div>
        <div className="data">
          <div className="item image_file">
          <input type="file" id="file" style={{display:"none"}} onChange={(e) => setImg(e.target.files[0])}/>
          
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
            <button onClick={handleClick}>{loading ? <div><UilSpinnerAlt/></div>:"Tạo tin"}</button>
        </div>
      </div>
      
    </div>
  );
};

export default StoryForm;
