import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTransactionsWithRedux } from "../redux/slices/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { setIndividualAdData } from "../redux/slices/individualAd";

const Transaction = ({ turnTransactionsToOff }) => {
    const dispatch = useDispatch();
    const transactions = useSelector((state) => state.transactions.data);
    const user = useSelector((state) => state.userData.data);
    const [activeTab, setActiveTab] = useState("selling");
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/transaction/${activeTab}/${user._id}`);
                const data = await response.json();
                dispatch(setTransactionsWithRedux(data.transactions));
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [activeTab, user._id, dispatch]);

    const handleStatusUpdate = async (transactionId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/transaction/${transactionId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus, userId: user._id }),
            });
            const result = await response.json();
            if (result.success) {
                const updatedTransactions = await fetch(
                    `http://localhost:8000/api/v1/transaction/${activeTab}/${user._id}`
                ).then((res) => res.json());
                dispatch(setTransactionsWithRedux(updatedTransactions.transactions));
            }
        } catch (error) {
            console.error("Error updating transaction status:", error);
        }
    };

    const handleRating = async (transactionId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/transaction/${transactionId}/rate`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rating, userId: user._id }),
            });
            const result = await response.json();
            if (result.success) {
                const updatedTransactions = await fetch(
                    `http://localhost:8000/api/v1/transaction/${activeTab}/${user._id}`
                ).then((res) => res.json());
                dispatch(setTransactionsWithRedux(updatedTransactions.transactions));
            }
        } catch (error) {
            console.error("Error updating transaction rating:", error);
        }
    };

    const addAdDataToRedux = async (adId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/posts/${adId}`);
            const result = await response.json();
            if (result.success) {
                dispatch(setIndividualAdData({ payload: result.ad }));
            }
        } catch (error) {
            console.error("Error updating transaction rating:", error);
        }
    };

    useEffect(() => {
        const modalElement = document.getElementById("transactionModal");
        modalElement.classList.add("translate-x-full");
        setTimeout(() => {
            modalElement.classList.remove("translate-x-full");
            modalElement.classList.add("translate-x-0");
        }, 10);
    }, []);

    return (
        <div
            id="transactionModal"
            className="fixed right-0 top-0 mt-4 mr-4 z-50 max-w-sm w-full transform transition-transform duration-500 ease-in-out translate-x-full"
        >
            <div className="bg-white shadow-lg rounded-lg overflow-hidden h-[90vh] flex flex-col">
                <div className="px-4 py-2 flex justify-between items-center border-b border-gray-300 bg-white text-orange-500 mb-2">
                    <h3 className="text-2xl font-semibold text-black">Transactions</h3>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-gray-400 hover:text-gray-900"
                        onClick={() => {
                            const modalElement = document.getElementById("transactionModal");
                            modalElement.classList.remove("translate-x-0");
                            modalElement.classList.add("translate-x-full");
                            setTimeout(() => {
                                turnTransactionsToOff();
                            }, 500);
                        }}
                    />
                </div>
                <div className="mx-2 my-2 flex justify-around bg-white border border-black rounded-lg">
                    <button
                        onClick={() => setActiveTab("selling")}
                        className={`w-1/2 p-2 text-center ${
                            activeTab === "selling" ? "font-bold text-white bg-orange-300 border-tl border-white rounded-lg" : "font-medium text-black bg-white border border-white rounded-lg"
                        }`}
                    >
                        Selling
                    </button>
                    <button
                        onClick={() => setActiveTab("buying")}
                        className={`w-1/2 p-2 text-center ${
                            activeTab === "buying" ? "font-bold text-white bg-orange-300 border-tl border-white rounded-lg" : "font-medium text-black bg-white border border-white rounded-lg"
                        }`}
                    >
                        Buying
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-grow bg-white scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-200">
                    {transactions?.length > 0 ? (
                        transactions.map((transaction) => (
                            <div
                                key={transaction?._id}
                                className="mb-4 p-3 bg-white hover:bg-orange-50 rounded-lg cursor-pointer transition-colors duration-200 border border-orange-300"
                            >
                                <NavLink
                                    to="/individualAd"
                                    onClick={() =>
                                        addAdDataToRedux(
                                            transaction.service
                                                ? transaction.service
                                                : transaction.job
                                                ? transaction.job
                                                : transaction.vehicle
                                                ? transaction.vehicle
                                                : transaction.mobile
                                        )
                                    }
                                >
                                    <div>
                                        <p className="font-medium text-orange-800">Transaction ID: {transaction?._id}</p>
                                        <p className="text-orange-700">Ad: {transaction?.adTitle}</p>
                                        <p className="text-orange-700">Status: {transaction?.status}</p>
                                        <p className="text-orange-700">Rating: {transaction?.rating || "Not rated yet"}</p>
                                    </div>
                                </NavLink>
                                {activeTab === "selling" && transaction?.status?.toLowerCase() === "pending" && (
                                    <button
                                        onClick={() => handleStatusUpdate(transaction._id, "in progress")}
                                        className="mt-2 bg-orange-500 text-white p-2 rounded"
                                    >
                                        Mark as In Progress
                                    </button>
                                )}

                                {activeTab === "buying" && transaction?.status?.toLowerCase() === "in progress" && (
                                    <button
                                        onClick={() => handleStatusUpdate(transaction._id, "Completed")}
                                        className="mt-2 bg-orange-500 text-white p-2 rounded"
                                    >
                                        Mark as Completed
                                    </button>
                                )}

                                {activeTab === "buying" && transaction?.status?.toLowerCase() === "completed" && !transaction?.rating && (
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                            placeholder="Rate (1-5)"
                                            className="border border-orange-300 p-2 rounded mr-2"
                                        />
                                        <button
                                            onClick={() => handleRating(transaction._id)}
                                            className="bg-orange-500 text-white p-2 rounded"
                                        >
                                            Submit Rating
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-sm">No transactions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transaction;
