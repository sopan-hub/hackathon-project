
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { teacherAssistant } from '@/ai/flows/teacher-assistant';
import type { ChatMessage } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUserProgress } from '@/context/user-progress-context';

export default function TeacherAssistantPage() {
  const { toast } = useToast();
  const { userProfile } = useUserProgress();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

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
      const result = await teacherAssistant({
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

  const QuickActionButton = ({ text, icon }: { text: string, icon: React.ElementType }) => {
    const Icon = icon;
    return (
        <Button variant="outline" className="w-full justify-start h-auto py-3" onClick={() => setChatInput(text)}>
            <Icon className="mr-2 h-5 w-5 text-primary"/>
            <span className="text-wrap text-left">{text}</span>
        </Button>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Teacher Assistant
        </h1>
        <p className="text-muted-foreground">
          Your AI-powered "EcoBuddy" to help manage your class and eco-club.
        </p>
      </div>

       <div
          className={cn('eco-card flex flex-col h-[70vh]')}
        >
          <div className="eco-card-title !text-xl !normal-case">
            Chat with EcoBuddy
          </div>
          <div className="eco-card-icon">
            <Icons.sparkles className="bg-gradient-to-r from-blue-400 to-purple-500" />
          </div>
          <div className="eco-card-content flex-grow flex flex-col justify-between">
            <ScrollArea className="flex-grow h-[calc(70vh-200px)] pr-4 -mr-4">
              <div className="space-y-4">
                {chatHistory.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <Icons.lightbulb className="h-12 w-12 mb-4 text-primary" />
                        <p className="font-medium mb-6">Ask me anything about your class, lessons, or challenges!</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                            <QuickActionButton text="Suggest a new hands-on challenge for my 8th-grade class" icon={Icons.trophy} />
                            <QuickActionButton text="What are some common topics where students struggle?" icon={Icons.barChart} />
                            <QuickActionButton text="Give me some ideas for a week-long Earth Day event at school" icon={Icons.calendar} />
                            <QuickActionButton text="How can I explain the importance of biodiversity in a simple way?" icon={Icons.leaf} />
                        </div>
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
                           <AvatarFallback className="bg-primary text-primary-foreground">
                            <Icons.sparkles />
                           </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-prose rounded-lg p-3 text-sm',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userProfile?.avatar_url} />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                 {chatLoading && (
                      <div className="flex items-start gap-3 justify-start">
                         <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
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
                placeholder="Ask EcoBuddy for help..."
                className="flex-grow"
                rows={1}
                disabled={chatLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit(e);
                  }
                }}
              />
              <Button type="submit" disabled={chatLoading || !chatInput.trim()}>
                Send
              </Button>
            </form>
          </div>
        </div>

    </div>
  );
}
