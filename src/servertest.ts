import express from "express";
import connectDB from "./database/data-source";
import userRoutes from "./modules/user/routes/user.routes";
import carRoutes from "./modules/car/routes/car.routes";
import reservationRoutes from "./modules/reserva/routes/reservation.routes";

const port = process.env.PORT1 || 8000;
const app = express();

app.use(express.json());

connectDB();

app.use("/api/v1", userRoutes);
app.use("/api/v1", carRoutes);
app.use("/api/v1", reservationRoutes);

app.listen(port, () => {
  console.log(`Server is running at PORT:${port}`);
});

export default app;
