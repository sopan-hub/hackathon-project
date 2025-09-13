import { communityPosts } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CommunityClient } from "./community-client";

export const dynamic = 'force-dynamic';

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Community Forum
        </h1>
        <p className="text-muted-foreground">
          Share your eco-friendly ideas and collaborate with others.
        </p>
      </div>
      
      <CommunityClient posts={communityPosts} />

    </div>
  );
}
