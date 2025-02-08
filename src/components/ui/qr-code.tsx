'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
}

export function QRCode({ value, size = 256 }: QRCodeProps) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="H"
      includeMargin
      className="rounded-lg"
    />
  );
} 