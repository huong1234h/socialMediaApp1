import { UilMessage, UilSmileBeam } from '@iconscout/react-unicons';
import Picker from 'emoji-picker-react';
import './buttonComment.scss';
const ButtonComment = ({setDesc,handleClick,desc,onShowPicker,onEmojiClick,showPicker})=>{
    console.log("Setdesc",setDesc);
    return (
    
    <div className="write">
        {/* <img src={"/upload/" + currentUser.profilePic} alt="" /> */}
        <div className='emoji' onClick={onShowPicker}><UilSmileBeam/></div>
        <input
          type="text"
          placeholder="Viết bình luận...."
          value={desc}
          onChange={(e) => {setDesc(e.target.value)}}
        />
        <button onClick={handleClick}><UilMessage/></button>
        {showPicker && <div className='picker_container'><Picker
        pickerStyle={{ width: '120%' }}
        onEmojiClick={onEmojiClick} />
        </div>}
      </div>
    
    
    
    
    );
};

export default ButtonComment;