import React from 'react';
import {
  Navbar,
  UpdateProject,
  AccessTable
} from '../components';

const Settings = () => {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-full px-10 py-5 flex justify-center">
        <div className="flex flex-col w-full max-w-screen-lg">
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
