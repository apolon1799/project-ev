import React from 'react';
import type { CounterState } from '../hooks/useCollaborativeSession';
import { RotateCcw, Clock, Zap } from 'lucide-react';
import { formatTimestamp, BUTTON_CONFIGS, CSS_CLASSES } from '../utils';

interface SharedCounterProps {
  counter: CounterState;
  onUpdate: (delta: number) => void;
  onReset: () => void;
}

const SharedCounter: React.FC<SharedCounterProps> = ({ counter, onUpdate, onReset }) => {
  
  return (
    <div className={CSS_CLASSES.CONTAINER}>
      <div className={CSS_CLASSES.HEADER}>
        <div className={CSS_CLASSES.TITLE_CONTAINER}>
          <div className={CSS_CLASSES.ICON_CONTAINER}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className={CSS_CLASSES.TITLE}>
            Shared Counter
          </h3>
        </div>
        
        <div className={CSS_CLASSES.COUNTER_DISPLAY}>
          <div className={CSS_CLASSES.COUNTER_VALUE}>
            {counter.value}
          </div>
          <div className={CSS_CLASSES.COUNTER_GLOW}>
            {counter.value}
          </div>
        </div>
        
        <div className={CSS_CLASSES.BUTTON_GRID}>
          {BUTTON_CONFIGS.map(({ delta, label, icon: Icon, colors }) => (
            <button
              key={delta}
              onClick={() => onUpdate(delta)}
              className={`${CSS_CLASSES.BASE_BUTTON} bg-gradient-to-r ${colors} hover:shadow-${colors.split(' ')[0].replace('from-', '')}/25`}
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={onReset}
          className={CSS_CLASSES.RESET_BUTTON}
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-semibold">Reset Counter</span>
        </button>
        
        {counter.lastUpdatedBy && (
          <div className={CSS_CLASSES.INFO_CARD}>
            <div className={CSS_CLASSES.INFO_HEADER}>
              <Clock className="w-5 h-5" />
              <span className={CSS_CLASSES.INFO_TITLE}>Last updated by:</span>
            </div>
            <div className={CSS_CLASSES.INFO_VALUE}>
              {counter.lastUpdatedBy}
            </div>
            <div className={CSS_CLASSES.INFO_TIMESTAMP}>
              {formatTimestamp(counter.lastUpdatedAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedCounter;