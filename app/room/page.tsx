"use client";

import { Client } from "appwrite";
import { ServerConfig } from "../config/appwrite_config";
import { useState, useEffect } from "react";
import { Models } from "node-appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(`${process.env.NEXT_PUBLIC_PROJECTID}`);

export default function Room() {
  const server = new ServerConfig();
  const [rooms, setRooms] = useState<Models.Collection[]>();

  useEffect(() => {
    server.databases
      .listCollections(`${process.env.NEXT_PUBLIC_DATABASEID}`)
      .then(
        function (response) {
          setRooms(response.collections);
        },
        function (error) {
          console.log(error);
        }
      );

    const unsubscribe = client.subscribe(
      `databases.${process.env.NEXT_PUBLIC_DATABASEID}.collections`,
      (response) => {
        server.databases
          .listCollections(`${process.env.NEXT_PUBLIC_DATABASEID}`)
          .then(
            function (response) {
              setRooms(response.collections);
            },
            function (error) {
              console.log(error);
            }
          );
      }
    );
  }, []);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
            Available Rooms
          </h1>
        </div>
        <div className="flex flex-wrap -m-4">
          {rooms &&
            rooms.map((item) => (
              <div className="xl:w-1/3 md:w-1/2 p-4">
                <div className="border border-gray-200 p-6 rounded-lg">
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
                    {item.name}
                  </h2>
                </div>
              </div>
            ))}
        </div>
        <button className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
          Button
        </button>
      </div>
    </section>
  );
}
