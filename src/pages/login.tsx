import NavBar from "../components/navBar";
import "./login.css";
import { useState } from "react";
import { login } from "../api.ts";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({ setToken }: { setToken: Function }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    let token = "";

    setErrorMessage("");

    try {
      token = await login(username, password);
      Cookies.set("token", token, { secure: true });
      setToken(token);
      navigate("/");
    } catch (err) {
      console.log("error:", err);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  }

  return (
    <div id="page">
      <NavBar username={""} />
      <form id="loginForm" onSubmit={handleSubmit}>
        <div id="title">Log in</div>
        <div className="field">
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {errorMessage && <p className="message error">{errorMessage}</p>}
        <button type="submit">Log in</button>
        <Link to="/register">Need an account? Register here</Link>
      </form>
    </div>
  );
}
