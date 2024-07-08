import React from "react";
import { Navbar, UpdateProject, AccessTable } from "../components";

const Settings = () => {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="flex w-full justify-center px-10 py-5">
        <div className="flex w-full max-w-screen-lg flex-col">
          {/* Project Settings */}
          <UpdateProject />
          {/* Access Control */}
          <AccessTable />
        </div>
      </div>
    </div>
  );
};

export default Settings;
