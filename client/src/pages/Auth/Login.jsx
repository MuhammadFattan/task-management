import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from "react-router-dom";
import Input from '../../components/Inputs/Input';
import { validatedEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import UserContext from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  // Handle login from submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validatedEmail(email)) {
      setError("Please enter a valid email address!");
      return;
    }

    if (!password) {
      setError("Please enter the password!");
      return;
    }

    setError("");

    //Login API CALL
    try {
      const respone = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = respone.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(respone.data);

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.respone && error.respone.data.message) {
        setError(error.respone.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-stale-700 mt-[5px] mb-6'>
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          /> 
          
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Character"
            type="password"
          /> 

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='sumbit' className='btn-primary'>
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account? {" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login