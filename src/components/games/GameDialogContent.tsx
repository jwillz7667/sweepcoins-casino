import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { GameStats } from "./GameStats";
import { Info } from "lucide-react";

interface GameDialogContentProps {
  title: string;
  description: string;
  image?: string;
  provider?: string;
  volatility?: 'Low' | 'Medium' | 'High';
  minBet?: number;
  maxBet?: number;
  maxWin?: number;
}

export const GameDialogContent = ({
  title,
  description,
  image,
  provider,
  volatility,
  minBet,
  maxBet,
  maxWin,
}: GameDialogContentProps) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      {/* Content implementation */}
    </DialogContent>
  );
};