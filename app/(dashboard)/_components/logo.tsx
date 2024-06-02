import Image from "next/image";
import logo from '@/public/Logo.png';

export const Logo = () => {
    return(
        <Image
        height={100}
        width={100}
        alt="Logo"
        src={logo}
        className="bg-black"
        />
    )
}