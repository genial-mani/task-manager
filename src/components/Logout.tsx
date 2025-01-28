import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Logout() {
    const router = useRouter();
    const handleLogout = async ()=>{
        try {
            const response = await fetch('/api/auth/logout',{method: 'POST'})
            const data = await response.json();
            if(response.ok){
                toast.success(data.message);
                router.push('/login');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error logging out.')
        }
    }

    return <div onClick={handleLogout} className="py-2 px-3 rounded-lg bg-seasalt text-eerie-black cursor-pointer">Logout</div>;
}