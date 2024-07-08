import { http, HttpResponse } from "msw";

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

const taskHandlers = [
  // Get task
  http.get(
    `${import.meta.env.BACKEND_URL}/tasks/:task_id`,
    async ({ params }) => {
      if (!params.task_id) {
        return HttpResponse.json(
          { message: "Task ID is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        task: {
          ...mockTask,
          _id: params.task_id,
        },
      });
    },
  ),
  // Update task
  http.put(
    `${import.meta.env.BACKEND_URL}/tasks/:task_id`,
    async ({ request, params }) => {
      if (!params.task_id) {
        return HttpResponse.json(
          { message: "Task ID is required." },
          { status: 400 },
        );
      }

      const body = await request.json();

      if (!body.name && !body.desc && !body.status && !body.assignees?.length) {
        return HttpResponse.json(
          { message: "At least one field is required." },
          { status: 400 },
        );
      } else if (
        body.status &&
        !["TO DO", "IN PROGRESS", "DONE"].includes(body.status)
      ) {
        return HttpResponse.json(
          {
            message:
              "Only status of 'TO DO', 'IN PROGRESS' and 'DONE' are allowed.",
          },
          { status: 400 },
        );
      }

      return HttpResponse.json(
        {
          task: {
            ...mockTask,
            _id: params.task_id,
            ...body,
          },
        },
        {
          status: 200,
        },
      );
    },
  ),
  // Delete task
  http.delete(
    `${import.meta.env.BACKEND_URL}/tasks/:task_id`,
    async ({ params }) => {
      if (!params.task_id) {
        return HttpResponse.json(
          { message: "Task ID is required." },
          { status: 400 },
        );
      }

      return HttpResponse.json(
        { message: `Task ${params.task_id} deleted.` },
        { status: 200 },
      );
    },
  ),
];

export default taskHandlers;
