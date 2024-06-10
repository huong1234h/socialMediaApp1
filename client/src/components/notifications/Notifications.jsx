import { UilTimesCircle } from "@iconscout/react-unicons";
import { useQuery } from "@tanstack/react-query";
import moment from 'moment';
import { makeRequest } from "../../axios";
import "./notifications.scss";
const Notifications = ({ userId, onHidden }) => {
  const { isLoading, error, data } = useQuery(["notifications", userId], () =>
    makeRequest.get("/notifications/" + userId).then((res) => res.data)
  );

  console.log(data);
  

  return (
    <div className="notification">
      <div className="title">
        <div className="title_name">Notification</div>
        <div className="exit" onClick={onHidden}>
          <UilTimesCircle onClick={onHidden} size="30"/>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading notifications...</div>
      ) : error ? (
        <div className="error">Error fetching notifications: {error.message}</div>
      ) : data?.length > 0 ? (
        data.map((notification, index) => (
          <div className="item" key={notification.id || index}> {/* Use notification.id if available */}
            <div className="image">
              <img src="/upload/image.png" alt="" /> {/* Replace with dynamic image fetching if needed */}
            </div>
            <div className="name">
              {notification.name} 
              <span>
                {notification.type === 1 && "liked" ||
                  notification.type === 2 && "commented" ||
                  notification.type === 3 && "followed"} your post
              </span>
              <div className="title_post">
                
                
              </div>
              <span className="time">{moment(notification.createAt).fromNow()}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="empty">No notifications yet.</div>
      )}
    </div>
  );
};

export default Notifications;
