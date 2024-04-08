import { useContext } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import "./story.scss";

const stories = [
  {
    name: "Huong",
    coverPic: "/upload/image.png",
    audio: "/audio/CarelessWhisper-GeorgeMichael.mp3",
    time: "5m ago",
  },
  {
    name: "Huong",
    coverPic: "/upload/image.png",
    audio: "/audio/CarelessWhisper-GeorgeMichael.mp3",
    time: "5m ago",
  },
  {
    name: "Huong",
    coverPic: "/upload/image.png",
    audio: "/audio/CarelessWhisper-GeorgeMichael.mp3",
    time: "5m ago",
  },
  {
    name: "Huong",
    coverPic: "/upload/image.png",
    audio: "/audio/CarelessWhisper-GeorgeMichael.mp3",
    time: "5m ago",
  },
  {
    name: "Huong",
    coverPic: "/upload/image.png",
    audio: "/audio/CarelessWhisper-GeorgeMichael.mp3",
    time: "5m ago",
  },
  {
    name: "Huong",
    coverPic: "/upload/image.png",
    audio: "/audio/CarelessWhisper-GeorgeMichael.mp3",
    time: "5m ago",
  },
  {
    name: "Huong",
    coverPic: "/upload/image.png",
    audio: "/audio/CarelessWhisper-GeorgeMichael.mp3",
    time: "5m ago",
  },
];

const Story = () => {
  const { darkMode } = useContext(DarkModeContext);

  const { currentUser } = useContext(AuthContext);
  const settings = {
    initialSlide: 1,
    infinite: true,
    
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // useEffect(()=>{
  //     const getStories = async ()=>{
  //         try{
  //             const res = await axios.get(
  //                 `http://localhost:8800/api/stories/`
  //             );
  //             setStories(res.data);
  //         }catch(err){
  //             console.log(err);
  //         }
  //     }
  //     getStories();
  // },[currentUser.id]);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <div className="story">
        <Slider {...settings}>
          <div>
            <img src="/upload/image.png"/>
          </div>
          <div>
            <img src="/upload/image.png"/>
          </div>
          <div>
            <img src="/upload/image.png"/>
          </div>
          <div>
            <img src="/upload/434163817_1406183053590660_6113664325981554173_n.jpg"/>
          </div>
          <div>
            <img src="/upload/image.png"/>
          </div>
          <div>
            <img src="/upload/image.png"/>
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Story;
