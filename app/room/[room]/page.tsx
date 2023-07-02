"use client"

import { useRouter } from 'next/navigation';

export default function RoomPage({params}: {params :{room: string}} ){
  const router = useRouter();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mt-4">{params["room"]}</h1>
      {/* Add your room content here */}
    </div>
  );
};

