
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/icons';
import { ecoVillageScenarios } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Stat = 'environment' | 'community' | 'economy';

export default function EcoVillagePage() {
  const { toast } = useToast();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [stats, setStats] = useState({ environment: 50, community: 50, economy: 50 });
  const [isGameOver, setIsGameOver] = useState(false);

  const currentScenario = ecoVillageScenarios[currentScenarioIndex];

  const handleChoice = (effects: Record<Stat, number>) => {
    const newStats = { ...stats };
    let gameOver = false;

    for (const key in effects) {
      const statKey = key as Stat;
      newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + effects[statKey]));
      if (newStats[statKey] === 0) {
        gameOver = true;
      }
    }

    setStats(newStats);

    toast({
      title: 'Decision Made!',
      description: `Your choice has impacted the village. Check the new stats.`,
    });

    if (gameOver) {
      setIsGameOver(true);
      toast({
        variant: 'destructive',
        title: 'Game Over!',
        description: `One of your village stats has hit zero. The simulation has ended.`,
      });
      return;
    }
    
    if (currentScenarioIndex < ecoVillageScenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else {
        setIsGameOver(true);
        toast({
            title: 'Congratulations!',
            description: `You have completed all the scenarios for the Eco-Village!`,
        });
    }
  };

  const restartGame = () => {
    setCurrentScenarioIndex(0);
    setStats({ environment: 50, community: 50, economy: 50 });
    setIsGameOver(false);
  }

  const getStatColor = (value: number) => {
    if (value > 66) return 'bg-green-500';
    if (value > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const StatBar = ({ icon, label, value }: { icon: React.ElementType, label: string, value: number }) => {
    const Icon = icon;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                </div>
                 <span className="font-bold text-lg">{value}%</span>
            </div>
            <Progress value={value} indicatorClassName={getStatColor(value)} />
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Eco-Village Simulator
        </h1>
        <p className="text-muted-foreground">
          Run your own virtual eco-village. Make choices and see the outcomes.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <div className="eco-card">
                 <div className="eco-card-title !text-xl !normal-case">
                    {isGameOver ? 'Simulation Ended' : `Year ${currentScenarioIndex + 1}: ${currentScenario.title}`}
                </div>
                <div className="eco-card-icon">
                    <Icons.treePine className="bg-gradient-to-r from-green-400 to-blue-500" />
                </div>
                <div className="eco-card-content">
                    {isGameOver ? (
                        <div className="text-center py-10">
                            <h3 className="text-2xl font-bold mb-4">Thank you for playing!</h3>
                            <p className="text-muted-foreground mb-6">
                               {stats.environment === 0 || stats.community === 0 || stats.economy === 0
                                ? "One of your village stats reached zero. A sustainable village needs a balance of all three."
                                : "You've successfully guided your village through the simulation!"
                               }
                            </p>
                            <Button onClick={restartGame}>
                                <Icons.repeat className="mr-2 h-4 w-4" />
                                Start a New Simulation
                            </Button>
                        </div>
                    ) : (
                        <>
                            <p className="text-foreground/90 mb-6">{currentScenario.description}</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {currentScenario.choices.map((choice, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handleChoice(choice.effects)}
                                    className="h-auto w-full p-4 text-wrap justify-start flex flex-col items-start"
                                    variant="outline"
                                >
                                    <span className="font-bold text-base mb-2">{choice.text}</span>
                                    <span className="text-xs text-muted-foreground">{choice.consequence}</span>
                                </Button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
        <div className="md:col-span-1">
             <div className="eco-card">
                 <div className="eco-card-title !text-xl !normal-case">Village Stats</div>
                 <div className="eco-card-icon">
                    <Icons.barChart className="bg-gradient-to-r from-yellow-400 to-orange-500" />
                </div>
                 <div className="eco-card-content space-y-6">
                    <StatBar icon={Icons.leaf} label="Environment" value={stats.environment} />
                    <StatBar icon={Icons.users} label="Community" value={stats.community} />
                    <StatBar icon={Icons.economy} label="Economy" value={stats.economy} />
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}
