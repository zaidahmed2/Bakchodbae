import { Heart, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatAvatarProps {
  role: 'user' | 'ai' | 'loading';
}

export function ChatAvatar({ role }: ChatAvatarProps) {
  if (role === 'user') {
    return (
      <Avatar className="h-9 w-9 border-2 border-secondary">
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className="h-9 w-9 border-2 border-primary">
      <AvatarFallback className="bg-primary text-primary-foreground">
        <Heart className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  );
}
