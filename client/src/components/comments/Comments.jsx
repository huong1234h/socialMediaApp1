import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import ButtonComment from "../buttonComment/ButtonComment";
import CommentList from "../commentList/CommentList";
import "./comments.scss";

const Comments = ({ postId, userId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [showPicker, setShowPicker] = useState(false);
  // Optimized query with destructuring
  const { isLoading, error, data } = useQuery(
    ["comments", postId], // Unique query key with postId
    async () => {
      const response = await makeRequest.get("/comments?postId=" + postId);
      return response.data;
    },
    {
      enabled: !!postId, // Fetch only if postId is valid
    }
  );
  const onEmojiClick = (emojiObject,event) => {
    setDesc(prevDesc => prevDesc + emojiObject.emoji);
    setShowPicker(false);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newComment) => {
      const response = await makeRequest.post("/comments", newComment);
      return response.data; // Return the created comment for potential use
    },
    {
      onSuccess: async (createdComment) => {
        // Invalidate and refetch the comments query
        queryClient.invalidateQueries(["comments", postId]);

        // Conditional notification (consider error handling)
        if (userId !== currentUser?.id) {
          try {
            await makeRequest.post("/notifications/add", {
              senderId: currentUser?.id,
              receiverId: userId,
              type: 2,
            });
          } catch (error) {
            console.error("Error sending notification:", error);
          }
        }
      },
      onError: (error) => {
        console.error("Error creating comment:", error);
        // Handle errors (display toast, retry, etc.)
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    if (!desc) {
      // Handle empty comment gracefully (show alert, etc.)
      return;
    }
    await mutation.mutate({ desc, postId});
    setDesc("");
  };

  

  return (
    <div className="comments">
      
      <ButtonComment setDesc={setDesc} handleClick={handleClick} desc={desc} onShowPicker={() => setShowPicker(val => !val)} onEmojiClick={onEmojiClick} showPicker={showPicker}/>
      {data && <CommentList comments={data}/>}
    </div>
  );
};

export default Comments;
