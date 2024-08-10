import { Link } from 'react-router-dom';

const React = require('react');
const { useState } = require('react');
const FontAwesomeIcon = require('@fortawesome/react-fontawesome').FontAwesomeIcon;
const faLock = require('@fortawesome/free-solid-svg-icons').faLock;
const faUser = require('@fortawesome/free-solid-svg-icons').faUser;
const faEnvelope = require('@fortawesome/free-solid-svg-icons').faEnvelope;
function SignUp() {
    const [data, setData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      const [successMessage, setSuccessMessage] = useState('');
      const [passwordError, setPasswordError] = useState('');
      const [emailError, setEmailError] = useState('');    
      const handleFormData = (e) => {
        const { name, value } = e.target;
        setData({
          ...data,
          [name]: value,
        });
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log('Sending data:', data);
          let response = await fetch('http://localhost:8000/api/v1/users/signup', {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ ...data }),
          });
      
          if (response.success) {
            alert('Account has been created')
            const errorData = await response.json();
            console.log('Error:', errorData.message);
            // Handle specific error messages here
            return;
          }else{
            alert('Error:',response.error)
          }
      
          response = await response.json();
          console.log('Response:', response);
          // Handle success response here
        } catch (error) {
          console.log('Fetch error:', error);
        }
      };
  return (
    <>
          <div className='min-h-screen py-16 px-4 flex justify-center items-center'>
        <div className="flex max-w-3xl w-full">
          <div className="w-1/2 flex flex-col justify-center items-start bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-l-lg">
            <h1 className="text-4xl text-orange-600 font-extrabold mb-8"><div>Khareed.</div>o.<div>Farokht</div></h1>
            <h2 className="text-4xl text-white font-semibold mb-2">Create your account</h2>
            <Link to="/signin" className="text-orange-600 text-lg no-underline hover:text-orange-700 transition duration-300">Already have an account? Sign in</Link>
          </div>
          <div className="w-1/2 bg-white p-6 rounded-r-lg border border-black">
            <form id="registerForm" onSubmit={handleSubmit}>
              {/* <div className='border-b border-black font-extrabold text-orange-400 mb-6 flex justify-start'>
                <h1 className='font-bold'>Sign Up</h1>
              </div> */}
              <div className="relative mb-4 mt-8">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your Full Name"
                  className="w-full px-8 py-3 border border-black rounded"
                  value={data.fullName}
                  onChange={handleFormData}
                  required
                />
              </div>
              <div className="relative mb-4">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  className="w-full px-8 py-3 border border-black rounded"
                  value={data.email}
                  onChange={handleFormData}
                  required
                />
              </div>
              {emailError && (
                <div
                  id="error-message"
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mt-4"
                >
                  {emailError}
                </div>
              )}
              <div className="relative mb-4">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  className="w-full px-8 py-3 border border-black rounded"
                  value={data.password}
                  onChange={handleFormData}
                  required
                />
              </div>
              <div className="relative mb-4">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-8 py-3 border border-black rounded"
                  value={data.confirmPassword}
                  onChange={handleFormData}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded transform hover:scale-105 transition duration-300 ease-in-out"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
        </>
  )
}

export default SignUp

