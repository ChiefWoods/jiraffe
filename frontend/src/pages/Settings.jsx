import React, { useEffect, useState } from 'react';
import {
  Navbar,
  AddCard,
  UpdateProject,
  AccessTable
} from '../components';

const Settings = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex ml-72 pl-36 w-[1000px] flex-col">
        {/* Project Settings */}
        <UpdateProject />
        {/* Access Control */}
        <AccessTable />
      </div>
    </div>
  );
};

export default Settings;
