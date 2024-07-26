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
            const response = await fetch('http://localhost:8000/api/v1/users/signup' , {
                headers : {
                  'Content-Type' : "application/json"
                } , 
                method: "POST" , 
                body: JSON.stringify(data)
              })
          console.log(response);
          setSuccessMessage(response.data.message)
          setPasswordError('');
          setEmailError('')
        } catch (error) {
          if(error.response.data.statuscode === 400){
            setPasswordError(error.response.data.message);
            setEmailError('')
          }else if(error.response.data.statuscode === 401){
            setEmailError(error.response.data.message)
            setPasswordError('')
          }
        }
      };
  return (
    <>
          <div className="registration-form max-w-md mx-auto p-6 bg-white shadow-md rounded-lg ">
            <form id="registerForm" className="mt-20 " onSubmit={handleSubmit}>
              <div className="relative mb-4">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your Full Name"
                  className="input-field w-full p-3 pl-10 border border-gray-300 rounded"
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
                  className="input-field w-full p-3 pl-10 border border-gray-300 rounded"
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
                  className="input-field w-full p-3 pl-10 border border-gray-300 rounded"
                  value={data.password}
                  onChange={handleFormData}
                  required
                />
              </div>
              {passwordError && (
                <div>
              <div
                id="error-message"
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mt-4"
              >
                {passwordError}
              </div>
              </div>
            )}
              <div className="relative mb-4">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="input-field w-full p-3 pl-10 border border-gray-300 rounded"
                  value={data.confirmPassword}
                  onChange={handleFormData}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              >
                Register
              </button>
            </form>
            {/* <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account? <a href={props.loginPageLink} className="text-green-500">Login</a>
            </p> */}
            {successMessage && (
              <div
                id="error-message"
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center mt-4"
              >
                {successMessage}
              </div>
            )}
          </div>
        </>
  )
}

export default SignUp

