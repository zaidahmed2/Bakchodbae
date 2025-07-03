'use client';

import { useState, FormEvent } from 'react';
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
      content: 'Tu Haniya hai kya? Jaldi bata warna nikal ja yahan se 👀',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHaniya, setIsHaniya] = useState(false);
  const [mood, setMood] = useState<Mood>('Happy');

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
      const { response: aiResponse, haniyaIdentified } = await getAiResponse(messages, input, mood, isHaniya);

      if (haniyaIdentified && !isHaniya) {
        setIsHaniya(true);
      }

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

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <ChatHeader isHaniya={isHaniya} mood={mood} setMood={setMood} />
      <ChatMessages messages={messages} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
