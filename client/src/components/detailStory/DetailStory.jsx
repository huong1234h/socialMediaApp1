import {
    UilAngleLeft,
    UilAngleRight,
    UilEllipsisH,
    UilMultiply,
} from "@iconscout/react-unicons";
import { format } from "timeago.js";
import "./detailStory.scss";

const DetailStory = (story, onHidden,nextStory,prevStory) => {
  console.log(story);
  return (
    <div className="detailStory">
      <div className="exit" onClick={story.onHidden}>
        <UilMultiply size="30" />
      </div>
      <div className="content">
        <div className="prev-story" onClick={story.prevStory}>
          <UilAngleLeft size="33"/>
        </div>
        <div className="tab-story">
         
          <div className="name">
            <img src={"/upload/" + story.story?.profilePic}></img>
            {story.story?.name}
            <span className="time">{format(story.story?.createdAt)}</span>
          </div>
          <div className="option"><UilEllipsisH size="30"/></div>
        </div>
        <div className="image">
          <img src={"/upload/" + story.story?.img} />
        </div>
        <div className="next-story" onClick={story?.nextStory}>
          <UilAngleRight size="33"/>
        </div>
      </div>
    </div>
  );
};
export default DetailStory;
