// pages/History.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function History() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("/api/chat", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error);
        }

        setChats(data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="p-6">
      
      <h1 className="text-3xl font-bold mb-6">
        Chat History
      </h1>

      <div className="space-y-4">
        {chats.map((chat) => (
          <Card
            key={chat._id}
            onClick={() => navigate(`/dashboard/chat/${chat._id}`)}
            className="p-4 hover:bg-black hover:text-white cursor-pointer transition"
          >
            <h2 className="font-semibold text-lg">
              {chat.title}
            </h2>

            <p className="text-sm text-gray-500">
              {new Date(chat.updatedAt).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}