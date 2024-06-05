"use client";
import Button from "@/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import LandingAnimation from "@/components/landing/landing-animation";
import { Separator } from "@/components/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
      {
        message:
          "Password must include an uppercase letter, a number, and a special character",
      }
    ),
});

export default function Home() {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    router.push("/app/dashboard");
  }

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
        <h1 className="text-3xl font-semibold">Login to your account</h1>
        <p className="text-gray-600 text-sm -mt-2 mb-4">
          Let's get started with your projects.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input placeholder="joe@doe.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <Button className="w-full" type="submit" text='Submit' />
            <Button variant="outline" className="w-full gap-2" type="button" imageSrc='/images/logos/google-logo.svg' text='Login with Google' />
          </form>
        </Form>

        <div className="flex justify-center items-center">
          <div className="bg-gray-50 border p-2 pl-8 pr-8 rounded-lg flex">
            <p className="text-gray-600">Don't have an account?</p>
            <Link
              href="sign-up"
              className="text-green-600 ml-1 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <LandingAnimation />
    </main>
  );
}
