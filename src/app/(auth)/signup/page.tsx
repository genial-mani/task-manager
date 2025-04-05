"use client";

import {motion} from "motion/react";
import Form from "@/components/Form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userType } from "@/utils/Interfaces";

export default function Register() {
  const router = useRouter();
    const [user, setUser] = useState<userType | null>(null);
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

  const handleSubmit = async (formData: Record<string,string>)=>{
    try {
      toast.loading("Signing up...");
      const response = await fetch("api/auth/signup",{
        method: 'POST',
        cache: 'no-store',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      toast.dismiss();
      const data = await response.json();
      console.log(data);
      if(response.ok){
        localStorage.setItem("user", data.user);
        console.log('success')
        router.push("/");
        console.log('success')
        toast.success(data.message);
      }else{
        toast.warning(data.error);
      }
        } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  useEffect(()=>{
      const userData = localStorage.getItem("user");
      if(userData){
        setUser(userData as unknown as userType);
      }
      if(user){
        router.push("/tasks");
      }
    },[user])

  return (
    <motion.div
      initial={{ opacity: 0, y: "-20px" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "backInOut" }}
      className="flex flex-col items-center justify-center mx-auto mt-10 border-2 border-seasalt md:max-w-md lg:max-w-lg py-6 px-5 rounded-lg"
    >
      <h1 className="text-4xl mb-5">Signup for challenging <p className="text-purple-500">Endevour</p></h1>
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonLabel="Sign up"
        classname={"w-full max-w-64 sm:max-w-sm lg:max-w-lg flex flex-col"}
      />
    </motion.div>
  );
}
