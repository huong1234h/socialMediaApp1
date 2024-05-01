import { UilAngleLeft, UilAngleRight } from '@iconscout/react-unicons';
import { useQuery } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import DetailStory from '../detailStory/DetailStory';
import StoryForm from "../storyForm/StoryForm";
import "./stories.scss";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [openForm,setOpenForm] = useState(false);
  const [scrollL,setScrollL] = useState(null);
  const [scrollR,setScrollR] = useState(null);
  const contentStoriesRef = useRef(null);
  const [indexStories,setIndexStories] = useState();
  const [openStory,setOpenStory] = useState(false);
  const [dataStory,setDataStory] = useState(null);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
      return res.data;
    })
  );


  
  
  
  const getScroll = () => {
    setScrollL(contentStoriesRef.current.scrollLeft);
    setScrollR(contentStoriesRef.current.scrollWidth- contentStoriesRef.current.scrollLeft - contentStoriesRef.current.clientWidth);
    console.log(scrollR);
  };
  const nextStories = () => {
    contentStoriesRef.current.scrollLeft += 200;
  }
  const prevStories = () =>{
    contentStoriesRef.current.scrollLeft -= 200;
  }

  const nextStory = ()=>{
    if(indexStories + 1 < data.length){
      setIndexStories(indexStories => indexStories + 1);
      setDataStory(data[indexStories+1]);
      console.log(indexStories);
    }
  }
  const prevStory = ()=>{
    if(indexStories - 1 > -1){
      setIndexStories(indexStories => indexStories - 1);
      setDataStory(data[indexStories-1]);
      
      
      console.log(indexStories);
    }
  }
  
  const displayStory = (index)=>{
    try {
      
      setDataStory(data[index]);
      setIndexStories(index);
      setOpenStory(!openStory);
    } catch (error) {
      
    }
  }

  

  return (
    
    <div className="stories">
      {scrollL > 24 && <div className="pre-btn" onClick={prevStories}><UilAngleLeft size="38"/></div>}
      <div className="content-stories" ref={contentStoriesRef} onScroll={getScroll}>
      <Link>
      <div className="story">
        <img src={"/upload/" + currentUser?.profilePic} alt="" />
        <span>{currentUser?.name}</span>
        <button onClick={()=>{setOpenForm(!openForm)}}>+</button>
      </div>
      </Link>
      {error
        ? "Lỗi tải thông tin!"
        : isLoading
        ? "Đang tải"
        : data.map((story,index) => (
          <Link to="/">
            <div className="story" key={story.id} onClick={()=>{displayStory(index)}}>
              <div className="profilePic">
                  <img src="/upload/image.png" alt=""/>
              </div>
              <img className="img-story" src={"/upload/"+story.img} alt="" />
              <span>{story.name}</span>
            </div>
          </Link>
          ))}
    </div>
    {openForm && <StoryForm onHidden={()=>{setOpenForm(!openForm)}} setOpenForm={setOpenForm} openForm={openForm}/>}
      {scrollR > 24  && <div className="next-btn" onClick={nextStories}><UilAngleRight size="38"/></div>}
    {openStory && <DetailStory story={dataStory} onHidden={()=>{setOpenStory(!openStory)}} nextStory={nextStory} prevStory={prevStory}/>}
    </div>

    
  );
};

export default Stories;