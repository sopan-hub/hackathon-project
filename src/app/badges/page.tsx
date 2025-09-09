import { userBadges } from "@/lib/data";
import { Icons } from "@/components/icons";

export default function BadgesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Available Badges
        </h1>
        <p className="text-muted-foreground">
          Complete lessons, challenges, and community activities to earn these rewards.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {userBadges.map((badge) => (
          <div key={badge.id} className="eco-card text-center p-6">
            <div className="eco-card-title !text-lg !self-center !text-center col-span-2">
              {badge.name}
            </div>
            <div className="eco-card-content col-span-2 text-center items-center flex flex-col">
              <div className="p-4 bg-secondary rounded-full mb-4">
                <badge.icon className="h-10 w-10 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
