import { Link, useNavigate } from "react-router-dom";
import "./navBar.css";
import Cookies from "js-cookie";

export default function NavBar({ username }: { username: string | null }) {
  const navigate = useNavigate();
  return (
    <header id="header">
      <div id="nav-title">Blind Spot</div>
      <nav>
        <Link to="/">Play</Link>
        {username ? (
          <div id="username-logout">
            <div
              id="logout"
              onClick={() => {
                Cookies.remove("token");
                navigate("/login");
              }}
            >
              Log out
            </div>
            <div>{username}</div>
          </div>
        ) : (
          <nav>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </nav>
        )}
      </nav>
    </header>
  );
}
