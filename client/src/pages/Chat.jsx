// pages/Chat.jsx
import ReactMarkdown  from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useParams } from 'react-router-dom';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const {id} = useParams();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsLoading(true);

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
      if (!chatId) setChatId(data.chatId); // setting up the chatId

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
  
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
  
        const res = await fetch(`/api/chat/${id}`, {
          credentials: "include",
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data?.error || "Unable to load chat");
        }
  
        // Load old messages
        setMessages(data);
  
        // Set active chat
        setChatId(id);
  
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMessages();
  
  }, [id]);

  useEffect(() => {
    if (!id) {
      setMessages([]);
      setChatId(null);
    }
  }, [id]);


  return (
    <div className="flex flex-col h-full max-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">
        Chat 
      </h1>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          > 
            <Card className="p-3 max-w-xl prose dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </Card>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <Card className="p-3 max-w-xl bg-gray-900 text-white">
              <div className="flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-100">•</span>
                <span className="animate-bounce delay-200">•</span>
              </div>
            </Card>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 flex gap-2">
        <Input
          placeholder="Ask anything..."
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}
