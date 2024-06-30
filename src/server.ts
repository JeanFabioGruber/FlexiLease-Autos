import express from "express";
import connectDB from "./database/data-source";
import userRoutes from "./modules/user/routes/user.routes";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

connectDB();

app.use("/api/v1", userRoutes);

app.listen(port, () => {
  console.log(`Server is running at PORT:${port}`);
});
