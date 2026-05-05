// pages/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatId,
          message: userMessage.content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Unable to get chat response");
      }

      // set chatId (important for history)
      if (!chatId) setChatId(data.chatId);

      const aiMessage = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Unable to get chat response");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err?.message || "Unable to get chat response",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card className="p-3 max-w-xl">
              {msg.content}
            </Card>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 flex gap-2">
        <Input
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>
          Send
        </Button>
      </div>

    </div>
  );
}
