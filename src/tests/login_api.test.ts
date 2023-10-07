import bcryptjs from "bcryptjs";
import supertest from "supertest";
import app from "..";
import User from "../models/users";

const api = supertest(app);
const adminUser = { username: "root", name: "root", password: "secret" };

beforeEach(async () => {
  await User.deleteMany({});
  const saltRounds = 10;
  const passwordHash = await bcryptjs.hash(adminUser.password, saltRounds);
  const user = new User({
    name: adminUser.name,
    username: adminUser.username,
    passwordHash: passwordHash,
  });
  await user.save();
});

describe("Login API", () => {
  test("login with correct credentials", async () => {
    await api
      .post("/api/login")
      .send(adminUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("login with incorrect credentials", async () => {
    const credentials = {
      username: "root",
      password: "wrong",
    };

    await api.post("/api/login").send(credentials).expect(401);
  });
});
