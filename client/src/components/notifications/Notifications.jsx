import { UilTimesCircle } from "@iconscout/react-unicons";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./notifications.scss";

const Notifications = ({ userId, onHidden, notification }) => {
  const { isLoading, error, data } = useQuery(["notifications"], () =>
    makeRequest.get("/notifications/" + userId).then((res) => {
      return res.data;
    })
  );

  

  console.log(data);
  console.log(notification);

  return (
    <div className="notification">
      <div className="title">
        <div className="title_name">Notification</div>
        <div className="exit" onClick={onHidden}>
          <UilTimesCircle onClick={onHidden}/>{" "}
        </div>
      </div>

      {data?.map((notification, index) => {
        return (
          <div className="item" key={index}>
            <div className="image">
              <img src="/upload/image.png" alt="" />
            </div>
            <div className="name">
              {notification.name}
              <span> {notification.type === 1 && "liked" || notification.type === 2 && "commented" || notification.type===3 && "followed"}  your post</span>
              <div className="title_post">
                {" "}
                My morning Huong Huong Huong Huong
                <span className="point">h</span>
              </div>
              <span className="time">5m ago</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Notifications;
