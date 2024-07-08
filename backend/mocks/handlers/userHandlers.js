import { http, HttpResponse } from "msw";

const mockUser = {
  name: "Test name",
  email: "testing@email.com",
  _id: "666980f45001805b223206f7",
};

const userHandlers = [
  // Get all users & get user
  http.get(`${import.meta.env.BACKEND_URL}/users`, async ({ params }) => {
    if (params.user_id) {
      return HttpResponse.json({ users: [mockUser] });
    } else {
      return HttpResponse.json({ user: mockUser });
    }
  }),
];

export default userHandlers;
