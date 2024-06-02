// components/Card.js
import Link from 'next/link';
import Image from 'next/image'; // Importing the Image component from next/image
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Card = ({id, title, imageUrl, link}: any) => {
  const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg flex items-center space-x-4 my-5">
      <div className="w-24 h-24 relative">
        <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" className="rounded-lg" />
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        {/* <p className="text-gray-700">{description}</p> */}
      </div>
      {/* <Link> */}
        <Button className="px-4 py-2 text-white rounded-md" 
        onClick={() => router.push('/teacher/courses/'+id)}
        >
          Open
        </Button>
      {/* </Link> */}
    </div>
  );
};

export default Card;
