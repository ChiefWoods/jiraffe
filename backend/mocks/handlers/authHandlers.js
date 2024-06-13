import { http, HttpResponse } from "msw";

const mockUser = {
  name: "Test name",
  email: "testing@email.com",
  _id: "666980f45001805b223206f7",
};

const authHandlers = [
  http.post(
    `http://localhost:${import.meta.env.VITE_PORT}/auth/register`,
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
    `http://localhost:${import.meta.env.VITE_PORT}/auth/login`,
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
        { token: "<bcrypt hash>", user: mockUser },
        { status: 200 },
      );
    },
  ),
];

export default authHandlers;
