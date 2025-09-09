'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { lessons } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

export default function QuizPage({ params }: { params: { id: string; chapter: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { id, chapter: chapterParam } = params;
  const lesson = lessons.find((l) => l.id === id);
  const chapterIndex = parseInt(chapterParam, 10);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!lesson || isNaN(chapterIndex) || chapterIndex < 0 || chapterIndex >= lesson.chapters.length) {
    notFound();
  }

  const chapter = lesson.chapters[chapterIndex];
  // The quiz logic was assuming a single question, which is not what the data structure supports.
  const question = chapter.quiz.questions[0]; 
  const isCorrect = selectedAnswer !== null && parseInt(selectedAnswer) === question.correctAnswerIndex;
  const isLastChapter = chapterIndex === lesson.chapters.length - 1;

  const handleCheckAnswer = () => {
    setIsSubmitted(true);
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: `You've earned ${Math.round(lesson.ecoPoints / lesson.chapters.length)} eco-points.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Not quite!",
        description: "That's not the right answer. Try again!",
      });
    }
  };

  const handleNext = () => {
    if (isLastChapter) {
        router.push('/lessons');
    } else {
        router.push(`/lessons/${lesson.id}/${chapterIndex + 1}`);
    }
  }

  const handleRetry = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }


  return (
    <div className="max-w-2xl mx-auto">
       <div className="mb-4 space-y-2">
        <Link href={`/lessons/${lesson.id}/${chapterIndex}`} className="text-sm text-primary hover:underline block mb-4">
            &larr; Back to Chapter
        </Link>
        <Progress value={((chapterIndex + 1) / lesson.chapters.length) * 100} className="h-2"/>
        <p className="text-sm text-muted-foreground text-center">Chapter {chapterIndex + 1} of {lesson.chapters.length} Quiz</p>
      </div>

      <div className="card">
        <div className="card-title !normal-case !text-2xl">{question.question}</div>
        <div className="card-content">
          <RadioGroup 
            onValueChange={setSelectedAnswer} 
            value={selectedAnswer ?? undefined}
            className="space-y-4"
            disabled={isSubmitted}
          >
            {question.options.map((option, index) => (
               <Label 
                key={index} 
                htmlFor={`option-${index}`}
                className={cn(
                  "flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors",
                  !isSubmitted && "hover:bg-black/5",
                  isSubmitted && index === question.correctAnswerIndex && "border-green-500 bg-green-500/10",
                  isSubmitted && selectedAnswer === index.toString() && !isCorrect && "border-red-500 bg-red-500/10",
                  selectedAnswer === index.toString() && !isSubmitted && "border-primary bg-black/10"
                )}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isSubmitted} />
                <span>{option}</span>
              </Label>
            ))}
          </RadioGroup>

            {isSubmitted && (
                <div className={cn(
                    "mt-6 text-center font-bold p-4 rounded-md",
                    isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                )}>
                    {isCorrect ? "Correct! Well done." : "That's not the right answer."}
                </div>
            )}

        </div>
        <div className="card-bar" />
        <div className="card-footer justify-end">
            {!isSubmitted ? (
                 <Button onClick={handleCheckAnswer} disabled={selectedAnswer === null} className="ml-auto">
                    Check Answer
                    <Icons.chevronRight className="ml-2 h-4 w-4" />
                </Button>
            ) : isCorrect ? (
                <Button onClick={handleNext} className="ml-auto">
                    {isLastChapter ? 'Finish Lesson' : 'Next Chapter'}
                    <Icons.chevronRight className="ml-2 h-4 w-4" />
                </Button>
            ) : (
                 <Button onClick={handleRetry} className="ml-auto" variant="outline">
                    Try Again
                    <Icons.repeat className="ml-2 h-4 w-4" />
                </Button>
            )}
         
        </div>
      </div>
    </div>
  );
}
