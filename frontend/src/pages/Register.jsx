import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils";
import { logo_title, Foambg } from "../assets";
import { FaUserPlus } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (name && email && password) {
      await registerUser(name, email, password);
      navigate("/login");
    } else if (!name && !email && !password) {
      setErrorMessage("Please fill out all fields.");
    } else if (!name) {
      setErrorMessage("Name is required.");
    } else if (!email) {
      setErrorMessage("Email is required.");
    } else if (!password) {
      setErrorMessage("Password is required.");
    }
  }

  return (
    <>
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
                <div className="flex flex-col gap-y-4">
                  <div className="px-1 md:px-3">
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
                  <div className="px-1 md:px-3">
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
                  <div className="px-1 md:px-3">
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
                  {errorMessage && (
                    <p className="px-3 text-sm text-red-600">{errorMessage}</p>
                  )}
                  <div className="text-center md:mt-4">
                    <button className="mx-auto mb-3 flex w-[200px] items-center justify-center rounded-3xl bg-purple-700 text-white shadow-md hover:scale-105">
                      <span className="mr-[10px]">Sign Up</span>
                      <FaUserPlus />
                    </button>
                    <Link to="/login">
                      <p className="inline text-[16px] text-[#9F9AFF] hover:text-[#6388bf]">
                        Already have an account?{" "}
                      </p>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
