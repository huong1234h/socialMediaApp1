import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./currentPost.scss";

const CurrentPost = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId=" + currentUser?.id).then((res) => {
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
        {data?.map((post,index)=>{
            if(post.img){
                return (
                    <div className="image">
                        <img src={"/upload/" + post.img} />
                    </div>
                );
            }
        })}
      </div>
    </div>
  );
};

export default CurrentPost;
