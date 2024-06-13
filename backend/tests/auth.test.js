import { describe, test, expect } from "vitest";

describe("Register new user", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "test name",
          email: "testing@email.com",
          password: "test123",
        }),
      },
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("user");
  });

  test("Missing name in body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "testing@email.com",
          password: "test123",
        }),
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Name is required.");
  });

  test("Missing email in body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "test name",
          password: "test123",
        }),
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Email is required.");
  });

  test("Missing password in body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "test name",
          email: "testing@email.com",
        }),
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Password is required.");
  });
});

describe("Login user", () => {
  test("Success", async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "testing@email.com",
        password: "test123",
      }),
    });

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("token");
    expect(body).toHaveProperty("user");
  });

  test("Missing email in body", async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: "test123",
      }),
    });

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Email is required.");
  });

  test("Missing password in body", async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "testing@email.com",
      }),
    });

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Password is required.");
  });
});
