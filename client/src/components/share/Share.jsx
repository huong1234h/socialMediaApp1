import { UilImagePlus, UilLocationPoint, UilSpinner } from '@iconscout/react-unicons';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useContext, useState } from "react";
import { v4 } from 'uuid';
import { imageDb } from "../../Config";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./share.scss";

const Share = () => {
  const [img, setImg] = useState(null);
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const [loading,setLoading] = useState(false);

  const queryClient = useQueryClient();

  console.log(img);
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
  // useEffect(()=>{
  //   handleSendImg();
  // },[img]);
 
  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
        setLoading(false);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      let imgUrl = await handleSendImg();
      mutation.mutate({ desc, img: imgUrl });
      setDesc("");
      
      setImg(null);
      
    } catch (error) {
      console.error("Error creating post:", error);
      // Display an error message to the user
    }
    
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`Bạn đang nghĩ gì, ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {img && (
              <img className="file" alt="" src={URL.createObjectURL(img)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setImg(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <UilImagePlus size="30" />
                <span>Thêm ảnh</span>
              </div>
            </label>
            <div className="item">
              <UilLocationPoint size="30" />
              <span>Thêm vị trí</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>{!loading ? "Đăng" : <div className='loading'><UilSpinner/></div>}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;