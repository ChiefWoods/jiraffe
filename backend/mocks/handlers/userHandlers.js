import { http, HttpResponse } from "msw";

const mockProjects = [
  {
    _id: "666980f45001805b223206f9",
    name: "Test name's Project",
    admin: "666980f45001805b223206f7",
    member: [],
    viewer: [],
    createdAt: "2024-06-12T11:05:24.963Z",
    updatedAt: "2024-06-12T11:05:24.963Z",
    __v: 0,
  },
];

const userHandlers = [
  // Get user's projects
  http.get(`${import.meta.env.BACKEND_URL}/users`, async ({ params }) => {
    if (!params.user_id) {
      return HttpResponse.json(
        { message: "User ID is required." },
        { status: 400 },
      );
    }

    return HttpResponse.json({ projects: mockProjects });
  }),
];

export default userHandlers;
