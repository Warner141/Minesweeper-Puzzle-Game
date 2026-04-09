import express from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "./prisma/client.js";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per 15 minutes
  message: { error: "Too many attempts, please try again later" },
});

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost",
      "https://unsympathisingly-versional-margurite.ngrok-free.dev",
    ],
  }),
);
app.use("/api/auth", authLimiter);

const port = process.env.PORT || 8080;

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; //if header is missing token will be undefined
  if (!token) {
    console.log("Header or token missing");
    return res.status(401).json("Header or token missing");
  }

  try {
    req.userId = jsonwebtoken.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch {
    console.log("Invalid or expired token");
    return res.status(401).json("Invalid or expired token");
  }
}

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  const validUsername = /^[a-zA-Z][a-zA-Z0-9_-]{4,19}$/;
  const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])\S{8,64}$/;
  if (!username || !password) {
    return res.status(400).json({ error: "Invalid input" });
  }
  if (!validUsername.test(username) || /^(admin|root|null)$/i.test(username)) {
    return res.status(400).json({ error: "Invalid input" });
  }
  if (!validPassword.test(password)) {
    return res.status(400).json({ error: "Invalid input" });
  }

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
    if (error.code === "P2002") {
      return res.status(409).json({ error: "This username already exists" });
    }
    res.status(500).json({ error: "Something went wrong, 500" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Invalid input" });
  }

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
    include: { scores: { orderBy: { score: "desc" } } },
  });

  res.send({
    username: user.username,
    gamesPlayed: user.gamesPlayed,
    scores: user.scores,
  });
});

app.get("/api/user/:username", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    include: { scores: { orderBy: { score: "desc" } } },
  });

  res.send({ gamesPlayed: user.gamesPlayed, scores: user.scores });
});

app.post("/api/user/stats", authenticateJWT, async (req, res) => {
  const prevScores = await prisma.score.findMany({
    where: { userId: req.userId },
    orderBy: { score: "asc" },
  });
  await prisma.user.update({
    where: { id: req.userId },
    data: {
      gamesPlayed: { increment: 1 },
    },
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
