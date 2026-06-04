import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
const app = express();
app.use(express.json())
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.get("/", (req, res) => {
	res.send("Hello world");
});

const toJSON = (obj) =>
  JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === 'bigint' ? Number(v) : v
    )
  )
import  deltagareRouter from "./routes/deltagare.js"
import  loginRouter from "./routes/login.js"
import  matcherRouter from "./routes/matcher.js"
import  tippaRouter from "./routes/tippa.js"
app.use("/api", loginRouter)
app.use("/api/matcher", matcherRouter)
app.use("/api/tippa", tippaRouter)
app.use("/api/deltagare", deltagareRouter)

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
