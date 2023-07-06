import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ServerConfig } from "../config/appwrite_config";
import { Client, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(`${process.env.NEXT_PUBLIC_PROJECTID}`);
const account = new Account(client);

const CreateRoomButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const serverConfig = new ServerConfig();

  const handleCreateRoom = () => {
    setShowForm(true);
  };

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    serverConfig.createRoom(
      roomName,
      JSON.parse(localStorage.getItem("userInfo") || "{}").$id
    );
    router.push(`/room`);
  };

  useEffect(() => {
    account.getSession("current").then((res) => {
      const response = fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${res.providerAccessToken}`,
        {
          method: "GET",
        }
      ).then((response) => {
        response.json().then((data) => {
          localStorage.setItem("googleInfo", JSON.stringify(data));
        });
      });
    });
  });

  return (
    <div className="h-screen flex items-center justify-center">
      {!showForm ? (
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
          <button
            className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              router.push(`/room`);
            }}
          >
            Explore Rooms
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={handleRoomNameChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Create
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateRoomButton;
