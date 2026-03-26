import express from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "./prisma/client.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

const port = 8080;

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; //if header is missing token will be undefined
  if (!token) {
    return res.status(401).json("Header or token missing");
  }

  try {
    req.userId = jsonwebtoken.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    return res.status(401).json("Invalid or expired token");
  }
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    const token = jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });
    res.send(token);
  } catch (error) {
    if (error.code == "P2002") {
      return res.status(409).json("This username already exists");
    }
    res.status(500).json("Something went wrong");
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username: username } });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const token = jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });

  res.send(token);
});

app.get("/api/user/stats", authenticateJWT, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { scores: true },
  });

  res.send({ gamesPlayed: user.gamesPlayed, scores: user.scores });
});

app.post("/api/user/stats", authenticateJWT, async (req, res) => {
  const prevScores = await prisma.score.findMany({
    where: { userId: req.userId },
    orderBy: { score: "asc" },
  });
  if (prevScores.length < 3) {
    await prisma.score.create({
      data: {
        score: req.body.score,
        userId: req.userId,
      },
    });
    return res.status(200).json("New score was updated successfully");
  }
  if (prevScores[0].score < req.body.score) {
    await prisma.score.delete({ where: { id: prevScores[0].id } });
    await prisma.score.create({
      data: {
        score: req.body.score,
        userId: req.userId,
      },
    });
    return res.status(200).json("New score was updated successfully");
  }
  return res.status(200).json("New score did not make user's top three");
});

app.get("/api/leaderboard/global", async (req, res) => {
  const allUsers = await prisma.user.findMany({
    include: { scores: { orderBy: { score: "desc" }, take: 1 } },
  });

  const validUsers = allUsers.filter((user) => {
    return user.scores.length > 0;
  });
  const topUsers = validUsers
    .sort((a, b) => b.scores[0].score - a.scores[0].score)
    .slice(0, 10);
  res.send(
    topUsers.map((user) => {
      return {
        username: user.username,
        score: user.scores[0].score,
        createdAt: user.scores[0].createdAt,
      };
    }),
  );
}); //top N users

app.get("/api/leaderboard/user", authenticateJWT, async (req, res) => {
  const allUsers = await prisma.user.findMany({
    include: { scores: { orderBy: { score: "desc" }, take: 1 } },
  });

  let validUsers = allUsers.filter((user) => {
    return user.scores.length > 0;
  });
  validUsers = validUsers.sort((a, b) => b.scores[0].score - a.scores[0].score);
  res.send(validUsers.findIndex((user) => user.id == req.userId) + 1);
}); //user's placement

//catches all other routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
});
