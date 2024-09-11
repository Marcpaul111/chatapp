import React, { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { logout } from "../../configs/firebase";
import { AppContext } from "../../context/AppContext";

const SidebarRight = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [messageImgs, setMessageImgs] = useState([]);

  useEffect(() => {
    let temp = [];
    messages.map((msg) => {
      if (msg.image) {
        temp.push(msg.image);
      }
    });
    console.log(temp);
    setMessageImgs(temp);
  }, [messages]);

  return chatUser ? (
    <div className="text-white bg-[#001030] relative h-[75vh] overflow-y-scroll">
      <div className="pt-[60px] text-center max-w-[70%] m-auto flex flex-col justify-center items-center">
        <img
          src={chatUser.userData.avatar}
          alt=""
          className="w-[110px] aspect-square rounded-[50%]"
        />
        <h3 className="flex gap-[5px] text-[18px] font-normal items-center justify-center my-[5px]">
          {Date.now()-chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} alt="" /> : null} 
          {chatUser.userData.name}
        </h3>
        <p className="text-[10px] opacity-[80%] font-light ">
          {chatUser.userData.bio}
        </p>
      </div>
      <hr className="border-[#ffffff50] my-[15px]" />

      <div className="px-[20px] text-[13px] ">
        <p>Media</p>
        <div className="grid grid-cols-3 gap-[5px] mt-[8px] max-h-[180px] overflow-y-scroll">
          {messageImgs.map((url, index) => (
            <img
              onClick={() => window.open(url)}
              key={index}
              src={url}
              alt=""
              className="w-[60px] cursor-pointer rounded-[4px] "
            />
          ))}
        </div>
      </div>
      <button
        onClick={() => logout()}
        className="absolute bottom-[20px] left-[18%] translate-x-[(-50%)] bg-[#007EFF] border-0 text-[12px] font-normal py-[10px] px-[65px] rounded-[20px] cursor-pointer"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="text-white bg-[#001030] relative h-[75vh] overflow-y-scroll">
      <button
        onClick={() => logout()}
        className="absolute bottom-[20px] left-[18%] translate-x-[(-50%)] bg-[#007EFF] border-0 text-[12px] font-normal py-[10px] px-[65px] rounded-[20px] cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default SidebarRight;
