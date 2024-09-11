import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../configs/firebase";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages,setMessages] = useState([]);
  const [chatUser,setChatUser] = useState(null);

  const loadUserData = async (uid) => {
    try {
      // console.log("Loading user data for uid:", uid);
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        // console.log("User data:", userData);
        setUserData(userData);

        if (userData.avatar && userData.name) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }

        await updateDoc(userRef, {
          lastSeen: Date.now(),
        });
        setInterval(async () => {
          if (auth.chatUser) {
            await updateDoc(userRef, {
              lastSeen: Date.now(),
            });
          }
        }, 60000);
      } else {
        console.log("No such document! Document ID:", uid);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unsub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatsData;
        // console.log(res.data());
        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          //saving data to tempData
          tempData.push({ ...item, userData });
        }
        setChatData(tempData.sort((a, b) => a.updatedAt - b.updatedAt))
      });
      return () => {
        unsub();
      };
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,setMessages,
    messagesId,setMessagesId,
    chatUser,setChatUser
  };

  return (
    <>
      <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    </>
  );
};

export default AppContextProvider;
