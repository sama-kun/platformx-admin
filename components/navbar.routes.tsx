"use client"

import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { removeAuthToken } from "@/service/auth";
import Link from "next/link";


export const NavbarRoutes = () => {

    const pathname = usePathname();

    const router = useRouter();

    const handleLogout = () => {
        removeAuthToken();
        router.push('/login');
    };

    
    const isTeacherPage = pathname?.startsWith("/teacher")
    const isPlayerPage = pathname?.includes("/chapter");


    return(
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isPlayerPage ?(
                <Link href="/">
                    <Button size="sm" variant="ghost" color="white">
                        <LogOut className="h-4 w-4 mr-2 "/>
                        Exit
                    </Button>
                </Link>
            ): (
                <Link href="/teacher/courses">
                    <Button size="sm" variant="ghost" color="white">
                        Teacher mode
                    </Button>
                </Link>
            )}
            
            <Button
                onClick={() => handleLogout()}
            >
                Logout
            </Button>
        </div>
    )
}