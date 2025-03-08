import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HiOutlineLogout } from "react-icons/hi";

export default function Logout() {
    const router = useRouter();
    const handleLogout = async ()=>{
        try {
            const response = await fetch('/api/auth/logout',{method: 'POST'})
            const data = await response.json();
            if(response.ok){
                toast.success(data.message);
                router.push('/');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error logging out.')
        }
    }

    return <div onClick={handleLogout} className="flex items-center gap-1 py-2 px-3 rounded-lg bg-[#a855f7] text-seasalt cursor-pointer"> <HiOutlineLogout/> Logout</div>;
}