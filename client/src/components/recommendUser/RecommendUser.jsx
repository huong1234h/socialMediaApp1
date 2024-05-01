import { UilMultiply } from '@iconscout/react-unicons';
import BtnFollow from "../btnFollow/BtnFollow";
import "./recommendUser.scss";


const RecommendUser = (data,onHidden) => {
    console.log(data);
  return (
    <div className="recommendUser">
        
        <div className="boxUser">
        <div className="titleBar">
            <div></div>
            <div className="title">Gợi ý</div>
            <div className="exit" onClick={data.onHidden}><UilMultiply/></div>
        </div>
      {data.data.map((user, index) => (
            <div className="user user-recommend" key={index}>
              <div className="userInfo">
                <div className='image'>
                    <img src={"/upload/image.png"} alt="" />
                </div>
                <div className="name">{user.name}</div>
                <div className='blog'>huongka234.com</div>
              </div>
              
              <div className="buttons">
                <BtnFollow userId={user.id} />
              </div>
            </div>
          ))}
          </div>
    </div>
  );
};

export default RecommendUser;
