import bcryptjs from "bcryptjs";
import User, { UserType } from "../models/users";
import supertest from "supertest";
import app from "..";
import helper from "./test_helper";

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcryptjs.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();
});

describe("when there is initially one user in db", () => {
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    } satisfies UserType;

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("GET /api/users returns all users", async () => {
    const response = await api.get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe((await helper.usersInDb()).length);
  });
});
