import { useEffect, useState } from "react";
import { useToast } from "../contexts/ToastContext.jsx";
import { getProjectRole, updateProject, getUser } from "../utils.js";
import { Toast } from "./index.js";

const ProjectDetails = ({
  sessionUserID,
  currentProject: project,
  setCurrentProject,
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectLead, setProjectLead] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [projectNameError, setProjectNameError] = useState(false);
  const { toastMessage, setToastMessage } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();

    if (projectName) {
      setProjectNameError(false);
      await updateProject(project._id, { name: projectName });
      setCurrentProject((prev) => ({ ...prev, name: projectName }));
      setToastMessage("Project updated successfully.");
    } else {
      setProjectNameError(true);
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (sessionUserID && project._id) {
        setProjectName(project.name);

        const user = await getUser(project.admin);
        setProjectLead(user.name);

        const role = await getProjectRole(project._id, sessionUserID);
        setUserRole(role);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="relative w-full">
      <form className="mt-12 flex flex-col" onSubmit={handleSubmit}>
        <p className="mb-8 text-3xl font-bold text-blue-700">Project Details</p>
        <div className="ml-2 flex">
          <div className="mr-8 flex flex-col">
            <label
              className="mb-2 text-lg font-semibold text-black"
              htmlFor="project-name"
            >
              Project Name
            </label>
            <input
              className={`max-w-[300px] rounded border border-gray-300 p-2 ${userRole === "admin" ? "bg-white" : "pointer-events-none bg-gray-200"}`}
              type="text"
              id="project-name"
              name="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              readOnly={userRole !== "admin"}
              tabIndex={userRole === "admin" ? 0 : -1}
            />
            {projectNameError && (
              <p className="mb-[-20px] ml-[6px] mt-2 text-sm text-red-600">
                Project name cannot be empty.
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label
              className="mb-2 text-lg font-semibold text-black"
              htmlFor="project-lead"
            >
              Project Lead
            </label>
            <input
              type="text"
              id="project-lead"
              value={projectLead}
              readOnly
              tabIndex={-1}
              className="pointer-events-none max-w-[300px] cursor-not-allowed rounded border border-gray-300 bg-gray-200 p-2 text-base"
            />
          </div>
        </div>
        <div className="ml-2 mt-8 flex">
          {userRole === "admin" && (
            <div className="flex flex-col">
              <button
                className="w-[140px] rounded bg-blue-700 p-2 text-white hover:scale-105"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </form>
      {toastMessage && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
