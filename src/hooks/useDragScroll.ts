/**
 * Hook para habilitar drag scroll em containers horizontais
 * Funciona tanto no desktop (mouse) quanto mobile (touch)
 */
import { useRef, useEffect, useCallback } from 'react';

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    isDown.current = true;
    ref.current.classList.add('dragging');
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDown.current = false;
    ref.current?.classList.remove('dragging');
  }, []);

  const handleMouseUp = useCallback(() => {
    isDown.current = false;
    ref.current?.classList.remove('dragging');
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDown.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Velocidade do scroll
    ref.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  // Scroll horizontal com wheel (Shift + scroll ou scroll horizontal nativo)
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!ref.current) return;
    
    // Se deltaX existe (scroll horizontal nativo) ou Shift está pressionado
    if (e.deltaX !== 0 || e.shiftKey) {
      e.preventDefault();
      ref.current.scrollLeft += e.deltaX || e.deltaY;
    } else if (Math.abs(e.deltaY) > 0) {
      // Converte scroll vertical em horizontal quando o cursor está sobre o container
      e.preventDefault();
      ref.current.scrollLeft += e.deltaY;
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove, handleWheel]);

  return ref;
}

/**
 * Calcula a altura normalizada da barra de chuva
 * Garante que a barra fique dentro do container, com valor mínimo visível
 * @param amount - Quantidade de chuva em mm
 * @param maxHeight - Altura máxima em pixels (default: 60)
 * @param maxAmount - Quantidade máxima para normalização (default: 10mm)
 */
export function getRainBarHeight(amount: number, maxHeight = 60, maxAmount = 10): number {
  if (amount <= 0) return 4; // Mínimo visível
  
  // Normaliza para um valor entre 4 e maxHeight
  const normalized = Math.min(amount / maxAmount, 1);
  return Math.max(Math.round(normalized * maxHeight), 4);
}
