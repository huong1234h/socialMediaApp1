import {
  UilAngleLeft,
  UilAngleRight,
  UilEllipsisH,
  UilMultiply,
  UilTrash,
} from "@iconscout/react-unicons";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { AuthContext } from "../../context/authContext";
import "./detailStory.scss";

const DetailStory = ({ story, onHidden, nextStory, prevStory, handleDelete }) => {
  console.log(story);
  const [openOption, setOpenOption] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {currentUser} = useContext(AuthContext); // Track deletion state
  const navigate = useNavigate();

  const handleStoryDelete = async () => {
    setIsDeleting(true); // Set loading indicator
    try {
      await handleDelete(story?.id);
      onHidden();
    } catch (error) {
      console.error('Error deleting story:', error);
      // Handle deletion error (e.g., display error message)
    } finally {
      setIsDeleting(false); // Remove loading indicator
    }
  };

  return (
    <div className="detailStory">
      <div className="exit" onClick={onHidden}>
        <UilMultiply size="30" />
      </div>
      <div className="content">
        <div className="prev-story" onClick={prevStory}>
          <UilAngleLeft size="33" />
        </div>
        <div className="tab-story">
          <div className="name">
            <Link to={`/profile/${story?.userId}`}>
              <img src={story?.profilePic} />
            </Link>
            
            <span className="time"><span className="username">{story.name}</span><br></br>{format(story?.createdAt)}</span>
          </div>
          <div className="option">

            {story?.userId === currentUser?.id && <UilEllipsisH size="30" onClick={() => setOpenOption(!openOption)} />}
            {openOption && (
              <UilTrash size="30" disabled={isDeleting} onClick={handleStoryDelete}>
                {isDeleting && <span>Deleting...</span>}
              </UilTrash>
            )}
          </div>
        </div>
        <div className="image">
          <img src={story?.img} />
        </div>
        <div className="next-story" onClick={nextStory}>
          <UilAngleRight size="33" />
        </div>
      </div>
    </div>
  );
};

export default DetailStory;
