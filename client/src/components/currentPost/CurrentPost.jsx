import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./currentPost.scss";

const CurrentPost = ({userId}) => {

  const { isLoading, error, data } = useQuery(["posts",userId], () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      return res.data;
    })
  );
  console.log(data);
  
  return (
    <div className="currentPost">
      <div className="titleBar">
        <div className="title">Ảnh</div>
        <div className="all_button">Xem tất cả</div>
      </div>
      <div className="boxImg">
        {data?.slice(0,9)?.map((post,index)=>{
            if(post.img){
                return (
                    <div className="image">
                        <img src={post.img} />
                    </div>
                );
            }
        })}
      </div>
    </div>
  );
};

export default CurrentPost;
