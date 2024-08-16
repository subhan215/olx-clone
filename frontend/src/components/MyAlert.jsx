import React from "react"
const MyAlert = ({setShowAlert , alertVariant , alertMessage}) => {
    return(
<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className={`bg-white w-full max-w-md p-6 rounded-lg shadow-lg ${alertVariant === "success" ? "border-green-500" : "border-red-500"} border-t-4`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {alertVariant === "success" ? "Success" : "Error"}
            </h3>
            
          </div>
          <p className="text-gray-700">{alertMessage}</p>
          <div className="mt-4 text-right">
            <button
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => setShowAlert(false)}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
}
export default MyAlert