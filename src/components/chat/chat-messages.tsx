'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/app/page';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="space-y-6 p-4 md:p-6">
        {messages.map((message, index) => (
          <ChatMessage key={message.id} message={message} isFirst={index === 0}/>
        ))}
      </div>
    </ScrollArea>
  );
}
