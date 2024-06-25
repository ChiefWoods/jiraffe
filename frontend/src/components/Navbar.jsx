import { logo_blue } from "../assets";
import { MdDashboard } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { IoIosUndo } from "react-icons/io";

const DashboardLink = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get('userid');

  const navigateToDashboard = (e) => {
    e.preventDefault();
    window.location.href = `/dashboard?userid=${userId}`;
  }

  return (
    <li className="flex items-center mr-2">
      <span>
        <MdDashboard className="text-white text-2xl mx-2" />
      </span>
      <a href="/dashboard" className="text-white hover:underline ml-2" onClick={navigateToDashboard}>
        Dashboard
      </a>
    </li>
  );
}

const Navbar = ({
	current_project = "Project 1",
	projects = ["Project 1", "Project 2", "Project 3"],
}) => {
  function handleLogout(e) {
    e.preventDefault();
    document.cookie = `token=; max-age=0`;
    window.location.href = "/login";
  }

	return (
		<div className="z-10 flex flex-col h-screen bg-[#0052CC] w-[230px] top-0 left-0 px-0 py-6">
			<img src={logo_blue} alt="Logo" className="w-48 mb-4" />
			<ul className="text-white-500 mx-2 pl-0 ml-2">
				{projects.map((project, index) => (
					<li key={index} className={`mb-2 bg-[#0052CC] text-white`}>
						<button
							className={`block w-full text-left bg-[#0052CC] ${
								project === current_project ? "font-extrabold" : "font-light"
							}`}
						>
							{project}
						</button>
					</li>
				))}
			</ul>
			<div className="flex-grow flex flex-col justify-end mb-6">
				<ul className="flex flex-col space-y-6 ml-6">
					<DashboardLink />
					<li className="flex items-center mr-2">
						<button className="flex items-center bg-white text-[#0052CC] hover:text-white hover:bg-[#0052CC] ml-1 px-2 py-1 rounded-lg w-[160px] transition-colors duration-300" onClick={handleLogout}>
							<span>
								<IoIosUndo className="text-2xl mr-3" />
							</span>
							<p>Log Out</p>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Navbar;
