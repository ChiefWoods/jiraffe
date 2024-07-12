export const toastTimeout = 3000;
export const nonAdminRoles = ["member", "viewer"];

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return cookieValue;
    }
  }

  return null;
}

export async function getProject(projectID) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectID}`,
    {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data.project;
  } else {
    throw new Error(data.message);
  }
}

export async function updateProject(projectID, projectData) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(projectData),
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data.project;
  } else {
    throw new Error(data.message);
  }
}

export async function getProjectUsers(projectID) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectID}/users`,
    {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data.users;
  } else {
    throw new Error(data.message);
  }
}

export async function getUserProjects(userID) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/users/${userID}/projects`,
    {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data.projects;
  } else {
    throw new Error(data.message);
  }
}

export async function getProjectRole(projectID, userID) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectID}`,
    {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return userID === data.project.admin
      ? "admin"
      : data.project.members.includes(userID)
        ? "member"
        : data.project.viewers.includes(userID)
          ? "viewer"
          : null;
  } else {
    throw new Error(data.message);
  }
}

export async function addUser(projectID, email, role) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectID}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({
        email,
        role,
      }),
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export async function updateUser(projectID, userID, role) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectID}/users`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({
        user_id: userID,
        role,
      }),
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export async function deleteUser(projectID, userId) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectID}/users`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export async function getTasks(projectID) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectID}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data.tasks;
  } else {
    throw new Error(data.message);
  }
}

export async function addTask(projectID, taskData) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/projects/${projectID}/tasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(taskData),
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export async function editTask(taskID, taskData) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(taskData),
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export async function deleteTask(taskID) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/tasks/${taskID}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}

export async function getAllUsers() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  }).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data.users;
  } else {
    throw new Error(data.message);
  }
}

export async function getUser(userID) {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/users/${userID}`,
    {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    },
  ).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data.user;
  } else {
    throw new Error(data.message);
  }
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  }).catch(console.error);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }
}

export async function loginUser(email, password) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).catch(console.error);

  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
}
