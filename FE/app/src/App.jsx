import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
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

function AppLayout() {
  const { user, setUser } = useUserAuth();
  useEffect(() => {
    const fetchUserGoogleData = async () => {
      try {
        const data = await authenticateUser();
        setUser(data)
      } catch (error) {
        // window.location.href = "http://localhost:5173/";
        console.error('Failed to fetch Google user data:', error);
      }
    }
    fetchUserGoogleData();
  }, []);
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
      <div className="bg-neutral-50 min-h-screen w-fit min-w-full">
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
            <Route path="/expenses/spreadsheet" element={<ExpensesSpreadsheet />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </UserAuthProvider>
  );
}

export default App;

