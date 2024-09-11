import React, { useState } from "react";
import "./Login.css";
import assets from "../../assets/assets";
import { signup, login, resetPass } from "../../configs/firebase";

const Login = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === "Sign Up") {
      signup(username, email, password);
    } else {
      login(email, password);
    }
  };
  return (
    <div className="min-h-[100vh] flex items-center justify-evenly bg-[url('../../../public/background.png')] bg-no-repeat bg-cover">
      <img
        src={assets.logo_big}
        alt=""
        className="max-w-[20vw] max-w-[200px]"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-white py-[20px] px-[30px] flex flex-col gap-[20px] rounded-xl"
      >
        <h2 className="font-medium">{currState}</h2>
        {currState === "Sign Up" ? (
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            className="form-input"
            placeholder="Username"
            required
          />
        ) : null}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="form-input"
          placeholder="Email Address"
          required
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="form-input"
          placeholder="Password"
        />
        <button
          className="p-[10px] bg-[#077EFF] text-white text-base border-0 rounded cursor-pointer"
          type="submit"
        >
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="tc flex gap-[5px] text-[12px] text-[#808080] ">
          <input type="checkbox" />
          <p>Agree to the terms of & privacy policy.</p>
        </div>
        <div className="login-forgot flex flex-col gap-[5px] ">
          {currState === "Sign Up" ? (
            <p className=" text-[13px] text-[#5c5c5c] ">
              Create an account{" "}
              <span
                className="font-medium text-[#077EFF] cursor-pointer"
                onClick={() => setCurrState("Login")}
              >
                login here
              </span>{" "}
            </p>
          ) : (
            <p className=" text-[13px] text-[#5c5c5c] ">
              Already have an account{" "}
              <span
                className="font-medium text-[#077EFF] cursor-pointer"
                onClick={() => setCurrState("Sign Up")}
              >
                click here
              </span>
            </p>
          )}
          {currState === "Login" ? (
            <p className=" text-[13px] text-[#5c5c5c] ">
              Forgot password &nbsp;
              <span
                className="font-medium text-[#077EFF] cursor-pointer"
                onClick={() => resetPass(email)}
              >
                 reset here
              </span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
