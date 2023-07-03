"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ServerConfig } from "../../config/appwrite_config";
import { Client, Models } from "appwrite";

interface Coordinate {
  x: number;
  y: number;
}

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(`${process.env.NEXT_PUBLIC_PROJECTID}`);

export default function RoomPage({ params }: { params: { room: string } }) {
  const router = useRouter();
  const server = new ServerConfig();

  const [users, setUsers] = useState<Models.Document[]>();

  useEffect(() => {
    server.databases
      .listDocuments(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${params["room"]}`
      )
      .then((res) => {
        setUsers(res.documents);
      });

    const handleMouseMove = (event: MouseEvent): void => {
      server.databases.updateDocument(
        `${process.env.NEXT_PUBLIC_DATABASEID}`,
        `${params["room"]}`,
        JSON.parse(localStorage.getItem("userInfo") || "{}").$id,
        {
          x_point: event.clientX,
          y_point: event.clientY,
        }
      );
    };
    window.addEventListener("mousemove", handleMouseMove);

    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_DATABASEID}.collections.${params["room"]}.documents`,
      (response) => {
        server.databases
          .listDocuments(
            `${process.env.NEXT_PUBLIC_DATABASEID}`,
            `${params["room"]}`
          )
          .then((res) => {
            setUsers(res.documents);
          });
      }
    );
  }, []);

  return (
    <div className="container mx-auto">
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl">{params["room"]}</span>
          </a>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center"></nav>
          <button
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
            onClick={() => {
              server.databases.deleteDocument(
                `${process.env.NEXT_PUBLIC_DATABASEID}`,
                params["room"],
                JSON.parse(localStorage.getItem("userInfo") || "{}").$id
              );
              router.push(`/room`);
            }}
          >
            Exit Room
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </header>
      <div className="py-10">
        {users &&
          users.map((item) => (
            <div key={item.$id}>
              <div
                className="myContainer bg-red-500 w-100 h-100 absolute"
                style={{ left: item.x_point, top: item.y_point }}
              >
                {item.name}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
