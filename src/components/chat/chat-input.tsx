'use client';

import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { FormEvent } from 'react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  setInput,
  handleSendMessage,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="border-t p-4 shrink-0 bg-card">
      <form
        onSubmit={handleSendMessage}
        className="relative flex items-center gap-4"
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          placeholder="Bakchodi likho yahan... Haniya ho to zinda bacho ge 😏"
          className="min-h-[52px] resize-none pr-20"
          rows={1}
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary hover:bg-primary/90 rounded-full"
          aria-label="Send message"
        >
          {isLoading ? (
            <Sparkles className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
       <p className="text-xs text-center text-muted-foreground mt-2">
          You can start your message with <span className="font-bold text-primary">/suggest</span> to get romantic ideas.
        </p>
    </div>
  );
}
