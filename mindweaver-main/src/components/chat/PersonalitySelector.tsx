import { Button } from '@/components/ui/button';
import { Brain, Heart, LineChart, Palette } from 'lucide-react';

type Personality = 'coach' | 'friend' | 'analyst' | 'creative' | string;

interface PersonalityOption {
  id: string;
  label: string;
  icon: any;
  color: string;
  isCustom?: boolean;
}

interface PersonalitySelectorProps {
  value: Personality;
  onChange: (personality: Personality) => void;
  customPersonalities?: PersonalityOption[];
}

const defaultPersonalities: PersonalityOption[] = [
  { id: 'coach', label: 'Тренер', icon: Brain, color: 'text-orange-500' },
  { id: 'friend', label: 'Друг', icon: Heart, color: 'text-pink-500' },
  { id: 'analyst', label: 'Аналитик', icon: LineChart, color: 'text-blue-500' },
  { id: 'creative', label: 'Креатив', icon: Palette, color: 'text-purple-500' },
];

const PersonalitySelector = ({ value, onChange, customPersonalities = [] }: PersonalitySelectorProps) => {
  const allPersonalities = [...defaultPersonalities, ...customPersonalities];
  
  return (
    <div className="flex gap-2 flex-wrap">
      {allPersonalities.map(({ id, label, icon: Icon, color, isCustom }) => (
        <Button
          key={id}
          variant={value === id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(id as Personality)}
          className="gap-2"
          title={isCustom ? 'Кастомный режим' : label}
        >
          <Icon className={`w-4 h-4 ${value === id ? 'text-white' : color}`} />
          {label}
          {isCustom && <span className="text-xs opacity-70">★</span>}
        </Button>
      ))}
    </div>
  );
};

export default PersonalitySelector;
