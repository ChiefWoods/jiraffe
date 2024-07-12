import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, getUserProjects } from "../utils.js";
import { logo_blue } from "../assets";
import { IoIosUndo } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { IconContext } from "react-icons";

const Navbar = ({ sessionUserID, currentProject }) => {
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    document.cookie = `token=; max-age=0`;
    navigate("/login");
  }

  useEffect(() => {
    const fetchData = async () => {
      const projects = await getUserProjects(sessionUserID);
      const user = await getUser(sessionUserID);

      setUserName(user.name);
      setProjects(
        projects.filter((project) => project._id !== currentProject._id),
      );
    };

    fetchData();
  }, [currentProject]);

  return (
    <div className="left-0 top-0 z-10 flex h-screen min-w-[250px] flex-col items-center bg-[#0052CC] px-4 py-6">
      <Link to={`/dashboard/${currentProject._id}`}>
        <img src={logo_blue} alt="Logo" className="w-48" />
      </Link>
      <p className="mb-[60px] cursor-default font-mono text-[20px] font-bold tracking-wide text-white">
        Jiraffe.
      </p>
      <ul className="text-white-500 flex w-full flex-col gap-y-3">
        {currentProject && (
          <li
            key={currentProject._id}
            className="cursor-default tracking-wider text-white"
          >
            <p className="block w-full rounded-[16px] bg-blue-600 px-[20px] py-[6px] text-[15px] font-bold focus:outline-none">
              {currentProject.name}
            </p>
          </li>
        )}
        {projects.map((project) => (
          <li
            key={project._id}
            className="tracking-wider text-white hover:scale-105"
          >
            <Link to={`/dashboard/${project._id}`}>
              <button
                type="button"
                className={`block w-full bg-transparent text-left text-[15px] text-white focus:outline-none ${
                  project === currentProject ? "font-bold" : "font-light"
                }`}
              >
                {project.name}
              </button>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mb-6 flex flex-grow flex-col justify-end">
        <ul className="flex flex-col items-center space-y-[30px]">
          <li className="flex w-full items-center justify-center">
            <IconContext.Provider value={{ color: "white " }}>
              <FaUser />
            </IconContext.Provider>
            <p className="px-4 py-2 text-center text-sm font-bold tracking-wider text-white">
              {userName}
            </p>
          </li>
          <li className="flex items-center justify-center tracking-wide">
            <button
              className="mb-[20px] flex w-fit items-center rounded-lg bg-white px-2 py-1 text-[#0052CC] transition-colors duration-300 hover:scale-105"
              onClick={handleLogout}
            >
              <span>
                <IoIosUndo className="mr-[16px] text-2xl" />
              </span>
              <p className="text-base font-bold">Log Out</p>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
