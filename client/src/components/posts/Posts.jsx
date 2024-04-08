import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";

const Posts = ({userId}) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId="+userId).then((res) => {
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
        : data.map((post,index) => <Post post={post} key={index} />)}
    </div>
  );
};

export default Posts;
