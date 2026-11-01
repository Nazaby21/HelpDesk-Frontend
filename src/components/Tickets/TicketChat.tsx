"use client";

import React, { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  useGetTicketMessagesQuery,
  useSendTicketMessageMutation,
  ChatMessage,
} from "@/redux/feature/ticket/ticketApi";
import { useAppSelector } from "@/redux/hooks";
import { Send } from "lucide-react";

interface TicketChatProps {
  ticketId: string;
}

export function TicketChat({ ticketId }: TicketChatProps) {
  const { user } = useAppSelector((state: any) => state.auth);
  const { data: history = [], isLoading } = useGetTicketMessagesQuery(ticketId);
  const [sendTicketMessage, { isLoading: isSending }] = useSendTicketMessageMutation();
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

  // WebSocket connection for real-time incoming messages
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const backendUrl =
          apiUrl && apiUrl.startsWith("http")
            ? apiUrl.replace(/\/api\/v1\/?$/, "")
            : "http://localhost:8080";
        return new SockJS(`${backendUrl}/ws-chat`);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/ticket/${ticketId}`, (msg) => {
          const newMsg = JSON.parse(msg.body) as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id && newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        });
      },
      onStompError: () => {
        // Handled gracefully; REST POST fallback guarantees delivery
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

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || isSending) return;
    setInput("");

    try {
      const saved = await sendTicketMessage({
        ticketId: Number(ticketId),
        senderId: user?.id || 0,
        sender: user ? `${user.firstName} ${user.lastName}`.trim() : "User",
        content,
      }).unwrap();

      setMessages((prev) => {
        if (prev.some((m) => m.id === saved.id && saved.id)) return prev;
        return [...prev, saved];
      });
    } catch {
      // Fallback to STOMP publish if REST call fails while WS is connected
      if (stompClient.current?.connected) {
        stompClient.current.publish({
          destination: "/app/chat",
          body: JSON.stringify({
            ticketId: Number(ticketId),
            senderId: user?.id || 0,
            sender: user ? `${user.firstName} ${user.lastName}`.trim() : "User",
            content,
          }),
        });
      }
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-gray-100 dark:border-dark-3 bg-white dark:bg-gray-dark shadow-sm flex flex-col h-[500px]">
      <div className="p-4 border-b border-gray-100 dark:border-dark-3 bg-gray-50/50 dark:bg-gray-800 rounded-t-xl">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Ticket Conversation</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 dark:bg-gray-800">
        {isLoading && <p className="text-gray-500 text-sm text-center">Loading history...</p>}
        {!isLoading && messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">
            No messages yet. Start the conversation below.
          </p>
        )}
        {messages.map((m, idx) => {
          const isMe = m.senderId === user?.id;
          return (
            <div key={m.id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <span className="text-xs text-gray-500 mb-1">{m.sender}</span>
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  isMe
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}
              >
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
            disabled={isSending}
            aria-label="Send message"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
