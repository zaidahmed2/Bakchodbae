'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/app/page';
import { ChatAvatar } from './chat-avatar';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = message;
  const isUser = role === 'user';
  const isAi = role === 'ai';
  const isLoading = role === 'loading';

  if (isLoading) {
    return (
      <div className="flex items-end gap-2 animate-fade-in">
        <ChatAvatar role="ai" />
        <div className="flex items-center gap-1 rounded-lg bg-card p-3 text-card-foreground shadow-sm">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
        </div>
      </div>
    );
  }
  
  // Basic markdown rendering for bold text
  const renderContent = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
      }
      // Handle newlines
      return part.split(/(\n)/g).map((subPart, subIndex) => 
        subPart === '\n' ? <br key={`${index}-${subIndex}`} /> : subPart
      );
    });
  };

  return (
    <div
      className={cn(
        'group flex items-end gap-2 animate-bubble-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <ChatAvatar role={role} />
      <div
        className={cn(
          'max-w-xs rounded-lg px-4 py-3 shadow-md md:max-w-md',
          isUser
            ? 'rounded-br-none bg-primary text-primary-foreground'
            : 'rounded-bl-none bg-card text-card-foreground',
          isAi && 'animate-glow'
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {renderContent(content)}
        </p>
      </div>
    </div>
  );
}
