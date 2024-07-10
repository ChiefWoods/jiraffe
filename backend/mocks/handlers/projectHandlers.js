import { http, HttpResponse } from "msw";
import { mockProject, mockTask, mockUser } from "../mockData";

const projectHandlers = [
  // Get all projects
  http.get(`${import.meta.env.VITE_BACKEND_URL}}/projects`, () => {
    return HttpResponse.json({
      projects: [mockProject],
    });
  }),
  // Get project
  http.get(
    `${import.meta.env.VITE_BACKEND_URL}}/projects/:project_id`,
    ({ params }) => {
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
    `${import.meta.env.VITE_BACKEND_URL}}/projects/:project_id`,
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
    `${import.meta.env.VITE_BACKEND_URL}}/projects/:project_id/tasks`,
    ({ params }) => {
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
    `${import.meta.env.VITE_BACKEND_URL}}/projects/:project_id/tasks`,
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
    `${import.meta.env.VITE_BACKEND_URL}}/projects/:project_id/users`,
    async ({ request, params }) => {
      const body = await request.json();

      if (!params.project_id) {
        return HttpResponse.json(
          { message: "Project ID is required." },
          { status: 400 },
        );
      } else if (!body.email) {
        return HttpResponse.json(
          { message: "Email is required." },
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
          message: `User ${mockUser.name} added to project ${mockProject.name}.`,
        },
        { status: 201 },
      );
    },
  ),
  // Update user in project
  http.put(
    `${import.meta.env.VITE_BACKEND_URL}}/projects/:project_id/users`,
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
          message: `${mockUser.name}'s role updated in project ${mockProject.name}.`,
        },
        { status: 200 },
      );
    },
  ),
  // Remove user from project
  http.delete(
    `${import.meta.env.VITE_BACKEND_URL}}/projects/:project_id/users`,
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
          message: `${mockUser.name} removed from project ${mockProject.name}.`,
        },
        { status: 200 },
      );
    },
  ),
];

export default projectHandlers;
