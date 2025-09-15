
'use client';

import { Icons } from "@/components/icons";

export default function TeacherAssistantPage() {

  return (
    <div className="space-y-8">
       <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Teacher Assistant
        </h1>
        <p className="text-muted-foreground">
          AI-powered tools to help you manage your eco-club.
        </p>
      </div>

       <div className="eco-card">
            <div className="eco-card-title">Coming Soon!</div>
            <div className="eco-card-icon">
                <Icons.teacherAssistant className="bg-gradient-to-r from-purple-400 to-pink-500" />
            </div>
            <div className="eco-card-content text-center">
                <p className="text-lg text-muted-foreground">
                    This section will provide teachers with tools to track student progress, generate new lesson ideas, and manage their eco-club activities. Stay tuned!
                </p>
            </div>
        </div>
    </div>
  );
}
