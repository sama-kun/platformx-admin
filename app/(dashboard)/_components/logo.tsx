import Image from "next/image";
// import logo from '@/public/Logo.png';

export const Logo = () => {
    return(
        <Image
        height={100}
        width={100}
        alt="Logo"
        src={'https://res.cloudinary.com/drpdq2t8c/image/upload/f_auto,q_auto/v1/platformx/yrw6twxz9w0i4zgndvq8'}
        className="bg-black"
        />
    )
}