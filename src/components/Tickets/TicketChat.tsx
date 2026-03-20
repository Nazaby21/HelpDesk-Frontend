"use client";

import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
// @ts-ignore
import SockJS from "sockjs-client";
import { useGetTicketMessagesQuery, ChatMessage } from "@/redux/feature/ticket/ticketApi";
import { useAppSelector } from "@/redux/hooks";
import { Send } from "lucide-react";

interface TicketChatProps {
  ticketId: string;
}

export function TicketChat({ ticketId }: TicketChatProps) {
  const { user } = useAppSelector((state: any) => state.auth);
  const { data: history = [], isLoading } = useGetTicketMessagesQuery(ticketId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const stompClient = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync historical messages on load
  useEffect(() => {
    if (history.length > 0) {
      setMessages(history);
    }
  }, [history]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // Strip /api/v1 suffix if present, fallback to production backend URL
        const backendUrl = apiUrl
          ? apiUrl.replace(/\/api\/v1\/?$/, "")
          : "https://helpdesk-backend-production-2244.up.railway.app";
        return new SockJS(`${backendUrl}/ws-chat`);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/ticket/${ticketId}`, (msg) => {
          const newMsg = JSON.parse(msg.body) as ChatMessage;
          setMessages((prev) => {
            // Prevent duplicate message stacking
            if (prev.some(m => m.id === newMsg.id && newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [ticketId]);

  const sendMessage = () => {
    if (!input.trim() || !stompClient.current) return;
    const msg = {
      ticketId: Number(ticketId),
      senderId: user?.id || 0,
      sender: user ? `${user.firstName} ${user.lastName}` : "Unknown",
      content: input,
    };
    stompClient.current.publish({
      destination: "/app/chat",
      body: JSON.stringify(msg),
    });
    setInput("");
  };

  return (
    <div className="mt-8 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col h-[500px]">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Ticket Conversation</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 dark:bg-gray-800">
        {isLoading && <p className="text-gray-500 text-sm text-center">Loading history...</p>}
        {messages.map((m, idx) => {
          const isMe = m.senderId === user?.id;
          return (
            <div key={m.id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <span className="text-xs text-gray-500 mb-1">{m.sender}</span>
              <div className={`px-4 py-2 rounded-lg max-w-[80%] ${isMe ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`}>
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 rounded-b-xl">
        <div className="flex gap-2 relative">
          <input
            type="text"
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none pr-12 dark:bg-gray-900 dark:text-white"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
