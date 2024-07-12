import { useEffect, useState } from "react";
import { nonAdminRoles, addUser, updateUser, deleteUser } from "../utils.js";
import { AddUserCard, EditUserCard, Toast } from "./index.js";
import { useToast } from "../contexts/ToastContext.jsx";
import {
  capitalizeFirstLetter,
  getProjectRole,
  getProjectUsers,
} from "../utils.js";

const roleStyles = {
  admin: "bg-blue-100 text-blue-700 px-2 py-1 rounded",
  member: "bg-green-100 text-green-700 px-2 py-1 rounded",
  viewer: "bg-orange-100 text-orange-700 px-2 py-1 rounded",
};

const UsersTable = ({ sessionUserID, currentProject: project }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [cardOpened, setCardOpened] = useState("");
  const { toastMessage, setToastMessage } = useToast();

  async function handleAddUser(projectID, email, role) {
    const { user, message } = await addUser(projectID, email, role);
    setUsers((prev) => [...prev, user]);
    setToastMessage(message);
  }

  async function handleEditUser(userID, role) {
    const { message } = await updateUser(project._id, userID, role);
    setUsers((prev) => {
      return prev.map((user) =>
        user._id === userID ? { ...user, role } : user,
      );
    });
    setToastMessage(message);
  }

  async function handleDeleteUser(projectID, userID) {
    const { message } = await deleteUser(projectID, userID);
    setUsers((prev) => prev.filter((user) => user._id !== userID));
    setToastMessage(message);
  }

  function AccessTableRow({ user }) {
    return (
      <tr className="h-[60px] text-left">
        <td className="max-w-[140px] py-2">{user.name}</td>
        <td className="max-w-[190px] py-2">{user.email}</td>
        <td className="max-w-[130px] py-2">
          <span className={roleStyles[user.role]}>
            {capitalizeFirstLetter(user.role)}
          </span>
        </td>
        {userRole === "admin" && userRole !== user.role && (
          <td className="max-w-[170px] py-2">
            <button
              className="mr-2 bg-gray-100 px-4 py-2 text-blue-700 hover:scale-105"
              onClick={() => {
                setSelectedUser(user);
                setCardOpened("editUser");
              }}
            >
              ✏️
            </button>
            <button
              className="bg-gray-100 px-4 py-2 text-red-700 hover:scale-105"
              onClick={() => handleDeleteUser(project._id, user._id)}
            >
              🗑️
            </button>
          </td>
        )}
      </tr>
    );
  }

  useEffect(() => {
    async function fetchData() {
      if (sessionUserID) {
        const allUsers = await getProjectUsers(project._id);
        setUsers(allUsers);

        const role = await getProjectRole(project._id, sessionUserID);
        setUserRole(role);
      } else {
        console.error("userID not found.");
      }
    }

    fetchData();
  }, []);

  return (
    <div className="mt-8 flex flex-col">
      <div className="ml-2 mt-8 flex w-full justify-between">
        <p className="mb-8 text-3xl font-bold text-blue-700">Users</p>
        {userRole === "admin" && (
          <button
            className="h-[34px] w-[110px] rounded bg-blue-700 p-0 text-base text-white hover:scale-105"
            onClick={() => setCardOpened("addUser")}
          >
            Add User
          </button>
        )}
      </div>
      <table className="ml-4 w-full table-auto border-collapse">
        <thead>
          <tr className="text-left">
            <th className="w-[140px] pb-[10px]">Name</th>
            <th className="w-[190px] pb-[10px]">Email</th>
            <th className="w-[130px] pb-[10px]">Role</th>
            {userRole === "admin" && (
              <th className="w-[170px] pb-[10px]">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            if (user.role === "admin") {
              return <AccessTableRow key={user._id} user={user} />;
            }
          })}
          {nonAdminRoles.map((role) => {
            return users.map((user) => {
              if (user.role === role) {
                return <AccessTableRow key={user._id} user={user} />;
              }
            });
          })}
        </tbody>
      </table>
      {toastMessage && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
      <AddUserCard
        isOpen={cardOpened === "addUser"}
        projectID={project._id}
        closeCard={() => setCardOpened("")}
        onAddUser={handleAddUser}
      />
      {selectedUser && (
        <EditUserCard
          isOpen={cardOpened === "editUser"}
          user={selectedUser}
          closeCard={() => setCardOpened("")}
          onEditUser={handleEditUser}
        />
      )}
    </div>
  );
};

export default UsersTable;
