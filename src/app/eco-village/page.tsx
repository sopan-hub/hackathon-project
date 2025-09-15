
'use client';

import { useState } from 'react';
import { ecoVillageScenarios } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';

type ImpactScores = {
  environment: number;
  community: number;
  economy: number;
};

const initialScores: ImpactScores = {
  environment: 50,
  community: 50,
  economy: 50,
};

export default function EcoVillagePage() {
  const [scores, setScores] = useState<ImpactScores>(initialScores);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showConsequence, setShowConsequence] = useState(false);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  const currentScenario = ecoVillageScenarios[currentScenarioIndex];
  const isGameOver = currentScenarioIndex >= ecoVillageScenarios.length;

  const handleChoice = (choiceIndex: number) => {
    setSelectedChoiceIndex(choiceIndex);
    setShowConsequence(true);

    const choice = currentScenario.choices[choiceIndex];
    setScores((prevScores) => ({
      environment: Math.max(0, Math.min(100, prevScores.environment + choice.effects.environment)),
      community: Math.max(0, Math.min(100, prevScores.community + choice.effects.community)),
      economy: Math.max(0, Math.min(100, prevScores.economy + choice.effects.economy)),
    }));
  };

  const handleNext = () => {
    setShowConsequence(false);
    setSelectedChoiceIndex(null);
    setCurrentScenarioIndex(currentScenarioIndex + 1);
  };
  
    const handleRestart = () => {
    setScores(initialScores);
    setCurrentScenarioIndex(0);
    setShowConsequence(false);
    setSelectedChoiceIndex(null);
  };

  const scoreData = [
    { name: 'Environment', value: scores.environment, fill: 'hsl(var(--primary))' },
    { name: 'Community', value: scores.community, fill: 'hsl(var(--accent))' },
    { name: 'Economy', value: scores.economy, fill: 'hsl(var(--secondary))' },
  ];

  if (isGameOver) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="eco-card text-center">
            <div className="eco-card-title">Simulation Complete!</div>
            <div className="eco-card-icon">
                <Icons.award className="bg-gradient-to-r from-yellow-400 to-orange-500" />
            </div>
            <div className="eco-card-content">
                <p className="text-lg text-muted-foreground mb-6">You've completed the Eco-Village simulation. Here are your final scores:</p>
                <div className="h-64 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreData} layout="vertical" margin={{ left: 20, right: 40 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="name" hide />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                         <LabelList dataKey="value" position="right" formatter={(value: number) => `${value}%`} className="font-bold fill-foreground" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                 <Button onClick={handleRestart} size="lg" className="mt-8">Play Again</Button>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
            Welcome to Eco-Village
            </h1>
            <p className="text-muted-foreground">
            Make decisions and see their impact on your virtual community.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6 eco-card">
                 <div className="eco-card-title !text-xl !normal-case">Village Status</div>
                 <div className="eco-card-icon">
                    <Icons.barChart className="bg-gradient-to-r from-yellow-400 to-orange-500" />
                </div>
                 <div className="eco-card-content space-y-4">
                    {Object.entries(scores).map(([key, value]) => (
                        <div key={key}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium capitalize">{key}</span>
                                <span className="text-sm font-bold text-primary">{value}%</span>
                            </div>
                            <Progress value={value} />
                        </div>
                    ))}
                 </div>
            </div>

            <div className="lg:col-span-2 eco-card">
                 <div className="eco-card-title !text-xl !normal-case">{currentScenario.title}</div>
                 <div className="eco-card-icon">
                    <Icons.ecoVillage className="bg-gradient-to-r from-green-400 to-blue-500" />
                </div>
                <div className="eco-card-content">
                    <p className="text-muted-foreground mb-6">{currentScenario.description}</p>
                    
                    {!showConsequence ? (
                        <div className="space-y-4">
                            {currentScenario.choices.map((choice, index) => (
                                <Button 
                                    key={index}
                                    variant="outline"
                                    className="w-full h-auto justify-start p-4 text-left"
                                    onClick={() => handleChoice(index)}
                                >
                                    {choice.text}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-background/50 rounded-lg">
                                <p className="font-semibold text-foreground">"{currentScenario.choices[selectedChoiceIndex!].text}"</p>
                                <p className="text-muted-foreground mt-2 text-sm">{currentScenario.choices[selectedChoiceIndex!].consequence}</p>
                            </div>
                            <Button onClick={handleNext} className="w-full">
                                Next Scenario <Icons.chevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

    