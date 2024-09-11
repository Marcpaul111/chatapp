import React, { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../configs/firebase";
import { toast } from "react-toastify";
import upload from "../../lib/upload";

const Chatbox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } = useContext(
    AppContext
  );

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIds = [chatUser.rId, userData.id];
        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatSnapshot = await getDoc(userChatsRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
    setInput("");
  };

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0]);

      if (fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date(),
          }),
        });

        const userIds = [chatUser.rId, userData.id];
        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatSnapshot = await getDoc(userChatsRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            const chatIndex = userChatData.chatsData.findIndex(
              (c) => c.messageId === messagesId
            );
            userChatData.chatsData[chatIndex].lastMessage = "Image";
            userChatData.chatsData[chatIndex].updatedAt = Date.now();
            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
        console.log(res.data().messages.reverse());
      });
      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  const convertTimeStamp = (timestamp) => {
    const date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ":" + minute + "PM";
    } else {
      return hour + ":" + minute + "AM";
    }
  };
  return chatUser ? (
    <div className="h-[75vh] relative bg-[#c1ced3] ">
      {/* Profile section */}
      <div className="py-[10px] px-[15px] flex items-center gap-[10px] border-b-[1px]">
        <img
          src={chatUser.userData.avatar}
          alt=""
          className="w-[38px] rounded-[50%] aspect-square"
        />
        <p className="flex-1 flex font-medium text-[#393939] items-center gap-[5px]">
          {chatUser.userData.name}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img
              src={assets.green_dot}
              alt=""
              className="w-[15px !important] rounded-[50%]"
            />
          ) : null}
        </p>
        <img src={assets.help_icon} alt="" className="w-[25px] rounded-[50%]" />
      </div>

      {/* Conversation box */}
      <div className="h-[calc(100%-70px)] pb-[50px] overflow-y-scroll flex flex-col-reverse ">
        {/* Sender */}

        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            {/* Sender Message */}

            <div
              key={index}
              className={
                msg.sId === userData.id
                  ? "flex items-end justify-end gap-[5px] px-[15px]"
                  : "flex items-end justify-end gap-[5px] px-[15px] flex-row-reverse"
              }
            >
              {msg["image"] ? (
                <img
                  src={msg.image}
                  alt=""
                  className={`max-w-[200px] rounded-lg mb-[30px] ${
                    msg.sId === userData.id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                />
              ) : (
                <p
                  className={`text-white bg-[#077EFF] p-[8px] max-w-[300px] font-light rounded-lg mb-[30px] ${
                    msg.sId === userData.id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}

              <div>
                <img
                  src={
                    msg.sId === userData.id
                      ? userData.avatar
                      : chatUser.userData.avatar
                  }
                  alt=""
                  className="w-[27px] aspect-square rounded-[50%]"
                />
                <p className="text-[9px] text-center">
                  {convertTimeStamp(msg.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Message input */}
      <div className="flex items-center gap-[12px] py-[12px] px-[15px] bg-white absolute bottom-0 left-0 right-0">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
          className="flex-1 border-0 outline-0"
        />
        <input
          onChange={sendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />
        <label className="flex" htmlFor="image">
          <img
            src={assets.gallery_icon}
            alt=""
            className="w-[22px] cursor-pointer"
          />
        </label>
        <img
          onClick={sendMessage}
          src={assets.send_button}
          alt=""
          className="w-[30px] cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col items-center justify-center gap-[5px] bg-[#c1ced3]">
      <img src={assets.logo_icon} alt="" className="w-[60px]" />
      <p className="text-[20px] font-medium text-[#383838]">
        Chat anytime, anywhere
      </p>
    </div>
  );
};

export default Chatbox;
