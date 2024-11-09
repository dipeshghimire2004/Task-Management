import { useState } from 'react';
import { registerUser } from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setMessage('Registration successful!');
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-96 bg-gray-100 p-8 rounded-lg">
        <h2 className="text-2xl mb-6">Register</h2>
        <input type="text" name="username" placeholder="Username" className="mb-4 p-2 border" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="mb-4 p-2 border" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="mb-4 p-2 border" onChange={handleChange} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
