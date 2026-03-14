// src/components/AuthLayout.jsx
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div
      className="auth-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        className="auth-card"
        style={{ padding: "2rem", border: "1px solid #ccc" }}
      >
        {/* The Outlet renders the child route (Login or Register) */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
