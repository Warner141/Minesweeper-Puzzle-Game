import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
  config.headers["ngrok-skip-browser-warning"] = "1";
  return config;
});

export async function register(username: string, password: string) {
  const userData = { username: username, password: password };

  const response = await axios
    .post(`${API_URL}/api/auth/register`, userData)
    .catch((err) => {
      if (err.response) {
        throw new Error(err.response.data.error);
      } else if (err.request) {
        throw new Error(err.request);
      } else {
        throw new Error(err.message);
      }
    });
  return response ? response.data : "";
}

export async function login(username: string, password: string) {
  const userData = { username: username, password: password };

  const response = await axios
    .post(`${API_URL}/api/auth/login`, userData)
    .catch((err) => {
      if (err.response) {
        throw new Error(err.response.data.error);
      } else if (err.request) {
        throw new Error(err.request);
      } else {
        throw new Error(err.message);
      }
    });
  return response ? response.data : "";
}

export async function getStats(token: string) {
  try {
    const response = await axios.get(`${API_URL}/api/user/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getProfile(username: string) {
  try {
    const response = await axios.get(`${API_URL}/api/user/:username`, {
      params: { username: username },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function postScore(token: string, score: number) {
  try {
    const response = await axios.post(
      `${API_URL}/api/user/stats`,
      { score: score },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getLeaderboard() {
  try {
    const response = await axios.get(`${API_URL}/api/leaderboard/global`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getUserRank(token: string) {
  try {
    const response = await axios.get(`${API_URL}/api/leaderboard/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
