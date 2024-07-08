import request from "supertest";
import app from "../src/servertestReservation";
import { authToken } from "../src/utils/jwtUtils";

let createdUserId2: string;
let createdCarId2: string;
let createdReservationId: string;

describe("Reservation Endpoints", () => {
  beforeEach(async () => {
    const userRes2 = await request(app).post("/api/v1/users").send({
      name: "Jean Fabio test reservation 2",
      email: "jeanjwbskjsbdnaskjd@gmail.com",
      cpf: "457.064.410-49",
      birth: "09/21/2004",
      password: "senha1",
      qualified: "sim",
      cep: "83881-016",
    });
    createdUserId2 = userRes2.body.id;

    const carRes2 = await request(app)
      .post("/api/v1/cars")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        modelo: "Chevrolet Onix",
        color: "Black",
        year: 2022,
        value_per_day: 120,
        accessories: ["GPS Navigation"],
        number_of_passengers: 5,
      });
    createdCarId2 = carRes2.body._id;

    const createRes = await request(app)
      .post("/api/v1/reservations")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id_user: createdUserId2,
        id_car: createdCarId2,
        start_date: new Date(),
        end_date: new Date(),
      });
    createdReservationId = createRes.body._id;
  });

  afterEach(async () => {
    await request(app)
      .delete(`/api/v1/reservations/${createdReservationId}`)
      .set("Authorization", `Bearer ${authToken}`);

    await request(app).delete(`/api/v1/users/${createdUserId2}`);

    await request(app)
      .delete(`/api/v1/cars/${createdCarId2}`)
      .set("Authorization", `Bearer ${authToken}`);
  });

  it("should create a new reservation", async () => {
    expect(createdReservationId).toBeDefined();
  });

  it("should get all reservations", async () => {
    const res = await request(app)
      .get("/api/v1/reservations")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("reservations");
    expect(res.body.reservations).toBeInstanceOf(Array);
  });

  it("should get reservation by id", async () => {
    const res = await request(app)
      .get(`/api/v1/reservations/${createdReservationId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id", createdReservationId);
  });

  it("should update reservation", async () => {
    const res = await request(app)
      .put(`/api/v1/reservations/${createdReservationId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ start_date: new Date() });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id", createdReservationId);
  });

  it("should delete reservation", async () => {
    const res = await request(app)
      .delete(`/api/v1/reservations/${createdReservationId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(204);
  });
});
