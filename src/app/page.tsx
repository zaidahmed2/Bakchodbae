'use client';

import { useState, useRef, FormEvent, useEffect } from 'react';
import { Heart, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { getAiResponse } from './actions';
import type { Mood } from './actions';

export type Message = {
  id: string;
  role: 'user' | 'ai' | 'loading';
  content: string;
};

export default function HaniyaPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hey love, how are you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [mood, setMood] = useState<Mood>('Romantic');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };
    const loadingMessage: Message = {
      id: crypto.randomUUID(),
      role: 'loading',
      content: '...',
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAiResponse(input, mood);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: aiResponse,
      };

      setMessages(prev => [...prev.slice(0, -1), aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'I had a little trouble thinking of a reply. Please try again.',
      });
      setMessages(prev => prev.slice(0, -1)); // Remove loading message
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVoiceInput = () => {
    toast({
      title: "Voice input isn't available just yet, my love.",
      description: 'For now, please type your message to me.',
    });
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <ChatHeader mood={mood} setMood={setMood} />
      <ChatMessages messages={messages} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleVoiceInput}
        className="absolute bottom-24 right-4 md:bottom-28 md:right-8 z-20 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-100"
        aria-label="Voice input"
      >
        <Mic className="h-8 w-8" />
      </Button>
    </div>
  );
}
