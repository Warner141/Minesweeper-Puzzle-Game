import NavBar from "../components/navBar";
import "./login.css";
import { useEffect, useState } from "react";
import { register } from "../api.ts";
import Cookies from "js-cookie";
import validate from "../utils/registerInputsValidation.ts";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage({ setToken }: { setToken: Function }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (username != "" || password != "") {
      setValidationMessage(validate(username, password, confirmPassword));
    }
  }, [username, password, confirmPassword]);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    let token = "";

    setErrorMessage("");
    if (validationMessage === "") {
      try {
        token = await register(username, password);
        Cookies.set("token", token, { secure: true });
        setToken(token);
        navigate("/");
      } catch (err) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        }
      }
      console.log(token ? token : "");
    }
  }

  return (
    <div id="page">
      <NavBar username={""} />
      <div id="panel">
        <form id="loginForm" onSubmit={handleSubmit}>
          <div id="title">Create Account</div>
          <div className="field">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose your username"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create your password"
            />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          {validationMessage && (
            <p className="message validation">{validationMessage}</p>
          )}
          {errorMessage && <p className="message error">{errorMessage}</p>}
          <button type="submit">Sign up</button>
          <Link to="/login">Have an account? Login here</Link>
        </form>
      </div>
    </div>
  );
}
