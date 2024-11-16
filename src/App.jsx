import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import AppTopNav from "./layouts/AppTopNav";
import Settings from "./pages/Settings";
import ReceiptSpreadsheet from "./pages/ReceiptSpreadsheet";
import { UserAuthProvider, useUserAuth } from "./data/contexts/UserAuthContext";
import { authenticateUser } from "./services/userServices";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { SplineModel, Loader } from "./components/ui";
import Dashboard from "./pages/Dashboard";

function AppLayout() {
  const { user, setUser } = useUserAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runUserAuthCheck = async () => {
      setIsLoading(true);
      try {
        const data = await authenticateUser();
        if (data) {
          setUser(data);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to authenticate user:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    runUserAuthCheck();
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
  console.log('cookies', console.log(document.cookie)
  )
  return (
    <UserAuthProvider>
      <div className="min-h-screen w-fit min-w-full">
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/spreadsheet"
              element={<ReceiptSpreadsheet />}
            />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </UserAuthProvider>
  );
}

export default App;
