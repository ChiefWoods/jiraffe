import { http, HttpResponse } from "msw";

const mockUser = {
  name: "Test name",
  email: "testing@email.com",
  _id: "666980f45001805b223206f7",
};

const mockProject = {
  _id: "666980f45001805b223206f9",
  name: "Test name's Project",
  admin: "666980f45001805b223206f7",
  members: [],
  viewers: [],
  createdAt: "2024-06-12T11:05:24.963Z",
  updatedAt: "2024-06-12T11:05:24.963Z",
  __v: 0,
};

const authHandlers = [
  http.post(
    `${import.meta.env.VITE_BACKEND_URL}}/auth/register`,
    async ({ request }) => {
      const body = await request.json();

      if (!body.name) {
        return HttpResponse.json(
          { message: "Name is required." },
          { status: 400 },
        );
      } else if (!body.email) {
        return HttpResponse.json(
          { message: "Email is required." },
          { status: 400 },
        );
      } else if (!body.password) {
        return HttpResponse.json(
          { message: "Password is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json({ user: mockUser }, { status: 201 });
    },
  ),
  http.post(
    `${import.meta.env.VITE_BACKEND_URL}}/auth/login`,
    async ({ request }) => {
      const body = await request.json();

      if (!body.email) {
        return HttpResponse.json(
          { message: "Email is required." },
          { status: 400 },
        );
      } else if (!body.password) {
        return HttpResponse.json(
          { message: "Password is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json(
        { token: "<bcrypt hash>", user: mockUser, project: mockProject },
        { status: 200 },
      );
    },
  ),
];

export default authHandlers;
