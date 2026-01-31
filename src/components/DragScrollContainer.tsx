/**
 * Componente de container com scroll horizontal arrastável
 * Funciona com mouse no desktop e touch no mobile
 */
import React from 'react';
import { useDragScroll } from '../hooks/useDragScroll';

interface DragScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  role?: string;
}

export const DragScrollContainer: React.FC<DragScrollContainerProps> = ({ 
  children, 
  className = '',
  ariaLabel,
  role
}) => {
  const scrollRef = useDragScroll<HTMLDivElement>();
  
  return (
    <div 
      ref={scrollRef}
      className={`overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing ${className}`}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

export default DragScrollContainer;
