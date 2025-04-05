import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HiOutlineLogout } from "react-icons/hi";
import { useEffect, useState } from "react";
import { userType } from "@/utils/Interfaces";

export default function Logout() {
    const router = useRouter();
    const [user, setUser] = useState<userType | null>(null);
    const handleLogout = async ()=>{
        try {
            const response = await fetch('/api/auth/logout',{method: 'POST',cache: 'no-store'});
            const data = await response.json();
            if(response.ok){
                localStorage.removeItem('user');
                setUser(null);
                router.push('/');
                toast.success(data.message);
            }
            else{
                toast.error(data.error);
                console.log(data.error);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error logging out.')
        }
    }

    useEffect(()=>{
        if(!user){
          window.location.href = "/";
        }
      },[user])

    return <div onClick={handleLogout} className="flex items-center gap-1 py-2 px-3 rounded-lg bg-[#a855f7] text-seasalt cursor-pointer"> <HiOutlineLogout/> Logout</div>;
}