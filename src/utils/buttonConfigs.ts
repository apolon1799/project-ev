import { Plus, Minus } from 'lucide-react';

export const BUTTON_CONFIGS = [
  { 
    delta: -1, 
    label: '-1', 
    icon: Minus, 
    colors: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25' 
  },
  { 
    delta: 1, 
    label: '+1', 
    icon: Plus, 
    colors: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/25' 
  },
  { 
    delta: 10, 
    label: '+10', 
    icon: Plus, 
    colors: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25' 
  },
  { 
    delta: -10, 
    label: '-10', 
    icon: Minus, 
    colors: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25' 
  },
];
