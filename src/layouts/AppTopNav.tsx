import { ColouredLongLogo } from "../assets/logos";

import { MdBarChart } from "react-icons/md"; // Replaced LuBarChartBig
import { IoSettingsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/userApi"; 
import { Popover, Card, Button } from '../components/ui';
import { useAuthStore } from "../stores";

const SideNavLink = ({ IconComponent, label, href }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = href.split('/')[1].split('?')[0] === location.pathname.split('/')[1].split('?')[0];

  return (
    <button onClick={() => navigate(href)} className={`flex items-center border-b-2 gap-2 py-2 px-4 ${isActive ? "bg-gray-100 border-b-green-500" : "border-b-transparent hover:bg-gray-100"}`}>
      <IconComponent className={`text-xl ${isActive && "text-green-600"}`} />
      <p>{label}</p>
    </button>
  );
};

function AppTopNav() {

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  const { user } = useAuthStore();

  return (
    <main className="border-b z-40 bg-white border-neutral-200 relative w-full h-24 py-4 px-6 gap-6 flex flex-col">
      <div className="w-full h-6 flex justify-between">
        <img onClick={() => navigate('/dashboard')} className="cursor-pointer h-6 w-fit" src={ColouredLongLogo} alt="ColouredLongLogo" />
        {user && (
          false ? (
            <Popover position="down-left">
              <img src={user.picture} alt="User" className="cursor-pointer h-10 w-10 rounded-full" />
              <Card className="p-3 w-fit gap-3">
                <p className="text-neutral-600">{user.email}</p>
                <hr className="border-neutral-300" />
                <Button variant="destructive" size="s" text="Logout" onClick={() => handleLogout()} />
              </Card>
            </Popover>
          ) : (
            <Popover position="down-left">
              <div className="cursor-pointer h-10 w-10 rounded-full bg-neutral-500"></div>
              <Card className="p-3 w-fit gap-3">
                <p className="text-neutral-600">{user.email}</p>
                <hr className="border-neutral-300" />
                <Button variant="destructive" size="s" text="Logout" onClick={() => handleLogout()} />
              </Card>
            </Popover>
          )
        )}
      </div>
      <div className="flex absolute bottom-0">
        <SideNavLink href="/dashboard" IconComponent={MdBarChart} label="Dashboard" />
        <SideNavLink href="/settings?section=general" IconComponent={IoSettingsOutline} label="Settings" />
      </div>
    </main>
  );
}

export default AppTopNav;
