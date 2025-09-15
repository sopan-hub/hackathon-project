
'use client';

import { Icons } from "@/components/icons";

export default function EcoAdvisorPage() {

  return (
    <div className="space-y-8">
       <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Eco Advisor
        </h1>
        <p className="text-muted-foreground">
          Your personal AI guide to a greener lifestyle.
        </p>
      </div>

       <div className="eco-card">
            <div className="eco-card-title">Coming Soon!</div>
            <div className="eco-card-icon">
                <Icons.lightbulb className="bg-gradient-to-r from-yellow-400 to-orange-500" />
            </div>
            <div className="eco-card-content text-center">
                <p className="text-lg text-muted-foreground">
                    We're working hard on building this feature. The Eco Advisor will be able to analyze images and provide you with actionable environmental advice.
                </p>
            </div>
        </div>
    </div>
  );
}
