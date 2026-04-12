import { Link, useNavigate } from "react-router-dom";
import "./navBar.css";
import Cookies from "js-cookie";

export default function NavBar({
  username,
  clearScores = () => {},
  clearToken = () => {},
}: {
  username: string | null;
  clearScores?: () => void;
  clearToken?: () => void;
}) {
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
                Cookies.remove("scores");
                navigate("/login");
                clearScores();
                clearToken();
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
