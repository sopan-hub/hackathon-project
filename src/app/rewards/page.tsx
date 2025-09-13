
'use client';
import { rewards } from "@/lib/data";
import { Icons } from "@/components/icons";
import { useUserProgress } from "@/context/user-progress-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const dynamic = 'force-dynamic';

export default function RewardsPage() {
    const { ecoPoints, addEcoPoints } = useUserProgress();
    const { toast } = useToast();

    const handleRedeem = (cost: number) => {
        if (ecoPoints >= cost) {
            addEcoPoints(-cost);
            toast({
                title: "Reward Redeemed!",
                description: `You have successfully redeemed a reward. ${cost} eco-points have been deducted.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Not enough points!",
                description: "You do not have enough eco-points to redeem this reward.",
            });
        }
    };


  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Redeem Rewards
        </h1>
        <p className="text-muted-foreground">
          Use your hard-earned eco-points to claim real-world rewards!
        </p>
      </div>

       <div className="eco-card p-6">
            <div className="eco-card-title !text-sm !uppercase !font-medium">Your Balance</div>
             <div className="eco-card-icon !text-3xl">
                <Icons.leaf className="bg-gradient-to-r from-green-400 to-blue-500" />
              </div>
            <div className="eco-card-content">
                <div className="text-2xl font-bold">{ecoPoints.toLocaleString()} Eco-Points</div>
            </div>
        </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {rewards.map((reward) => (
          <div key={reward.id} className="eco-card text-center p-6 flex flex-col">
            <div className="eco-card-title !text-lg !self-center !text-center col-span-2">
              {reward.name}
            </div>
            <div className="eco-card-content col-span-2 text-center items-center flex flex-col flex-grow justify-between">
              <div>
                <div className="p-4 bg-secondary rounded-full mb-4 inline-block">
                  <reward.icon className="h-10 w-10 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {reward.description}
                </p>
              </div>
               <div className="w-full mt-6">
                <div className="text-2xl font-bold text-primary mb-4">{reward.cost} points</div>
                 <Button 
                    className="w-full" 
                    disabled={ecoPoints < reward.cost}
                    onClick={() => handleRedeem(reward.cost)}
                >
                    {ecoPoints >= reward.cost ? 'Redeem Now' : 'Not Enough Points'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
