"use client";
import React, { ElementType, FC, ReactNode } from "react";
import { LuBarChartBig } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";
import { logoutUser } from "@/services/userAPI";
import Popover from "@/components/popover";
import { Card } from "@/components/card";
import Button from "@/components/button";
import Image from "next/image";
import { useUser } from "@/stores/user-store";

type SideNavLinkProps = {
  IconComponent: ElementType;
  label: string;
  href: string;
};

const SideNavLink: FC<SideNavLinkProps> = ({ IconComponent, label, href }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive =
    href.split("/")[2].split("?")[0] === pathname.split("/")[2].split("?")[0];

  return (
    <button
      onClick={() => router.push(href)}
      className={`flex items-center border-b-2 gap-2 py-2 px-4 ${
        isActive
          ? "bg-gray-100 border-b-green-500"
          : "border-b-transparent hover:bg-gray-100"
      }`}
    >
      <IconComponent className={`text-xl ${isActive && "text-green-600"}`} />
      <p>{label}</p>
    </button>
  );
};

function DashboardNav() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const { email, picture } = useUser();
  return (
    <main className="border-b z-40 bg-white border-neutral-200 relative w-full h-24 py-4 px-6 gap-6 flex flex-col">
      <div className="w-full h-6 flex justify-between">
        <div
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer h-6 w-fit"
        >
          <Image
            width={20}
            height={20}
            src="/images/logos/coloured-long-logo.svg"
            alt="Logo"
            className="h-6 w-auto"
          />
        </div>
        {email &&
          (picture ? (
            <Popover>
              <Image
                width={20}
                height={20}
                src={picture}
                alt="User"
                className="cursor-pointer h-10 w-10 rounded-full"
              />
              <Card className="p-3 w-fit gap-3">
                <p className="text-neutral-600">{email}</p>
                <hr className="border-neutral-300" />
                <Button
                  variant="destructive"
                  size="s"
                  handleClick={handleLogout}
                  text="Logout"
                />
              </Card>
            </Popover>
          ) : (
            <Popover>
              <div className="cursor-pointer h-10 w-10 rounded-full bg-neutral-500"></div>
              <Card className="p-3 w-fit gap-3">
                <p className="text-neutral-600">{email}</p>
                <hr className="border-neutral-300" />
                <Button
                  variant="destructive"
                  size="s"
                  handleClick={handleLogout}
                  text="Logout"
                />
              </Card>
            </Popover>
          ))}
      </div>
      <div className="flex absolute bottom-0">
        <SideNavLink
          href="/app/dashboard"
          IconComponent={LuBarChartBig}
          label="Dashboard"
        />
        <SideNavLink
          href="/app/settings/general"
          IconComponent={IoSettingsOutline}
          label="Settings"
        />
      </div>
    </main>
  );
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <DashboardNav />
      <main className="flex flex-col gap-3 w-full p-4">{children}</main>
    </div>
  );
}
