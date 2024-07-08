import React from "react";
import {
  Navbar,
  TaskCard,
  AddCard,
  EditUserCard,
  SuccessToast,
} from "../components";

const Test = () => {
  return (
    <div className="flex">
      {/* <Navbar />
      <EditUserCard /> */}
      <SuccessToast message="Success!" onClose={() => {}} />
    </div>
  );
};

export default Test;
