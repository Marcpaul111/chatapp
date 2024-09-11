import React, { useContext, useState } from "react";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  where,
  query,
  updateDoc,
  setDoc,
  arrayUnion,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../configs/firebase";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";


const SidebarLeft = () => {
  const navigate = useNavigate();
  const { userData, chatData, chatUser,setChatUser,setMessagesId,messagesId } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        console.log(chatData);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
            if (!userExist) {
              setUser(querySnap.docs[0].data());
            }
          });
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {}
  };

  const addChat = async () => {
    const messRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessRef = doc(messRef);
      await setDoc(newMessRef, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const setChat = async (item) => {
    try {
      setMessagesId(item.messageId);
      setChatUser(item)
      const userChatsRef = doc(db,"chats",userData.id);
      const userChatSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatSnapshot.data();
      const chatIndex =  userChatsData.chatsData.findIndex((c) => c.messageId === item.messageId)
      userChatsData.chatsData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef,{
        chatsData: userChatsData.chatsData
      })
    } catch (error) {
      toast.error(error.message)
    }
   
  };

  return (
    <div className="bg-[#001030] text-[#ffff] h-[75vh] w-full">
      <div className="p-[20px]">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-[140px]" />
          <div className="relative py-[10px] group">
            <img
              src={assets.menu_icon}
              alt=""
              className="max-h-[20px] opacity-[0.6] cursor-pointer"
            />
            <div className="hidden absolute top-[100%] right-0 w-[130px] p-[20px] rounded-md bg-white text-black group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-[14px]"
              >
                Edit Profile
              </p>
              <hr className="border-0 h-[1px] bg-[#a4a4a4] my-[8px]" />
              <p className="cursor-pointer text-[14px]">Logout</p>
            </div>
          </div>
        </div>
        <div className="bg-[#002670] flex items-center gap-[10px] py-[10px] px-[12px] mt-[20px]">
          <img src={assets.search_icon} alt="" className="h-[15px] w-[15px]" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here.."
            className="bg-transparent border-0 outline-0 text-white text-[11px] placeholder-shown:text-[#c8c8c8]"
          />
        </div>
      </div>
      <div className="flex flex-col h-[70%] overflow-y-scroll ">
        {showSearch && user ? (
          <div
            onClick={addChat}
            className="flex items-center gap-[10px] py-[10px] px-[20px] text-[13px] cursor-pointer hover:bg-[#077EFF]"
          >
            <img
              className="w-[35px] aspect-square rounded-[50%]"
              src={user.avatar}
              alt=""
            />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData &&
          chatData.map((item, index) => (
            <div
              onClick={()=>setChat(item)}
              key={index}
              className="flex items-center gap-[10px] py-[10px] px-[20px] text-[13px] cursor-pointer hover:bg-[#077EFF] "
            >
              <img
                src={item.userData.avatar}
                alt=""
                className={`w-[35px] aspect-square rounded-[50%] ${item.messageSeen || item.messageId === messagesId ? '' : 'border-[3px] border-[#87ceeb]'}`}
              />
              <div className="flex flex-col">
                <p >{item.userData.name}</p>
                <span className={`text-[#9f9f9f] text-[11px] hover:text-white ${item.messageSeen || item.messageId === messagesId ? '' : 'text-[#87ceeb]'}`}>
                  {item.lastMessage}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SidebarLeft;
