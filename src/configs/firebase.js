import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDFdkRuIJEBqvixjN3dFoUw4jVAJlLyXdc",
  authDomain: "chat-app-cc84f.firebaseapp.com",
  projectId: "chat-app-cc84f",
  storageBucket: "chat-app-cc84f.appspot.com",
  messagingSenderId: "676855534653",
  appId: "1:676855534653:web:13acd5508ac10e29528654",
  measurementId: "G-MJ9F2F6VDQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    console.log("User created with UID:", user.uid);

    const userDoc = {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey there, I'm using chat app",
      lastSeen: Date.now(),
    };

    await setDoc(doc(db, "users", user.uid), userDoc);
    console.log("User document created in Firestore:", userDoc);

    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    });
    console.log("Chat document created in Firestore for UID:", user.uid);

  } catch (error) {
    console.error("Error during signup:", error);
    toast.error(error.message);
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

const logout = async () =>{
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}

const resetPass = async (email) => {
  if (!email) {
    toast.error('Enter your email');
    return null; 
  }

  try {
    const userRef = collection(db,"users");
    const q = query(userRef,where("email","==",email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty){
       await sendPasswordResetEmail(auth,email);
       toast.success("Reset email sent")
    }else{
      toast.error("Email doesn't exist!")
    }
  } catch (error) {
    
  }
}

export { signup, login, logout, auth, db, resetPass };
