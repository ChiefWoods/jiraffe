import { describe, test, expect } from "vitest";

const taskId = "6669851f9df5456f41d314d7";

describe("Get task", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`,
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("task");
  });
});

describe("Update task", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Updated task name",
        }),
      },
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("task");
  });

  test("Empty body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });

  test("Invalid status", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "invalid",
        }),
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });
});

describe("Delete task", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskId}`,
      {
        method: "DELETE",
      },
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });
});
