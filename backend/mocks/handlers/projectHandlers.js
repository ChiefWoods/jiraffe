import { http, HttpResponse } from "msw";

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

const mockTask = {
  _id: "6669851f9df5456f41d314d7",
  project_id: "666980f45001805b223206f9",
  name: "Test task 1",
  desc: "Task desc 1",
  status: "TO DO",
  createdAt: "2024-06-12T11:23:11.899Z",
  updatedAt: "2024-06-12T11:23:11.899Z",
  __v: 0,
};

const projectHandlers = [
  // Get all projects
  http.get(`${import.meta.env.BACKEND_URL}/projects`, async () => {
    return HttpResponse.json({
      projects: [mockProject],
    });
  }),
  // Get project
  http.get(
    `${import.meta.env.BACKEND_URL}/projects/:project_id`,
    async ({ params }) => {
      if (!params.project_id) {
        return HttpResponse.json(
          { message: "Project ID is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        project: {
          ...mockProject,
          _id: params.project_id,
        },
      });
    },
  ),
  // Update project
  http.put(
    `${import.meta.env.BACKEND_URL}/projects/:project_id`,
    async ({ request, params }) => {
      const body = await request.json();

      if (!params.project_id) {
        return HttpResponse.json(
          { message: "Project ID is required." },
          { status: 400 },
        );
      } else if (!body.name) {
        return HttpResponse.json(
          { message: "Name is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        project: {
          ...mockProject,
          _id: params.project_id,
          name: body.name,
        },
      });
    },
  ),
  // Get all tasks from project
  http.get(
    `${import.meta.env.BACKEND_URL}/projects/:project_id/task`,
    async ({ params }) => {
      if (!params.project_id) {
        return HttpResponse.json(
          { message: "Project ID is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        tasks: [
          {
            ...mockTask,
            project_id: params.project_id,
          },
        ],
      });
    },
  ),
  // Add task to project
  http.post(
    `${import.meta.env.BACKEND_URL}/projects/:project_id/task`,
    async ({ request, params }) => {
      const body = await request.json();

      if (!params.project_id) {
        return HttpResponse.json(
          { message: "Project ID is required." },
          { status: 400 },
        );
      } else if (!body.name) {
        return HttpResponse.json(
          { message: "Name is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        task: {
          ...mockTask,
          project_id: params.project_id,
          name: body.name,
        },
      });
    },
  ),
  // Add user to project
  http.post(
    `${import.meta.env.BACKEND_URL}/projects/:project_id/user`,
    async ({ request, params }) => {
      const body = await request.json();

      if (!params.project_id) {
        return HttpResponse.json(
          { message: "Project ID is required." },
          { status: 400 },
        );
      } else if (!body.user_id) {
        return HttpResponse.json(
          { message: "User ID is required." },
          { status: 400 },
        );
      } else if (!body.role) {
        return HttpResponse.json(
          { message: "User role is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json(
        {
          message: `User ${body.user_id} added to project ${params.project_id}.`,
        },
        { status: 201 },
      );
    },
  ),
  // Update user in project
  http.put(
    `${import.meta.env.BACKEND_URL}/projects/:project_id/user`,
    async ({ request, params }) => {
      const body = await request.json();

      if (!params.project_id) {
        return HttpResponse.json(
          { message: "Project ID is required." },
          { status: 401 },
        );
      } else if (!body.user_id) {
        return HttpResponse.json(
          { message: "User ID is required" },
          { status: 400 },
        );
      } else if (!body.role) {
        return HttpResponse.json(
          { message: "User role is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json(
        {
          message: `User ${body.user_id}'s role updated in project ${params.project_id}.`,
        },
        { status: 200 },
      );
    },
  ),
  // Remove user from project
  http.delete(
    `${import.meta.env.BACKEND_URL}/projects/:project_id/user`,
    async ({ request, params }) => {
      const body = await request.json();

      if (!params.project_id) {
        return HttpResponse.json(
          { message: "Project ID is required." },
          { status: 400 },
        );
      } else if (!body.user_id) {
        return HttpResponse.json(
          { message: "User ID is required" },
          { status: 400 },
        );
      }

      return HttpResponse.json(
        {
          message: `User ${body.user_id} removed from project ${params.project_id}.`,
        },
        { status: 200 },
      );
    },
  ),
];

export default projectHandlers;
