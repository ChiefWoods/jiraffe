import { useState } from "react";
import { capitalizeFirstLetter, nonAdminRoles } from "../utils.js";
import { RxCross1 } from "react-icons/rx";

const AddUserCard = ({ isOpen, projectID, closeCard, onAddUser }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (email) {
      await onAddUser(projectID, email, role);
      closeCard();
      setEmail("");
      setRole("viewer");
    } else {
      setErrorMessage("Email is required.");
    }
  }

  function handleClose() {
    setErrorMessage("");
    closeCard();
  }

  return (
    isOpen && (
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative z-50 mx-auto flex w-[600px] max-w-full flex-col rounded-md border-2 bg-white p-6 shadow-md">
          <div className="flex">
            <p className="mr-auto mt-1 text-xl font-bold text-blue-700">
              Add People to Project
            </p>
            <RxCross1
              className="mb-4 mt-1 cursor-pointer text-xl text-blue-800"
              onClick={handleClose}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-6 flex">
              <p className="font-semibold">Email</p>
            </div>
            <div className="mt-2 flex">
              <input
                type="text"
                className="ml-1 h-10 w-[520px] rounded-md border-2 border-gray-300 pl-2"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errorMessage && (
              <div className="mt-2 flex">
                <p className="mb-[-100px]` ml-[10px] text-sm text-red-600">
                  {errorMessage}
                </p>
              </div>
            )}
            <div className="mt-6 flex">
              <p className="font-semibold">Role</p>
            </div>
            <div className="mt-2 flex">
              <select
                className="ml-1 h-10 w-[520px] rounded-md border-2 border-gray-300 bg-white pl-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {nonAdminRoles.map((role) => (
                  <option key={role} value={role}>
                    {capitalizeFirstLetter(role)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="rounded-md bg-transparent px-4 py-2 text-black"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 rounded-md bg-blue-800 px-4 py-2 text-white"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddUserCard;
