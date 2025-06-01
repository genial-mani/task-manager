"use client";

import Form from "@/components/Form";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaHandPointRight } from "react-icons/fa";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
    },
  ];

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      toast.loading("Loggin in...");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        cache: "no-store",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      toast.dismiss();
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message);
        toast.dismiss();
        // toast.info("Redirecting to tasks page..."); this line is not needed because already redirecting
        router.push("/tasks");
        window.location.href = "/tasks";
      }
      else{
        toast.error(data.error);
          toast.dismiss();
          toast.info('user not found redirected to singup page')
          router.push('/signup');
        }
      } catch (error) {
      toast.dismiss();
      toast.error("Error while loggin in.");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "-20px" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "backInOut" }}
      className="flex flex-col items-center justify-center mx-auto mt-10 border-2 border-seasalt md:max-w-md lg:max-w-lg py-6 px-5 rounded-lg"
    >
      <h1 className="text-4xl mb-5 flex flex-col items-center justify-center">Welcome back! <p className="text-2xl">Just get better...</p></h1>
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonLabel="Login"
        classname={"w-full max-w-64 sm:max-w-sm lg:max-w-lg flex flex-col"}
      />
      <p className="flex items-center gap-2 mt-2">Looking to signup its here <FaHandPointRight fill="#a855f7"/><Link href={'/signup'} >click me!</Link></p>
    </motion.div>
  );
}
