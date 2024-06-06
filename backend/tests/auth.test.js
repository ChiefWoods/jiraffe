import { describe, test, expect } from "vitest";

describe("Register new user", () => {
  test("Success", async () => {
    const res = await fetch(`http://localhost:${import.meta.env.VITE_PORT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "John Xina",
        email: "bingchiling@email.com",
        password: "ilovechina",
      }),
    });

    expect(res.ok).toBe(true);
  });

  test("Missing name", async () => {
    const res = await fetch(`http://localhost:${import.meta.env.VITE_PORT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "bingchiling@icecream.com",
        password: "ilovechina",
      })
    });

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Name is required.");
  });

  test("Missing email", async () => {
    const res = await fetch(`http://localhost:${import.meta.env.VITE_PORT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "John Xina",
        password: "ilovechina",
      })
    });

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Email is required.");
  });

  test("Missing password", async () => {
    const res = await fetch(`http://localhost:${import.meta.env.VITE_PORT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "John Xina",
        email: "bingchiling@icecream.com",
      })
    });

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Password is required.");
  });
});

describe("Login user", () => {
  test("Success", async () => {
    const res = await fetch(`http://localhost:${import.meta.env.VITE_PORT}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "therock@power.com",
        password: "bigassforehead",
      }),
    });

    expect(res.ok).toBe(true);
  })

  test("Missing email", async () => {
    const res = await fetch(`http://localhost:${import.meta.env.VITE_PORT}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: "sleepyJoe",
      }),
    });

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Email is required.");
  })

  test("Missing password", async () => {
    const res = await fetch(`http://localhost:${import.meta.env.VITE_PORT}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "himom@email.com",
      }),
    });

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body.message).toBe("Password is required.");
  })
});