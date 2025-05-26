
import React from 'react';
import { useTheme, Font } from '@/contexts/ThemeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fonts: { value: Font; label: string }[] = [
  { value: 'geist-mono', label: 'Geist Mono' },
  { value: 'geist-sans', label: 'Geist Sans' },
  { value: 'kalam', label: 'Kalam' },
  { value: 'indie-flower', label: 'Indie Flower' },
  { value: 'lancelot', label: 'Lancelot' },
  { value: 'cormorant-upright', label: 'Cormorant Upright' },
];

const FontToggle: React.FC = () => {
  const { font, setFont } = useTheme();

  return (
    <Select value={font} onValueChange={(newFont) => setFont(newFont as Font)}>
      <SelectTrigger className="w-[180px] text-xs sm:text-sm">
        <SelectValue placeholder="Select font" />
      </SelectTrigger>
      <SelectContent>
        {fonts.map((f) => (
          <SelectItem key={f.value} value={f.value}>
            {f.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FontToggle;
