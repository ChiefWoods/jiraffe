import { Navbar, ProjectDetails, UsersTable } from "../components";

const Settings = ({ sessionUserID, currentProject, setCurrentProject }) => {
  return (
    <div className="flex flex-row">
      <Navbar
        sessionUserID={sessionUserID}
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
      />
      <div className="flex w-full justify-center px-10 py-5">
        <div className="flex w-full max-w-screen-lg flex-col">
          <ProjectDetails
            sessionUserID={sessionUserID}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
          />
          <UsersTable
            sessionUserID={sessionUserID}
            currentProject={currentProject}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
