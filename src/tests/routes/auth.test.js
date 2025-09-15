const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../server");  // adjust path if needed
const User = require("../../models/User");

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URL);
  }
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/auth/me", () => {
  const testUser = {
    name: "Test User",
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  };

  let cookies;

  beforeAll(async () => {
    // 1. Sign up user
    await request(app).post("/api/auth/signup").send(testUser);

    // 2. Login to get cookies
    const login = await request(app)
      .post("/api/auth/login")
      .send({ emailOrUsername: "testuser", password: "password123" });

    cookies = login.headers["set-cookie"];
  });

  it("should return user profile when authenticated", async () => {
    const res = await request(app)
    .get("/api/auth/me")
    .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);

  // match the actual response fields
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("username", testUser.username);

  
    expect(res.body).not.toHaveProperty("email");
  });

  it("should return 401 when no cookie is provided", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });
});
