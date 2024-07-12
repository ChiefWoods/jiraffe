import { describe, test, expect, assert } from "vitest";

const projectId = "666980f45001805b223206f9";
const userId = "666980f45001805b223206f7";
const email = "test@email.com";
const role = "viewer";

describe("Get all projects", () => {
  test("Success", async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`);

    expect(res.ok).toBe(true);

    const body = await res.json();
    assert.isArray(body.projects);
  });
});

describe("Get project", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("project");
  });
});

describe("Update project", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Updated project name",
        }),
      },
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("project");
  });

  test("Missing name in body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
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
});

describe("Get all tasks from project", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/tasks`,
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    assert.isArray(body.tasks);
  });
});

describe("Add task to project", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Task name 1",
        }),
      },
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("task");
  });

  test("Missing name in body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });
});

describe("Get project users", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/users`,
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    assert.isArray(body.users);
  });
});

describe("Add user to project", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role,
        }),
      },
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });

  test("Missing email in body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
        }),
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });

  test("Missing role in body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });
});

describe("Update user in project", () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/users`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          role: "member",
        }),
      },
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });

  test("Missing user_id in body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/users`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "member",
        }),
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });

  test("Invalid role", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/users`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          role: "invalid",
        }),
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });
});

describe("Remove user from project", async () => {
  test("Success", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/users`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      },
    );

    expect(res.ok).toBe(true);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });

  test("Missing user_id in body", async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/users`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(res.ok).toBe(false);

    const body = await res.json();
    expect(body).toHaveProperty("message");
  });
});
