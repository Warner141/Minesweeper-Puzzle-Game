import axios from "axios";

export async function register(username: string, password: number) {
  const userData = { username: username, password: password };
  axios
    .post("http://localhost:8080/api/auth/register", userData)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function login(username: string, password: number) {
  const userData = { username: username, password: password };
  axios
    .post("http://localhost:8080/api/auth/login", userData)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function getStats(token: string) {
  axios
    .get("http://localhost:8080/api/user/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
export async function postScore(token: string, score: number) {
  axios
    .post("http://localhost:8080/api/user/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      score: score,
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getLeaderboard() {
  axios
    .get("http://localhost:8080/api/leaderboard/global")
    .then((response) => {
      return response.data.length > 0 ? response.data : undefined;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getUserRank() {
  axios
    .get("http://localhost:8080/api/leaderboard/user")
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
