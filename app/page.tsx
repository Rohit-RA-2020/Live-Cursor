"use client";

import React, { useState, useEffect } from "react";

interface Coordinate {
  x: number;
  y: number;
}

const MyContainer: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Coordinate>({ x: 0, y: 0 });

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
      setCoordinates({ x: event.clientX + 50, y: event.clientY + 50 });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="mb-4">
        <label htmlFor="xInput" className="mr-2 font-semibold">
          X Coordinate:
        </label>
        <input
          id="xInput"
          type="number"
          value={coordinates.x}
          onChange={(e) => handleInputChange(e, 'x')}
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
          onChange={(e) => handleInputChange(e, 'y')}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div
        className="myContainer bg-red-500 w-100 h-100 absolute"
        style={{ left: coordinates.x, top: coordinates.y }}
        >
        Rohit Ranjan
      </div>
    </div>
  );
};

export default MyContainer;
