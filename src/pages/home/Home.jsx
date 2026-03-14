import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../Api/axious";

import Navbar from "../../component/navbar/Navbar";
import Dashboard from "../../component/dashboard/Dashboard";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);

  const userName = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!id) navigate("/login"); // redirect if not logged in
  }, []);

  const showToast = (message, type = "success") => {
    if (type === "error") toast.error(message);
    else toast.success(message);
  };

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <Navbar userName={userName} onLogout={handleLogout} />

      <Dashboard
        expenses={expenses}
        fetchExpenses={fetchExpenses}
        role={role}
        userId={userId}
        showToast={showToast}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
