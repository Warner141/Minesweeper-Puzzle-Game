import "./App.css";
import "./globals.css";
import "./tokens.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from "./pages/game";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import Cookies from "js-cookie";
import { useState } from "react";

function App() {
  const cookieToken = Cookies.get("token");
  const [token, setToken] = useState(cookieToken ? cookieToken : "");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <GamePage
              token={token}
              clearToken={() => {
                setToken("");
              }}
            />
          }
        />
        <Route
          path="/register"
          element={<RegisterPage setToken={setToken} />}
        />
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
