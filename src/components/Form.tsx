'use client'

import { FormProps } from "@/utils/Interfaces";
import { FormEvent, useState } from "react";
import {motion} from "motion/react";

export default function From({fields,onSubmit,submitButtonLabel,formName,classname}: FormProps) {

    const [formData, setFormData] = useState<Record<string, string>>({});

    const handleChange = (name: string,value: string)=>{
        setFormData((prevData) => ({...prevData,[name]: value}));
    }

    const handleSubmit = (event: FormEvent)=>{
        event.preventDefault();
        onSubmit(formData);
    }
    

    return <form className={classname} name={formName} onSubmit={handleSubmit}>
        {fields.map((field, index) => (
            <div key={index} className="flex flex-col mb-4">
                <label htmlFor={field.name} className="mb-1">{field.label}</label>
                <input type={field.type} id={field.name} name={field.name} placeholder={field.placeholder} required={field.required} onChange={(e)=> handleChange(field.name,e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-outer-space" />
            </div>
        ))}
        <motion.button whileTap={{scale: 0.95}} type="submit" className="w-full max-w-[50%]  text-center mt-5 px-4 py-2 rounded-lg bg-onyx hover:bg-outer-space text-seasalt mx-auto">{submitButtonLabel}</motion.button>
    </form>
}