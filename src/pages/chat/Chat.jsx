import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import SidebarLeft from "../../components/sidebarLeft/SidebarLeft";
import Chatbox from "../../components/chatBox/chatBox";
import SidebarRight from "../../components/sidebarRight/SidebarRight";
import { AppContext } from "../../context/AppContext";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);
  return (
    <div className="min-h-[100vh] bg-[linear-gradient(#596AFF,#383699)] grid place-items-center">
      {loading ? 
        <p className="text-[50px] text-white">Loading...</p>
       : 
        <div className="w-[95%] max-w-[1000px] max-h-[75vh] bg-[#c1ced3] grid grid-cols-[1fr_2fr_1fr]">
          <SidebarLeft />
          <Chatbox />
          <SidebarRight />
        </div>
      }
    </div>
  );
};

export default Chat;
