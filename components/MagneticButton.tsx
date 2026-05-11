'use client';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { useMagnetic } from '@/lib/useMagnetic';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { strength?: number };
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { strength?: number };

export function MagneticButton({ strength = 0.32, ...props }: ButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>(strength);
  return <button ref={ref} {...props} />;
}

export function MagneticLink({ strength = 0.32, ...props }: AnchorProps) {
  const ref = useMagnetic<HTMLAnchorElement>(strength);
  return <a ref={ref} {...props} />;
}
