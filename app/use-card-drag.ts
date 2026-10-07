'use client';

import {useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent} from 'react';

export type DragCard = {id: string; star: number; where: 'shop' | 'bench' | 'board'; uid?: string; index?: number};
export type DropTarget = {zone: 'board' | 'bench'; index?: number};
type DragView = {card: DragCard; x: number; y: number; target: DropTarget | null};

// Pointer events share one gesture path across mouse, touch and pen.
export function useCardDrag(enabled: boolean, context: string, onDrop: (card: DragCard, target: DropTarget) => void) {
  const [drag, setDrag] = useState<DragView | null>(null);
  const gesture = useRef<{card: DragCard; pointer: number; originX: number; originY: number; x: number; y: number; active: boolean; element: HTMLElement} | null>(null);
  const active = useRef(false);
  const suppressClick = useRef(false);
  const callback = useRef(onDrop);
  callback.current = onDrop;

  const targetAt = (x: number, y: number): DropTarget | null => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-drop-zone]');
    if (!el) return null;
    return {zone: el.dataset.dropZone as DropTarget['zone'], ...(el.dataset.slot !== undefined ? {index: Number(el.dataset.slot)} : {})};
  };

  const cancel = useCallback(() => {
    const current = gesture.current;
    gesture.current = null;
    active.current = false;
    if (current?.element.hasPointerCapture(current.pointer)) current.element.releasePointerCapture(current.pointer);
    setDrag(null);
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const current = gesture.current;
      if (!current || e.pointerId !== current.pointer) return;
      current.x = e.clientX; current.y = e.clientY;
      if (!current.active && Math.hypot(e.clientX-current.originX, e.clientY-current.originY) < 7) return;
      current.active = true;
      suppressClick.current = true;
      if (e.cancelable) e.preventDefault();
      setDrag({card: current.card, x: e.clientX, y: e.clientY, target: targetAt(e.clientX, e.clientY)});
    };
    const end = (e: PointerEvent) => {
      const current = gesture.current;
      if (!current || current.pointer !== e.pointerId) return;
      const target = current.active ? targetAt(e.clientX, e.clientY) : null;
      cancel();
      if (target) callback.current(current.card, target);
    };
    const cancelled = (e: PointerEvent) => {if (gesture.current?.pointer === e.pointerId) cancel();};
    const key = (e: KeyboardEvent) => {if (e.key === 'Escape') cancel();};
    const hidden = () => {if (document.hidden) cancel();};
    document.addEventListener('pointermove', move, {passive: false});
    document.addEventListener('pointerup', end);
    document.addEventListener('pointercancel', cancelled);
    document.addEventListener('lostpointercapture', cancelled);
    document.addEventListener('keydown', key);
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('blur', cancel);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', end);
      document.removeEventListener('pointercancel', cancelled);
      document.removeEventListener('lostpointercapture', cancelled);
      document.removeEventListener('keydown', key);
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener('blur', cancel);
      cancel();
    };
  }, [cancel]);

  useEffect(() => {cancel();}, [enabled, context, cancel]);
  useEffect(() => {
    if (!drag) return;
    let frame: number, previous = performance.now();
    const scroll = (time: number) => {
      const current = gesture.current;
      if (!current?.active) return;
      const edge = 100, bottom = window.innerHeight - 85;
      const speed = current.y < edge ? -Math.min(1, (edge-current.y)/edge) : current.y > bottom-edge ? Math.min(1, (current.y-(bottom-edge))/edge) : 0;
      if (speed) {
        window.scrollBy(0, speed * Math.min(time-previous, 32) * .7);
        setDrag({card: current.card, x: current.x, y: current.y, target: targetAt(current.x, current.y)});
      }
      previous = time;
      frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [!!drag]);

  const bindings = (card: DragCard, canDrag = true) => ({
    'data-drag-card': canDrag && enabled ? card.where : undefined,
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
      suppressClick.current = false;
      if (!enabled || !canDrag || !e.isPrimary || e.button !== 0 || gesture.current) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      active.current = true;
      gesture.current = {card, pointer: e.pointerId, originX: e.clientX, originY: e.clientY, x: e.clientX, y: e.clientY, active: false, element: e.currentTarget};
    },
    onClickCapture: (e: React.MouseEvent<HTMLElement>) => {
      if (suppressClick.current && e.detail !== 0) {e.preventDefault(); e.stopPropagation(); suppressClick.current = false;}
    },
    onDragStart: (e: React.DragEvent) => e.preventDefault(),
    onContextMenu: (e: React.MouseEvent) => {if (gesture.current) e.preventDefault();},
  });
  return {drag, active, bindings};
}
