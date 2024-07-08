import request from "supertest";
import app from "../src/servertestCar";
import { authToken } from "../src/utils/jwtUtils";

let createdCarId: string;

describe("Car Endpoints", () => {
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/cars")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        modelo: "Fiat Uno",
        color: "Blue",
        year: 2020,
        value_per_day: 100,
        accessories: ["Air Conditioning"],
        number_of_passengers: 4,
      });
    createdCarId = res.body._id;
  });

  afterEach(async () => {
    await request(app)
      .delete(`/api/v1/cars/${createdCarId}`)
      .set("Authorization", `Bearer ${authToken}`);
  });

  it("should create a new car", async () => {
    const res = await request(app)
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
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");

    const createdCarId2 = res.body._id;

    await request(app)
      .delete(`/api/v1/cars/${createdCarId2}`)
      .set("Authorization", `Bearer ${authToken}`);
  });

  it("should get all cars", async () => {
    const res = await request(app)
      .get("/api/v1/cars")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("cars");
    expect(res.body.cars).toBeInstanceOf(Array);
  });

  it("should get car by id", async () => {
    const res = await request(app)
      .get(`/api/v1/cars/${createdCarId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("modelo", "Fiat Uno");
  });

  it("should update car", async () => {
    const res = await request(app)
      .put(`/api/v1/cars/${createdCarId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ modelo: "Fiat Palio" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("modelo", "Fiat Palio");
  });

  it("should delete car", async () => {
    const res = await request(app)
      .delete(`/api/v1/cars/${createdCarId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(204);
  });

  it("should return 400 Bad Request on invalid car creation", async () => {
    const res = await request(app)
      .post("/api/v1/cars")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        color: "Blue",
        year: 2020,
        value_per_day: 100,
        accessories: ["Air Conditioning"],
        number_of_passengers: 4,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "message",
      'Erro de validação: "modelo" is required'
    );
  });

  it("should return 404 Not Found when car does not exist", async () => {
    const res = await request(app)
      .get("/api/v1/cars/60e4343a4f4a5b001c8f4e36")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Carro não encontrado.");
  });

  it("should return 404 Not Found on invalid car deletion", async () => {
    const res = await request(app)
      .delete("/api/v1/cars/60e4343a4f4a5b001c8f4e36")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Carro não encontrado.");
  });
});
