import React, { useContext, useEffect, useState } from "react";
import "./ProfileUpdate.css";
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../configs/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from "../../context/AppContext";

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload profile picture");
      }
      const docRef = doc(db, "users", uid);
      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {
          avatar: imgUrl,
          bio: bio,
          name: name,
        });
      } else {
        await updateDoc(docRef, {
          bio: bio,
          name: name,
        });
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat')

    } catch (error) {
      console.error(error);
      toast.error(error.message)
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);
        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className="min-h-[100vh] bg-[url('../../../public/background.png')] bg-no-repeat bg-cover flex justify-center items-center ">
      <div className="bg-white flex items-center justify-center min-w-[700px] rounded-[10px]">
        <form
          onSubmit={profileUpdate}
          className="flex flex-col gap-[20px] p-[40px]"
        >
          <h3 className="font-medium">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-[10px] text-gray cursor-pointer"
          >
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
              className="w-[50px] aspect-square rounded-[50%]"
            />
            Upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="border-2 border-[#c9c9c9] rounded-md p-[10px] min-w-[30px] outline-[#077EFF]"
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.bio)}
            value={bio}
            className="border-2 border-[#c9c9c9] rounded-md p-[10px] min-w-[30px] outline-[#077EFF]"
            name=""
            id=""
            cols="30"
            rows="10"
            placeholder="Write profile bio"
          ></textarea>
          <button
            className="border-0 text-white bg-[#077EFF] p-[8px] text-[1rem] cursor-pointer"
            type="submit"
          >
            Save
          </button>
        </form>
        <img
          className="max-w-[160px] aspect-square my-[20px] mx-auto rounded-[50%]"
          src={image ? URL.createObjectURL(image) : prevImage? prevImage : assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
