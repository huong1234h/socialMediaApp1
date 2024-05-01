import Comment from "../comment/Comment";
import "./replyComment.scss";

const ReplyComment = ({ data }) => {
  
  
  return (
    <div className="replyComment">
        {data.map((comment, index) => {
          return (
            <Comment
              key={index}
              comment={comment}
              
            />
          );
        })} 
    </div>
  );
};

export default ReplyComment;
