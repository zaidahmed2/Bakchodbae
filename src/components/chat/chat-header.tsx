'use client';

import { Sparkles } from 'lucide-react';
import { MoodSelector } from '@/components/chat/mood-selector';
import type { Mood } from '@/app/actions';

interface ChatHeaderProps {
  isHaniya: boolean;
  mood: Mood;
  setMood: (mood: Mood) => void;
}

export function ChatHeader({ isHaniya, mood, setMood }: ChatHeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-3xl md:text-4xl text-primary">Bakchodi Bae 💋</h1>
      </div>
      <div>
        {isHaniya && <MoodSelector mood={mood} setMood={setMood} />}
      </div>
    </header>
  );
}
