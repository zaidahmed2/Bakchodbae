'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/app/page';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-4 md:p-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
