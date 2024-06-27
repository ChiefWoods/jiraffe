import { useState } from "react";
import { logo_title,Foambg,logo_blue } from "../assets";
import { FaArrowRightToBracket } from "react-icons/fa6";

async function fetchProjectID(token, userID) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/project/user/${userID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return {
        projectID: data._id,
        projectName: data.name
      };
    } else {
		console.log(data.projectID)
      throw new Error('Failed to fetch projectID');
    }
  } catch (error) {
    console.error('Error fetching projectID:', error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/auth/login`, {
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

    const data = await response.json();

    if (data.token) {
      document.cookie = `token=${data.token}; max-age=${60 * 60 * 24 * 7}`;
      const projectData = await fetchProjectID(data.token, data.user._id);
      console.log(projectData)
      console.log("project ID:", projectData.projectID);
      console.log("token:", data.token);

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
		<div className="min-h-screen justify-center items-center" >
			<div className="bg-cover bg-center flex items-center justify-center min-h-screen" style={{backgroundImage:`url(${Foambg})`}}>
			<div className="w-[75%] max-w-md px-6 py-3 bg-white rounded-2xl shadow-md">
				<div className="text-center">
					<img src={logo_title} className="mx-auto" alt="Logo" />
				</div>
				<div className="mt-4">
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<div className="mb-4 px-3 px-1 md:px-3">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="email"
								>
									Email:
								</label>
								<input
									className="bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC] text-white text-sm md:text-base  placeholder:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="mb-4 px-3 px-1 md:px-3">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="password"
								>
									Password:
								</label>
								<input
									className="bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC] text-white text-sm md:text-base placeholder:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							
							<div className="text-center mt-6 md:mt-8">
									<button className="bg-[#EC53B0] mb-3 flex justify-center  mx-auto items-center rounded-3xl mb-2 text-white shadow-md hover:scale-105  ">
									<span className="mr-[3px]">Sign In!</span>
									<FaArrowRightToBracket />
									</button>
									
								
								<p className="text-[16px]">
									Don't have an account?{" "}
									<a
										href="/register"
										className="hover:text-[#6388bf] text-[#9F9AFF]"
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
