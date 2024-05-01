import Comment from "../comment/Comment";
import "./commentList.scss";

const CommentList = ({ comments }) => {
  console.log(comments);
  return (
    <div className="commentList">
      {comments.map((comment, index) => {
        return (
          <Comment
            comment={comment}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default CommentList;
