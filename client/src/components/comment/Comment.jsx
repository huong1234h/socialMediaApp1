import {
  UilCheck,
  UilCornerUpLeftAlt,
  UilEdit,
  UilHeart,
  UilTrash,
} from "@iconscout/react-unicons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useContext, useState } from "react";
import { makeRequest } from "../../axios"; // Assuming this is an Axios instance
import ButtonComment from "../buttonComment/ButtonComment";

import { AuthContext } from "../../context/authContext";
import ReplyComment from "../replyComment/ReplyComment";
import "./comment.scss";

const Comment = ({comment,index}) => {
  const [openReply, setOpenReply] = useState(false);
  const [openReplyInput, setOpenReplyInput] = useState(false);
  const [desc, setDesc] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const [update,setUpdate] = useState(false);
  const onEmojiClick = (emojiObject, event) => {
    setDesc((prevDesc) => prevDesc + emojiObject.emoji);
    setShowPicker(false); // Assuming setShowPicker exists for emoji picker
  };

  const { isLoading, error, data } = useQuery(
    // Unique query key
    [`replyComments-${comment.id}`],
    async () => {
      const response = await makeRequest.get(
        `/comments/reply?commentId=${comment.id}`
      );
      return response.data;
    },
    // Optional query options
    {
      enabled: comment.id !== undefined, // Fetch only if commentId is valid
      onError: (error) =>
        console.error("Error fetching reply comments:", error), // Handle errors
    }
  );

  

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newComment) => {
      const response = await makeRequest.post("/comments/reply", newComment);
      return response.data; // Return the created comment for potential use
    },
    {
      onSuccess: async () => {
        // Invalidate and refetch the comments query
        await queryClient.invalidateQueries([`replyComments-${comment.id}`]);
        console.log("data: ",data);
        // Conditional notification (consider error handling)
        if (currentUser?.id) {
          try {
            await makeRequest.post("/notifications/add", {
              senderId: currentUser?.id,
              receiverId: currentUser?.id,
              type: 2,
            });
          } catch (error) {
            console.error("Error sending notification:", error);
            // Consider displaying a user-friendly message here
          }
        }
      },
      onError: (error) => {
        console.error("Error creating comment:", error);
        // Consider displaying a user-friendly error message to the user
      },
    }
  );

  const updateMutation = useMutation(
    async (commentData) => {
      const response = await makeRequest.put("/comments/", commentData);
      return response.data; // Return the updated comment data
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([`replyComments-${comment.id}`],comment.id);
        console.log(data);
      },
    }
  );

  const deleteMutation = useMutation(
    (commentId)=>{
        return makeRequest.delete("/comments/" + commentId);
    },
    {
        onSuccess:async ()=>{
          console.log(comment.id);
            await queryClient.invalidateQueries([`replyComments-${comment.id}`],comment.id);
            console.log(data);
        }
    }
  )


  const handleDelete = async()=>{
    deleteMutation.mutate(comment.id);
}

  const handleClick = async (e) => {
    e.preventDefault();
    if (!desc) {
      // Handle empty comment gracefully (show alert, etc.)
      return;
    }
    await mutation.mutate({
      desc,
      postId: comment.postId,
      parentId: comment.id,
    }); // Fix: Provide postId
    setDesc("");
  };

  const handleUpdate = async(e)=>{
    e.preventDefault();
    await updateMutation.mutate({desc,commentId:comment.id});
    setUpdate(!update);
  }

  return (
    <>
    {error ? "error" : isLoading ? "Loading" :
    <div className="comment" key={index}>
      <div className="contentComment">
        <div className="title_comment">
          <div className="image">
            <img src={"/upload/" + comment.profilePic} />
          </div>
          <div className="name">{comment.name}</div>

          <div className="time">{moment(comment.createdAt).fromNow()}</div>
        </div>
        <div className="descriptionComment">{!update ? comment.desc : (<div className="formUpdate"><input type="text" className="updateInput" onChange={(e)=>{setDesc(e.target.value)}} value={desc === ""? comment.desc : desc} /> <button onClick={handleUpdate} className="updateBtn"><UilCheck/></button></div>)}</div>
      </div>
      <div className="toolComment">
        <div className="icon">
          <UilHeart />
          Thích
        </div>
        <div
          className="icon"
          onClick={() => {
            setOpenReplyInput(!openReplyInput);
          }}
        >
          <UilCornerUpLeftAlt />
          Phản hồi
        </div>
        {currentUser?.id === comment.userId ? (<div className="icon" onClick={()=>{setUpdate(!update)}}>
          <UilEdit />
          Chỉnh sửa
        </div>) : ""}
        {currentUser?.id === comment.userId ? (<div className="icon" onClick={handleDelete}>
          <UilTrash />
          Xóa
        </div>) : ""}
        
      </div>
      {openReplyInput && (
        <ButtonComment
          setDesc={setDesc}
          handleClick={handleClick}
          desc={desc}
          onShowPicker={()=>{setShowPicker(!showPicker)}}
          onEmojiClick={onEmojiClick}
          showPicker={showPicker}
        />
      )}
      {comment.reply_count > 0 && (
        <div className="replyBox">
          <div
            className="numberReply"
            onClick={() => {
              setOpenReply(!openReply);
            }}
          >
            {!openReply ? `Xem ${comment.reply_count} phản hồi` : "Rút gọn"}
          </div>
          {console.log("comment", comment.id)}
          {openReply && (error ? "Error" : isLoading ? "Loading" :
            <ReplyComment
              data={data}
            />
          )}
        </div>
      )}
      
    </div>}
    </>
  );
};

export default Comment;
