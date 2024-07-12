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

const userHandlers = [
  // Get all users
  http.get(`${import.meta.env.VITE_BACKEND_URL}/users`, () => {
    return HttpResponse.json({ users: [mockUser] });
  }),
  // Get user
  http.get(
    `${import.meta.env.VITE_BACKEND_URL}/users/:user_id`,
    ({ params }) => {
      if (!params.user_id) {
        return HttpResponse.json(
          { message: "User ID is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json({ user: mockUser });
    },
  ),
  http.get(
    `${import.meta.env.VITE_BACKEND_URL}/users/:user_id/projects`,
    ({ params }) => {
      if (!params.user_id) {
        return HttpResponse.json(
          { message: "User ID is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json({ projects: [mockProject] });
    },
  ),
];

export default userHandlers;
