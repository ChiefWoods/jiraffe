import { http, HttpResponse } from "msw";

const authHandlers = [
  http.post(`http://localhost:${import.meta.env.VITE_PORT}/auth/register`, async ({ request }) => {
    const body = await request.json();

    if (!body.name) {
      return HttpResponse.json({ message: "Name is required." }, { status: 400 });
    } else if (!body.email) {
      return HttpResponse.json({ message: "Email is required." }, { status: 400 });
    } else if (!body.password) {
      return HttpResponse.json({ message: "Password is required." }, { status: 400 });
    }

    return HttpResponse.json({ message: "User registered successfully." }, { status: 201 });
  }),
  http.post(`http://localhost:${import.meta.env.VITE_PORT}/auth/login`, async ({ request }) => {
    const body = await request.json();

    if (!body.email) {
      return HttpResponse.json({ message: "Email is required." }, { status: 400 });
    } else if (!body.password) {
      return HttpResponse.json({ message: "Password is required." }, { status: 400 });
    }

    return HttpResponse.json({ token: "<bcrypt hash>" }, { status: 200 });
  }),
];

export default authHandlers;