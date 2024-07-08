import { useState } from "react";
import { logo_title, Foambg, logo_blue } from "../assets";
import { FaArrowRightToBracket } from "react-icons/fa6";

async function fetchProjectID(token, userID) {
  const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch((err) => console.log(err));

  const data = await res.json();

  const project = data.projects.find(
    (project) => project.admin.toString() === userID,
  );

  return {
    projectID: project._id,
    projectName: project.name,
  };
}

async function loginUser(email, password) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      mode: "cors",
    });

    const data = await res.json();

    if (data.token) {
      document.cookie = `token=${data.token}; max-age=${60 * 60 * 24 * 7}`;
      const projectData = await fetchProjectID(data.token, data.user._id);

      // TODO: change redirect to /dashboard
      window.location.href = `/dashboard?userid=${data.user._id}&projectid=${projectData.projectID}`;
    } else {
      console.log(data.error);
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    loginUser(email, password);
  }

  return (
    <div className="min-h-screen items-center justify-center">
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${Foambg})` }}
      >
        <div className="w-[75%] max-w-md rounded-2xl bg-white px-6 py-3 shadow-md">
          <div className="text-center">
            <img src={logo_title} className="mx-auto" alt="Logo" />
          </div>
          <div className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="mb-4 px-3 md:px-3">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="email"
                  >
                    Email:
                  </label>
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC] px-3 py-2 text-sm leading-tight text-gray-700 text-white shadow placeholder:text-white focus:outline-none md:text-base"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4 px-3 md:px-3">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="password"
                  >
                    Password:
                  </label>
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC] px-3 py-2 text-sm leading-tight text-gray-700 text-white shadow placeholder:text-white focus:outline-none md:text-base"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-6 text-center md:mt-8">
                  <button className="mx-auto mb-3 flex items-center justify-center rounded-3xl bg-[#EC53B0] text-white shadow-md hover:scale-105">
                    <span className="mr-[3px]">Sign In!</span>
                    <FaArrowRightToBracket />
                  </button>

                  <p className="text-[16px]">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="text-[#9F9AFF] hover:text-[#6388bf]"
                    >
                      Sign up now!
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
