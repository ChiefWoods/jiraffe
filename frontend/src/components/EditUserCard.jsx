import { useState } from "react";
import { capitalizeFirstLetter, nonAdminRoles } from "../utils.js";
import { RxCross1 } from "react-icons/rx";

const EditUserCard = ({ isOpen, user, closeCard, onEditUser }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);

  async function handleSubmit(e) {
    e.preventDefault();

    await onEditUser(user._id, selectedRole);
    closeCard();
  }

  function handleClose() {
    setSelectedRole(user.role);
    closeCard();
  }

  return (
    isOpen && (
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <form
          className="relative z-50 mx-auto my-auto flex h-[330px] w-[590px] max-w-full justify-between rounded-md border-2 bg-white p-6 shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-l mr-72 mt-1 font-bold text-blue-700">
                Edit User
              </p>
              <RxCross1
                className="mb-4 mt-1 cursor-pointer text-xl text-blue-800 hover:scale-105"
                onClick={handleClose}
              />
            </div>
            <div className="mt-4 flex">
              <p className="text-base font-semibold">Username</p>
            </div>
            <div className="mt-0 flex">
              <p className="ml-2 w-[500px] pl-0 pt-1 text-base font-bold text-blue-900">
                {user.name}
              </p>
            </div>
            <div className="mt-6 flex">
              <p className="text-base font-semibold">Role</p>
            </div>
            <div className="mt-2 flex">
              <select
                className="ml-1 h-10 w-[520px] rounded-md border-2 border-gray-300 bg-white pl-2"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {nonAdminRoles.map((role) => (
                  <option key={role} value={role}>
                    {capitalizeFirstLetter(role)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                className="rounded-md bg-transparent px-4 py-2 text-black hover:scale-105"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="ml-1 mr-3 rounded-md bg-blue-800 px-4 py-2 text-white hover:scale-105"
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default EditUserCard;
