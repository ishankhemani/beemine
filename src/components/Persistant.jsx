import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { checkLogin } from "../api/auth.api";

export default function Persistent() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setLoading(false);
      return;
    }

    checkLogin(token)
      .then(() => setIsAuth(true))
      .catch(() => {
        localStorage.clear();
        setIsAuth(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Checking session...</div>;

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
}