import { useState } from "react";
import { logo_title,Foambg,logo_blue } from "../assets";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { HiArrowRightCircle } from 'react-icons/hi2'

function loginUser(email, password) {
	fetch(`${import.meta.env.VITE_BACK_END_URL}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
		mode: "cors",
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.token) {
				document.cookie = `token=${data.token}; max-age=${60 * 60 * 24 * 7}`;
				window.location.href = `/dashboard?userid=${data.user._id}`; // TODO: change redirect to /dashboard
				console.log(`token:${data.token}`)
			} else {
				console.log(data.error);
			}
		})
		.catch((err) => console.error(err));
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
