import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";

async function fetchAllUsers() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/user`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return data.users;
    } else {
      throw new Error("Failed to fetch all users");
    }
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

function gatherAllEmails(allUsers) {
  const emails = {};
  allUsers.forEach((user) => {
    emails[user.email] = user._id;
  });
  return emails;
}

async function addUserToProject(projectId, userId, userRole) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_END_URL}/project/${projectId}/user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          user_id: userId,
          role: userRole,
        }),
      },
    );

    if (response.ok) {
      return "User added to project";
    } else {
      const data = await response.json();
      console.error(data.message);
    }
  } catch (error) {
    console.error("Error adding user to project:", error);
  }
}

const AddCard = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const rolesArray = ["Viewer", "Member"];

  useEffect(() => {
    if (isOpen) {
      fetchAllUsers()
        .then((users) => {
          setAllUsers(users);
        })
        .catch((error) => {
          console.error("Error fetching all users:", error);
        });
    }
  }, [isOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    const emails = gatherAllEmails(allUsers);
    const userId = emails[email];
    if (userId) {
      const message = await addUserToProject(
        projectId,
        userId,
        role.toLowerCase(),
      );
      if (message) {
        localStorage.setItem("showAddUserToast", "true");
        onSuccess(); // Notify parent component
      }
    } else {
      console.error("Email not found");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div> {/* Overlay */}
      <div className="relative z-50 mx-auto flex h-[360px] w-[600px] max-w-full flex-col rounded-md border-2 bg-white p-6 shadow-md">
        <div className="flex">
          <p className="mr-auto mt-1 text-xl font-bold text-blue-700">
            Add People to Project
          </p>
          <RxCross1
            className="mb-4 mt-1 cursor-pointer text-xl text-blue-800"
            onClick={onClose}
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
          <div className="mt-6 flex">
            <p className="font-semibold">Role</p>
          </div>
          <div className="mt-2 flex">
            <select
              className="ml-1 h-10 w-[520px] rounded-md border-2 border-gray-300 pl-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {rolesArray.map((role, index) => (
                <option key={index}>{role}</option>
              ))}
            </select>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-transparent px-4 py-2 text-black"
              onClick={onClose}
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
  );
};

export default AddCard;
