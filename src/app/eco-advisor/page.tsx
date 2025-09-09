'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import {
  ecoAdvisor,
  chatWithAdvisor,
  type EcoAdvisorOutput,
} from '@/ai/flows/eco-advisor';
import type { ChatMessage } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function EcoAdvisorPage() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<EcoAdvisorOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Reset previous results
      setAnalysis(null);
      setChatHistory([]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select an image to analyze.',
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setChatHistory([]);

    try {
      const result = await ecoAdvisor({ photoDataUri: preview });
      setAnalysis(result);
      const initialChat: ChatMessage[] = [
        { role: 'user', content: 'Here is the image I uploaded.' },
        {
          role: 'model',
          content: `I've analyzed your image. It looks like a situation involving ${result.aiCategory.replace(
            '_',
            ' '
          )}. Here are my suggestions. What would you like to discuss?`,
        },
      ];
      setChatHistory(initialChat);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'Sorry, we could not analyze the image at this time. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', content: chatInput },
    ];
    setChatHistory(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const result = await chatWithAdvisor({
        message: chatInput,
        history: chatHistory.map(h => ({role: h.role, parts: [{text: h.content}]}))
      });
      setChatHistory([
        ...newHistory,
        { role: 'model', content: result.response },
      ]);
    } catch (error) {
      console.error('Chat failed:', error);
      toast({
        variant: 'destructive',
        title: 'Chat Error',
        description: 'Sorry, the chat is not available right now.',
      });
    } finally {
      setChatLoading(false);
    }
  };

  const AnalysisCard = ({
    title,
    content,
    icon,
    variant = 'default',
  }: {
    title: string;
    content: string;
    icon: React.ElementType;
    variant?: 'positive' | 'negative' | 'default';
  }) => {
    const Icon = icon;
    const colors = {
      positive: 'border-green-500/50 bg-green-500/10',
      negative: 'border-red-500/50 bg-red-500/10',
      default: 'bg-secondary/50',
    };
    return (
      <div className={cn('rounded-lg border p-4 space-y-2', colors[variant])}>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-muted-foreground">{content}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Eco Advisor
        </h1>
        <p className="text-muted-foreground">
          Get AI-powered advice on environmental situations. Upload a photo to
          get started.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="eco-card">
            <div className="eco-card-title !text-xl !normal-case">
              Upload an Image
            </div>
            <div className="eco-card-icon">
              <Icons.lightbulb className="bg-gradient-to-r from-yellow-400 to-orange-500" />
            </div>
            <div className="eco-card-content space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="picture">
                  Select a photo of an environmental situation
                </Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icons.upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </div>
              {preview && (
                <div className="mt-4 border rounded-lg p-2 bg-background/50">
                  <p className="text-sm font-medium mb-2">Image Preview:</p>
                  <Image
                    src={preview}
                    alt="Image preview"
                    width={500}
                    height={300}
                    className="rounded-md object-cover w-full aspect-video"
                  />
                </div>
              )}
            </div>
            <div className="eco-card-bar" />
            <div className="eco-card-footer">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Icons.lightbulb className="mr-2 h-4 w-4" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
          </div>

          {loading && (
            <div className="eco-card">
              <div className="eco-card-title !text-xl !normal-case">
                AI Analysis
              </div>
              <div className="eco-card-icon">
                <Icons.loader className="animate-spin" />
              </div>
              <div className="eco-card-content space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          )}

          {analysis && (
            <div className="eco-card">
              <div className="eco-card-title !text-xl !normal-case">
                AI Analysis
              </div>
              <div className="eco-card-icon">
                <Icons.sparkles className="bg-gradient-to-r from-purple-400 to-pink-500" />
              </div>
              <div className="eco-card-content space-y-4">
                <AnalysisCard
                  title="Verdict"
                  content={
                    analysis.aiVerdict === 'positive'
                      ? 'This is an eco-friendly situation!'
                      : 'This situation is potentially harmful to the environment.'
                  }
                  icon={
                    analysis.aiVerdict === 'positive'
                      ? Icons.checkCircle
                      : Icons.alertCircle
                  }
                  variant={analysis.aiVerdict as any}
                />
                <AnalysisCard
                  title="Immediate Action"
                  content={analysis.immediateAction}
                  icon={Icons.zap}
                />
                <AnalysisCard
                  title="Short-Term Action"
                  content={analysis.shortTermAction}
                  icon={Icons.calendar}
                />
                <AnalysisCard
                  title="Long-Term Habit"
                  content={analysis.longTermAction}
                  icon={Icons.repeat}
                />
              </div>
            </div>
          )}
        </div>

        <div
          className={cn(
            'eco-card flex flex-col',
            !analysis && 'hidden lg:flex'
          )}
        >
          <div className="eco-card-title !text-xl !normal-case">
            Chat with Advisor
          </div>
          <div className="eco-card-icon">
            <Icons.messageCircle className="bg-gradient-to-r from-blue-400 to-purple-500" />
          </div>
          <div className="eco-card-content flex-grow flex flex-col justify-between">
            <ScrollArea className="flex-grow h-[300px] pr-4 -mr-4">
              <div className="space-y-4">
                {!analysis ? (
                   <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <Icons.lightbulb className="h-12 w-12 mb-4" />
                        <p className="font-medium">Upload an image to start a conversation with your AI Eco Advisor.</p>
                    </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-start gap-3',
                        message.role === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      )}
                    >
                      {message.role === 'model' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Icons.sparkles />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-xs rounded-lg p-3 text-sm',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        {message.content}
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                 {chatLoading && (
                      <div className="flex items-start gap-3 justify-start">
                         <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            <Icons.sparkles />
                          </AvatarFallback>
                        </Avatar>
                         <div className="bg-muted rounded-lg p-3">
                            <Icons.loader className="animate-spin h-5 w-5" />
                        </div>
                      </div>
                  )}
              </div>
            </ScrollArea>
            <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-grow"
                rows={1}
                disabled={!analysis || chatLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit(e);
                  }
                }}
              />
              <Button type="submit" disabled={!analysis || chatLoading || !chatInput.trim()}>
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
