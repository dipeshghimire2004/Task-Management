import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { Input, Button } from '../components'; // Custom components for input and button
import toast, { Toaster } from 'react-hot-toast';
import { loginUser } from '../api/auth';
import image from '../assets/login.webp'
import { login } from '@/features/authSlice';
import { useAppDispatch } from '@/store/Hooks';
import logo from '../assets/alarm.gif'

type FormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle form submission
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
       const response=await loginUser(data);
      const udata=dispatch(login({userdata:response.data, accessToken:response.data.access}))
      console.log(response)
      console.log(udata)
      toast.success("Login successful!");

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
      reset();
    } catch (error) {
      // Handle Axios-specific errors
      // if (axios.isAxiosError(error)) {
      //   toast.error(error.message || "Network connection issue, please try again!");
      // } else {
        toast.error("An unexpected error occurred");
      // }
    }
  };

  return (
    <div className="flex items-center justify-center mt-24 p-10 ">
      {/* Toast notifications */}
      <Toaster />
      <div>


        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className='flex items-center space-x-4 border-b-2 mb-4'>
            <img className='w-16 h-16 ' src={logo} alt='' />
            <h2 className="text-4xl font-semibold text-center">Login</h2>
          </div>

          {/* Email Input Field */}
          <div className="mb-4">
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/,
                  message: 'Please enter a valid email',
                },
              })}
              className="border border-gray-300 rounded-md w-full p-2"
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>

          {/* Password Input Field */}
          <div className="mb-4 relative">
            <Input
              label="Password"
              id="password"
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
              className="border border-gray-300 rounded-md w-full p-2 pr-10"
            />
            {/* Toggle password visibility button */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              // bgColor="transparent"
              // textColor=""
              className="absolute top-3/4 right-2 transform -translate-y-2/3 text-gray-500"
            >
              {passwordVisible ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>

          {/* Submit Button */}
          <div className="mb-6">
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </Button>
          </div>

          {/* Link to Register Page */}
          <div className="flex justify-center items-center">
            <p className="mr-2">Don't have an account?</p>
            <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
          </div>
        </form>
      </div>
      <div>
        <img src={image} alt="" />
      </div>
    </div>
  );
};

export default Login;
