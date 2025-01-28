"use client";

import Form from "@/components/Form";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      toast.loading("Loggin in...");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      toast.dismiss();
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push("/");
      }
      if (!response.ok) {
        toast.error(data.error);
        if(response?.status === 404)
        {
          setTimeout(()=>{
            toast.dismiss();
            toast.info('redirected to singup page')
            router.push('/signup');
          },1000)
        }
      }
    } catch (error) {
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
      <h1 className="text-4xl mb-5">Login</h1>
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonLabel="Login"
        classname={"w-full max-w-64 sm:max-w-sm lg:max-w-lg flex flex-col"}
      />
    </motion.div>
  );
}
