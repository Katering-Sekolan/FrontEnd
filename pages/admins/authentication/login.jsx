import React from "react";
import AdminLoginForm from "@/components/AdminLoginForm";
import SweatAlertTimer from "@/config/SweatAlert/timer";

function AdminLoginPage() {
  const handleAdminLogin = ({ username, password }) => {
    // Handle login logic API & Autehntication
    //misal
    if (username === "admin" && password === "password123") {
      SweatAlertTimer("Login Berhasil", "success");
    } else {
      SweatAlertTimer("Username dan Password Salah!", "error");
    }
  };

  return <AdminLoginForm onAdminLogin={handleAdminLogin} />;
}

export default AdminLoginPage;
