import { format } from 'timeago.js';
import "./message.scss";

const Message = ({own,m}) => {


  return (
    <div className="message">
    {own?
    <div className="own">
      <div className="content-message">
        {m.contentMessage}
      </div>
      <div className="time">
        {format(m.createAt)}
      </div>
    </div>
    :
    <div className="you">
      <div className="image">
        <img src="/upload/image.png"alt=""/>
      </div>
      <div className="content-message">
        {m.contentMessage}
      </div>
      <div className="time">
        {format(m.createAt)}
      </div>
    </div>}
    </div>
  );
};

export default Message;
