const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

// afterEach(() => {
//     console.log('After Each');
// })

test("should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Santa",
      email: "santa@gmail.com",
      password: "9876543210",
    })
    .expect(201);

  // Assertion: that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertion: about the response body of a request
  expect(response.body.user.name).toBe("Santa");

  // More-advanced way to assert response body
  expect(response.body).toMatchObject({
    user: {
      name: "Santa",
      email: user.email,
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("9876543210");
});

test("should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  // const user = await User.findById(response.body.user._id);
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("should not login non-existent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "sks@gmail.com",
      password: "33423314",
    })
    .expect(400);
});

test("should fetch the user profile", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for un-authenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete account for the user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(response.body._id);
  expect(user).toBeNull();
});

test("should fail to delete an un-authenticated user account", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      gender: "Male",
    })
    .expect(400);
});

test("should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Mike Belcher",
      age: 99,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toMatchObject({
    name: "Mike Belcher",
    age: 99,
  });
});
