'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Mood } from '@/app/actions';
import { Smile, Heart, Frown, User as UserIcon } from 'lucide-react';

interface MoodSelectorProps {
  mood: Mood;
  setMood: (mood: Mood) => void;
}

const moodOptions: { value: Mood; label: string; icon: React.ReactNode }[] = [
  { value: 'Happy', label: 'Happy', icon: <Smile className="h-4 w-4" /> },
  { value: 'Sad', label: 'Sad', icon: <Frown className="h-4 w-4" /> },
  { value: 'Lonely', label: 'Lonely', icon: <UserIcon className="h-4 w-4" /> },
  { value: 'Romantic', label: 'Romantic', icon: <Heart className="h-4 w-4" /> },
];

export function MoodSelector({ mood, setMood }: MoodSelectorProps) {
  const SelectedIcon = moodOptions.find(o => o.value === mood)?.icon;

  return (
    <Select value={mood} onValueChange={(value: Mood) => setMood(value)}>
      <SelectTrigger className="w-[120px] md:w-[150px] gap-2">
        {SelectedIcon}
        <SelectValue placeholder="Select mood" />
      </SelectTrigger>
      <SelectContent>
        {moodOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              {option.icon}
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
