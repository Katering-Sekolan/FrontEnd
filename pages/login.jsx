import React from "react";
import AdminLoginForm from "@/components/AdminLoginForm";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function AdminLoginPage() {
  const router = useRouter();
  const handleAdminLogin = async ({ username, password }) => {
    signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          SweatAlertTimer("Login Berhasil", "success");
          router.push("/admins/dashboard");
        } else if (response.status === 401) {
          SweatAlertTimer("Gagal", response.error, "error");
        } else {
          SweatAlertTimer("Error, Hubungi Administrator", "error");
        }
      })
      .catch((error) => {
        SweatAlertTimer(error, "error");
      });
  };

  return <AdminLoginForm onAdminLogin={handleAdminLogin} />;
}

export default AdminLoginPage;
