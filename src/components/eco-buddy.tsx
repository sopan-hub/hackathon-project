
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ecoBuddyFlow } from '@/ai/flows/eco-buddy';
import type { ChatMessage } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUserProgress } from '@/context/user-progress-context';
import { Input } from './ui/input';
import Image from 'next/image';

export function EcoBuddy() {
  const { toast } = useToast();
  const { userProfile } = useUserProgress();

  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

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

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!chatInput.trim() && !preview) || chatLoading) return;

    let userMessage = chatInput;
    if (preview) {
      userMessage = chatInput || 'Analyze this image.';
    }

    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', content: userMessage, imageUrl: preview ?? undefined },
    ];
    setChatHistory(newHistory);
    setChatInput('');
    setPreview(null);
    setSelectedFile(null);
    setChatLoading(true);

    try {
      const result = await ecoBuddyFlow({
        message: userMessage,
        image: preview ?? undefined,
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
  
  // Drag and Drop handlers
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging || !chatWindowRef.current) return;
    let newX = e.clientX - dragStartRef.current.x;
    let newY = e.clientY - dragStartRef.current.y;
    
    const { innerWidth, innerHeight } = window;
    const { offsetWidth, offsetHeight } = chatWindowRef.current;

    newX = Math.max(-offsetLeft, Math.min(newX, innerWidth - offsetWidth + offsetLeft));
    newY = Math.max(-offsetTop, Math.min(newY, innerHeight - offsetHeight + offsetTop));


    setPosition({ x: newX, y: newY });
  };
  
  const onMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);


  if (!userProfile) return null;


  return (
    <>
      {!isOpen && (
        <Button
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
          onClick={() => setIsOpen(true)}
        >
          <Icons.bot className="h-8 w-8" />
        </Button>
      )}

      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="fixed bottom-6 right-6 z-50 w-[440px] h-[70vh] flex flex-col rounded-2xl shadow-2xl bg-card border overflow-hidden"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
            <div 
                className="flex items-center justify-between p-4 bg-background border-b cursor-grab"
                onMouseDown={onMouseDown}
            >
                <div className="flex items-center gap-2">
                    <Icons.sparkles className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold font-headline">EcoBuddy Assistant</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <Icons.x className="h-5 w-5" />
                </Button>
            </div>
          
            <ScrollArea className="flex-grow p-4">
              <div className="space-y-4">
                {chatHistory.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <Icons.bot className="h-12 w-12 mb-4 text-primary" />
                        <p className="font-medium mb-1">Hello {userProfile.full_name}!</p>
                        <p className="text-sm">I'm EcoBuddy, your personal AI assistant. How can I help you today? You can ask me for lesson ideas, analyze an image, or get advice on an environmental topic.</p>
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
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                           <AvatarFallback>
                            <Icons.sparkles />
                           </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-sm rounded-lg p-3 text-sm',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        {message.imageUrl && (
                          <Image src={message.imageUrl} alt="Uploaded preview" width={200} height={150} className="rounded-md mb-2" />
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === 'user' && userProfile && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userProfile?.avatar_url} />
                          <AvatarFallback>{userProfile.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                 {chatLoading && (
                      <div className="flex items-start gap-3 justify-start">
                         <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
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
             {preview && (
                <div className="p-4 border-t relative">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Image preview:</p>
                  <Image src={preview} alt="Preview" width={100} height={75} className="rounded-md" />
                   <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => { setPreview(null); setSelectedFile(null); }}>
                        <Icons.x className="h-4 w-4" />
                    </Button>
                </div>
              )}
            <form onSubmit={handleChatSubmit} className="p-4 border-t flex gap-2 items-start">
                <div>
                     <Input
                        id="eco-buddy-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        >
                        <Icons.upload className="h-5 w-5" />
                    </Button>
                </div>
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask EcoBuddy anything..."
                className="flex-grow resize-none"
                rows={1}
                disabled={chatLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit(e);
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={chatLoading || (!chatInput.trim() && !preview)}>
                <Icons.send className="h-5 w-5"/>
              </Button>
            </form>
        </div>
      )}
    </>
  );
}
