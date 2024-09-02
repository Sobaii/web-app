import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Expenses from "./pages/Expenses";
import { Toaster } from "sonner";
import AppTopNav from "./layouts/AppTopNav";
import Settings from "./pages/settings/Settings";
import ExpensesSpreadsheet from "./pages/ExpensesSpreadsheet";
import { UserAuthProvider, useUserAuth } from "./data/contexts/UserAuthContext";
import { authenticateUser, getUserGoogleInfo } from "./services/userServices";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SplineModel from "./components/SplineModel";
import Loader from "./components/Loader";

function AppLayout() {
  const { user, setUser } = useUserAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserGoogleData = async () => {
      setIsLoading(true);
      try {
        const data = await authenticateUser();
        if (data) {
          setUser(data);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to fetch Google user data:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserGoogleData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* <SplineModel show={Boolean(!user)} /> */}
      <div className="flex flex-col">
        <AppTopNav />
        <div className="flex flex-col gap-3 w-full p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <UserAuthProvider>
      <div className="bg-neutral-50  min-h-screen w-fit min-w-full">
        <Toaster
          richColors
          toastOptions={{
            className: "sonnerToast",
          }}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<AppLayout />}>
            <Route path="/expenses" element={<Expenses />} />
            <Route
              path="/expenses/spreadsheet"
              element={<ExpensesSpreadsheet />}
            />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </UserAuthProvider>
  );
}

export default App;
