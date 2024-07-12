import { describe, test, expect, assert } from "vitest";

const userId = "666980f45001805b223206f7";

describe("Get all users", () => {
  test("Success", async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`);

    expect(res.ok).toBe(true);

    const body = await res.json();
    assert.isArray(body.users);
  });
});

describe("Get user", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("user");
  });
});

describe("Get user's projects", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/projects`,
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    assert.isArray(body.projects);
  });
});
