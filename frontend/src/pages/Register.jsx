import { useState } from "react";
import { logo_title, Foambg } from "../assets";
import { FaCheckCircle } from "react-icons/fa";

function registerUser(name, email, password) {
  fetch(`${import.meta.env.VITE_BACK_END_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
    mode: "cors",
  })
    .then((res) => {
      if (res.ok) {
        window.location.href = "/login";
      } else {
        res.json().then((data) => console.log(data.error));
      }
    })
    .catch((err) => console.error(err));
}

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    registerUser(name, email, password);
  }

  return (
    <div className="min-h-screen items-center justify-center">
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${Foambg})` }}
      >
        <div className="h-[80%] w-[75%] max-w-md rounded-2xl bg-white px-6 py-3 shadow-md">
          <div className="text-center">
            <img src={logo_title} className="mx-auto" alt="Logo" />
          </div>
          <div className="mb-2 md:mt-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-2 md:mb-4">
                <div className="mb-2 px-1 md:mb-4 md:px-3">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="text"
                  >
                    Name:
                  </label>
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC] px-3 py-2 text-sm leading-tight text-white shadow placeholder:text-white focus:outline-none md:text-base"
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-2 px-1 md:mb-4 md:px-3">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="email"
                  >
                    Email:
                  </label>
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC] px-3 py-2 text-sm leading-tight text-white shadow placeholder:text-white focus:outline-none md:text-base"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-2 px-1 md:mb-4 md:px-3">
                  <label
                    className="mb-2 block text-sm font-bold text-gray-700"
                    htmlFor="password"
                  >
                    Password:
                  </label>
                  <input
                    className="focus:shadow-outline w-full appearance-none rounded border bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC] px-3 py-2 text-sm leading-tight text-white shadow placeholder:text-white focus:outline-none md:text-base"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-6 text-center md:mt-8">
                  <button className="mx-auto mb-2 mb-3 flex items-center justify-center rounded-3xl bg-green-400 text-white shadow-md hover:scale-105">
                    <span className="mr-[3px]">Sign Up!</span>
                    <FaCheckCircle />
                  </button>
                  <p className="text-[16px]">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-[#9F9AFF] hover:text-[#6388bf]"
                    >
                      Sign In Here!
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

export default Register;
