"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Coordinate {
  x: number;
  y: number;
}

const MyContainer: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Coordinate>({ x: 0, y: 0 });
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    coordinate: keyof Coordinate
  ) => {
    setCoordinates((prevCoordinates) => ({
      ...prevCoordinates,
      [coordinate]: parseInt(e.target.value, 10),
    }));
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent): void => {
      setCoordinates({ x: event.clientX, y: event.clientY + 10 });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="py-10 text-2xl font-bold">
        <h1>This is how it works 😉 : Live Cursor</h1>
      </div>
      <div className="mb-4">
        <label htmlFor="xInput" className="mr-2 font-semibold">
          X Coordinate:
        </label>
        <input
          id="xInput"
          type="number"
          value={coordinates.x}
          onChange={(e) => handleInputChange(e, "x")}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="yInput" className="mr-2 font-semibold">
          Y Coordinate:
        </label>
        <input
          id="yInput"
          type="number"
          value={coordinates.y}
          onChange={(e) => handleInputChange(e, "y")}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="py-10">
        <button
          className="bg-[#f02e65] py-2 px-5 focus:outline-none hover:bg-[#ab073d] rounded-full"
          onClick={() => {
            router.push('/login')
          }}
        >
          <div className="flex align-items-center gap-1 justify-center mx-auto">
            <p className="text-xl my-1 text-white">Try it Yourself</p>
          </div>
        </button>
      </div>
      <div
        className="myContainer bg-yellow-300 w-100 h-100 absolute text-black"
        style={{ left: coordinates.x, top: coordinates.y }}
      >
        Spider-Man 🕸️
      </div>
    </div>
  );
};

export default MyContainer;
