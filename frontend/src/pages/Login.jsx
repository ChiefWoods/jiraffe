import { useState } from "react";
import { logo_title } from "../assets";
import { FaArrowRightToBracket } from "react-icons/fa6";

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
				window.location.href = "/test"; // TODO: change redirect to /dashboard
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
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<img src={logo_title} className="mx-auto" alt="Logo" />
				</div>
				<div className="mt-4">
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<div className="mb-4">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="email"
								>
									Email:
								</label>
								<input
									className="bg-[#DEDCFF] placeholder:text-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="mb-4">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="password"
								>
									Password:
								</label>
								<input
									className="bg-[#DEDCFF] placeholder:text-black shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<div className="text-center">
								<button className="bg-[#549EFF] hover:bg-blue-500 flex justify-center  mx-auto items-center rounded-3xl w-[40%] mb-2 text-white ">
									<span className="mr-[3px]">Sign In!</span>
									<FaArrowRightToBracket />
								</button>
								<p className="text-[16px]">
									Don't have an account?{" "}
									<a
										href="/register"
										className="hover:text-blue-600 text-blue-400"
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
	);
};

export default Login;
