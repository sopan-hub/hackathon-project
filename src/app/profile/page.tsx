'use client';
import { useUserProgress } from "@/context/user-progress-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
    const { userProfile, ecoPoints, completedLessons, badges, logout } = useUserProgress();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    }

    if (!userProfile) {
        return (
             <div className="eco-card">
                <div className="eco-card-title">Profile</div>
                <div className="eco-card-content">
                    <p>Loading profile...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                My Profile
                </h1>
                <p className="text-muted-foreground">
                View and manage your profile settings and progress.
                </p>
            </div>

            <div className="eco-card lg:max-w-2xl mx-auto">
                <div className="eco-card-title !text-3xl !normal-case flex items-center gap-4">
                     <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
                        <AvatarFallback>{userProfile.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {userProfile.full_name}
                </div>
                <div className="eco-card-icon">
                    <Button onClick={handleLogout} variant="outline" size="sm">
                        <Icons.logOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
                <div className="eco-card-content !p-0 mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-secondary/50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Eco-Points</p>
                            <p className="text-2xl font-bold text-primary">{ecoPoints}</p>
                        </div>
                        <div className="bg-secondary/50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Lessons Completed</p>
                            <p className="text-2xl font-bold">{completedLessons.length}</p>
                        </div>
                        <div className="bg-secondary/50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                            <p className="text-2xl font-bold">{badges.length}</p>
                        </div>
                    </div>
                </div>
                 <div className="eco-card-bar"/>
                 <div className="eco-card-footer justify-end">
                     <Button disabled>Edit Profile (Coming Soon)</Button>
                 </div>
            </div>
        </div>
    );
}
