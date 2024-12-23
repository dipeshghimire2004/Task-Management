import {initializeApp} from 'firebase/app'
// import {getAnalytics} from 'firebase/analytics';
import {getAuth, GoogleAuthProvider, signInWithPopup, UserCredential} from 'firebase/auth';
import axios from 'axios';
import Cookies from 'js-cookie';

const firebaseConfig={
    apiKey:'AIzaSyBs0uC1-EUaVC_ni-MzLiahUo1JbbHzpqU',
    authDomain:'taskmanagement-4f7c8.firebaseapp.com',
    projectId:'taskmanagement-4f7c8',
    storageBucket:'taskmanagement-4f7c8.firebasestorage.app',
    messagingSenderId:'243976396973',
    appId:'1:243976396973:web:de9a61cc72cc30ed4a6624',
    measurementId:'G-J6HZHZ8KR1'        //#optional to latter version
};

//Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// export const SignInWithGoogle=async()=>{
//   try {
//     const response= await signInWithPopup(auth, googleProvider)
//     return response.user
//   } catch (error) {
//     throw error
//   }  
// };

// const analytics=getAnalytics(app);
export const SignInWithGoogle=async():Promise<void>=>{
try {
  // Google access token to access the google API
  const result:UserCredential =await signInWithPopup(auth, googleProvider)
  const credential =  GoogleAuthProvider.credentialFromResult(result)
  const token = credential?.accessToken;
  // const token = credential?.idToken;   we can use one of them
  //signed-in user info
  const user = result.user;

  const response =await axios.post<{access:string; refresh:string }>('http://127.0.0.1:8000/api/auth/google-login',{token:token,});

  const {access, refresh} =response.data

    Cookies.set('access',access);
    Cookies.set('refresh',refresh);
} 
catch(error:any){
    const errorCode=error.code;
    const errorMessage=error.message;
    // The email of the user's account used
    const email = error?.customData?.email;
    //auth credential type
    const credential=GoogleAuthProvider.credentialFromError(error)
    console.error("Error Details: ", {errorCode, errorMessage, email, credential})
}
}