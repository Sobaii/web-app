"use client";
import LandingAnimation from "@/components/landing/landing-animation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <main className="grid grid-cols-2 h-screen">
      <div className="w-full flex flex-col gap-5 h-fit m-auto border-4 max-w-md p-6 bg-white">
        <Image
          alt="logo"
          src="/images/logos/coloured-long-logo.svg"
          className="mb-5 h-7 w-fit"
          width={200}
          height={50}
        />
        <SignedIn>
          <Link
            href="/app/dashboard"
            className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold "
            
          >
            Dashboard
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
      <LandingAnimation />
    </main>
  );
}
