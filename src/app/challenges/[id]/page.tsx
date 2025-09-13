
"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { challenges, userBadges } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserProgress } from "@/context/user-progress-context";


export default function ChallengeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const { addEcoPoints, addBadge } = useUserProgress();
  const challenge = challenges.find((c) => c.id === id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!challenge) {
    notFound();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile.name);
      addEcoPoints(challenge.ecoPoints);
      const challengeBadge = userBadges.find(b => b.id === '5');
      if (challengeBadge) addBadge(challengeBadge);
      
      setIsSubmitted(true);
      toast({
        title: "Challenge Submitted!",
        description: `You've earned ${challenge.ecoPoints} Eco-Points and a badge for completing "${challenge.title}".`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image to upload.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-title">Challenge Complete!</div>
          <div className="card-icon">
            <Icons.trophy className="bg-gradient-to-r from-yellow-400 to-orange-500" />
          </div>
          <div className="card-content text-center">
            <p className="text-lg">
              Congratulations! You have successfully submitted your entry for the
              challenge: <strong>{challenge.title}</strong>.
            </p>
            <p className="text-primary font-bold text-2xl my-4">
              +{challenge.ecoPoints} Eco-Points
            </p>
            <p className="text-muted-foreground">
              Your submission is under review. Thank you for your contribution!
            </p>
          </div>
          <div className="card-bar" />
          <div className="card-footer">
            <Button asChild className="w-full">
              <Link href="/challenges">Back to Challenges</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="card-title !normal-case !text-4xl">
          <Link
            href="/challenges"
            className="text-sm text-primary hover:underline block mb-4"
          >
            &larr; Back to Challenges
          </Link>
          {challenge.title}
        </div>
        <div className="card-icon">
          <Icons.trophy className="bg-gradient-to-r from-yellow-400 to-orange-500" />
        </div>
        <div className="card-content !p-0">
          <div className="p-6">
            <Badge variant="default" className="w-fit mb-2">
              {challenge.ecoPoints} Eco-Points
            </Badge>
            <p className="text-lg text-muted-foreground">
              {challenge.description}
            </p>
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-bold font-headline">
                Submit Your Entry
              </h3>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Upload Photo</Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              {preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Image Preview:</p>
                  <Image
                    src={preview}
                    alt="Image preview"
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="card-bar" />
          <div className="card-footer p-6">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="w-full"
            >
              Submit for {challenge.ecoPoints} Points
              <Icons.chevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
