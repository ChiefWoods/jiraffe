import { useEffect, useReducer, useState } from "react";
import { logo_title,Foambg } from "../assets";
import { FaCheckCircle } from "react-icons/fa";
import { ErrorToast } from "../components";

async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      mode: 'cors',
    });

    if (response.ok) {
      return 'Registered Successfully!';
    } else {
      const data = await response.json();
      throw new Error(data.error);
    }
  } catch (error) {
    throw new Error('Error registering user:', error);
  }
}

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const [errorToast, setErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

	function handleSubmit(e) {
		e.preventDefault();

    if (!name || !email || !password) {
      setErrorMessage('Please fill out all fields');
      setErrorToast(true);
      return;
    }

		registerUser(name, email, password)
      .then((message) => {
        window.location.href = '/login';
        localStorage.setItem('registerSuccessToast', true);
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
	}

  useEffect(() => {
    try {
      if (localStorage.getItem('registerErrorToast') === 'true') {
        setErrorToast(true);
        setErrorMessage('Error registering user');
        localStorage.removeItem('registerErrorToast');
      }
    } catch (error) {
      console.error('Error checking for error toast:', error);
    }
  })

  useEffect(() => {
    if (errorToast) {
      const timer = setTimeout(() => {
        setErrorToast(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [errorToast]);

  const dismissToast = () => {
    setErrorToast(false);
  }

	return (
    <>
		<div className="min-h-screen justify-center items-center" >
			<div className="bg-cover bg-center flex items-center justify-center min-h-screen" style={{backgroundImage:`url(${Foambg})`}}>
				<div className="w-[75%] h-[80%] max-w-md px-6 py-3 bg-white rounded-2xl shadow-md ">
				<div className="text-center">
					<img src={logo_title} className="mx-auto" alt="Logo" />
				</div>
				<div className="mb-2 md:mt-4">
					<form onSubmit={handleSubmit}>
						<div className="mb-2 md:mb-4">
							<div className="mb-2 md:mb-4 px-1 md:px-3">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="text"
								>
									Name:
								</label>
								<input
									className="bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC] text-sm md:text-base  placeholder:text-white shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
									id="name"
									type="text"
									placeholder="Enter your name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="mb-2 md:mb-4 px-1 md:px-3">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="email"
								>
									Email:
								</label>
								<input
									className="bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC] placeholder:text-white text-sm md:text-base shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="mb-2 md:mb-4 px-1 md:px-3">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="password"
								>
									Password:
								</label>
								<input
									className="bg-gradient-to-r from-[#9F9AFF] to-[#A6C2EC]  placeholder:text-white text-sm md:text-base shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
									id="password"
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<div className="text-center  mt-6 md:mt-8">
								<button className="bg-green-400 mb-3 flex justify-center  mx-auto items-center rounded-3xl  mb-2 text-white shadow-md hover:scale-105 ">
									<span className="mr-[3px]">Sign Up!</span>
									<FaCheckCircle />
								</button>
								<p className="text-[16px]">
									Already have an account?{" "}
									<a
										href="/login"
										className="hover:text-[#6388bf] text-[#9F9AFF]"
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
    {errorToast && <ErrorToast message={errorMessage} onClose={dismissToast} />}
    </>
	);
};

export default Register;
