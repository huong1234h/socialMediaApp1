import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";

const Posts = ({userId}) => {
  
  const postsUserId = parseInt(useLocation().pathname.split("/")[2]);
  console.log(postsUserId);
  const { isLoading, error, data } = useQuery(["posts",userId], () =>
    makeRequest.get("/posts?userId="+userId ).then((res) => {
      console.log("userId",userId);
      return res.data;
    })
  );


  console.log(data);
  return (
    <div className="posts">
      {error
        ? "Lỗi tải trang!"
        : isLoading
        ? "Đang tải..."
        : data?.map((post,index) => <Post post={post} key={index} />)}
    </div>
  );
};

export default Posts;
