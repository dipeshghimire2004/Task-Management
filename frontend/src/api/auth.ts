import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://127.0.0.1:8000/api';
interface UserTypes{
  username:string;
  email:string;
  password?:string;
}

//register new user

// export const registerUser = async (data: { username: string; email: string; password: string }) => {
export const registerUser = async (data: UserTypes) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register/`, data, { withCredentials: true });
    return response.data;
  } catch (error: any) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// export const googleAuth = async (data: UserTypes)=>{
//   try {
//     const response = await axios.post(`${BASE_URL}/auth/google/`,data,{withCredentials:true});
//     return response.data
//   } catch (error) {
//     console.error('Error occured during google registrations')
//     throw error
//   }
// }

/**
 * Log in a user and store the JWT in cookies.
 */
export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login/`, data, { withCredentials: true });

    // if (response.data.access) {
    //   // Set the token in cookies with secure and samesite attributes
    //   Cookies.set('access', response.data.access, {
    //     expires: 1,
    //     sameSite: 'Lax', // Change to 'Strict' or 'None' if necessary
    //     // secure: window.location.protocol === 'https:',
    //   });
    // }
    // console.log(response.data.data.access)
    return response;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw error;
  }
};

//  Log out the user and clear cookies.
 
export const logoutUser = async () => {
  try {
    const token = Cookies.get('access');
    await axios.post(
      `${BASE_URL}/auth/logout/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    Cookies.remove('access');
  } catch (error: any) {
    console.error('Error logging out:', error);
    throw error;
  }
};
