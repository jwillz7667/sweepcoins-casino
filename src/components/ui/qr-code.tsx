'use client';

import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 256, className }: QRCodeProps) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="H"
      includeMargin
      className={cn("rounded-lg", className)}
    />
  );
} 