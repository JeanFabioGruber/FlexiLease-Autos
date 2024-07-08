import request from "supertest";
import app from "../src/servertest";

describe("User Endpoints", () => {
  let createdUserId: string;

  beforeEach(async () => {
    const res = await request(app).post("/api/v1/users").send({
      name: "Jean Fabio test",
      email: "jeantest@gmail.com",
      cpf: "750.361.400-52",
      birth: "09/21/2004",
      password: "senha1",
      qualified: "sim",
      cep: "83881-016",
    });
    createdUserId = res.body.id;
  });

  afterEach(async () => {
    await request(app).delete(`/api/v1/users/${createdUserId}`);
  });

  it("should create a new user", async () => {
    const res = await request(app).post("/api/v1/users").send({
      name: "Jean Fabio test",
      email: "jeantest2@gmail.com",
      cpf: "045.582.240-95",
      birth: "09/21/2004",
      password: "senha1",
      qualified: "sim",
      cep: "83881-016",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    await request(app).delete(`/api/v1/users/${res.body.id}`);
  });

  it("should authenticate user", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "jeantest@gmail.com",
      password: "senha1",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should get all users", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should get user by id", async () => {
    const res = await request(app).get(`/api/v1/users/${createdUserId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Jean Fabio test");
  });

  it("should update user", async () => {
    const res = await request(app).put(`/api/v1/users/${createdUserId}`).send({
      name: "Jean Fabio test11",
      email: "jeantest@gmail.com",
      cpf: "750.361.400-52",
      birth: "09/21/2004",
      password: "senha1",
      qualified: "sim",
      cep: "83881-016",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name", "Jean Fabio test11");
  });

  it("should delete user", async () => {
    const res = await request(app).delete(`/api/v1/users/${createdUserId}`);
    expect(res.statusCode).toEqual(204);
  });

  it("should return 400 Bad Request on invalid user creation", async () => {
    const res = await request(app).post("/api/v1/users").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 401 Unauthorized on invalid login", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "invalidemail@gmail.com",
      password: "invalidpassword",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 400 Bad Request on invalid user deletion", async () => {
    const res = await request(app).delete("/api/v1/users/invaliduserid");
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });
});
