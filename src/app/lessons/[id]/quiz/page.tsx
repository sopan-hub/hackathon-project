'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { lessons } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const lesson = lessons.find((l) => l.id === params.id);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!lesson) {
    notFound();
  }

  const quiz = lesson.quiz;
  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleAnswerSelect = (optionIndex: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };
  
  const score = selectedAnswers.reduce((acc, answer, index) => {
    return (answer !== null && parseInt(answer) === quiz.questions[index].correctAnswerIndex) ? acc + 1 : acc;
  }, 0);

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
           <div className="card-title">Quiz Results</div>
            <div className="card-icon">
                <Icons.trophy className="bg-gradient-to-r from-yellow-400 to-orange-500" />
            </div>
            <div className="card-content flex flex-col items-center gap-4">
                 <p className="text-muted-foreground text-center">You scored</p>
                 <div className="relative h-32 w-32">
                    <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-secondary" strokeWidth="2"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeWidth="2" strokeDasharray={`${(score / quiz.questions.length) * 100}, 100`} strokeDashoffset="0" transform="rotate(-90 18 18)"></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">{score}/{quiz.questions.length}</div>
                 </div>
                 <p className="text-lg font-medium">{score / quiz.questions.length > 0.7 ? "Excellent Work!" : "Good Effort!"}</p>
                 <p className="text-muted-foreground text-center">You've earned {lesson.ecoPoints} eco-points!</p>
            </div>
            <div className="card-bar" />
            <div className="card-footer flex-col gap-4">
                <Button onClick={() => router.push('/lessons')} className="w-full">
                Back to Lessons
                </Button>
                <Button onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers([]);
                    setShowResults(false);
                }} variant="outline" className="w-full">
                Retake Quiz
                </Button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 space-y-2">
        <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="h-2"/>
        <p className="text-sm text-muted-foreground text-center">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
      </div>

      <div className="card">
        <div className="card-title !normal-case !text-2xl">{currentQuestion.question}</div>
        <div className="card-content">
          <RadioGroup 
            onValueChange={(value) => handleAnswerSelect(value)} 
            value={selectedAnswers[currentQuestionIndex] ?? undefined}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => (
              <Label 
                key={index} 
                htmlFor={`option-${index}`}
                className={cn(
                  "flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-black/5",
                  selectedAnswers[currentQuestionIndex] === index.toString() && "border-primary bg-black/10"
                )}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <span>{option}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <div className="card-bar" />
        <CardFooter className="card-footer">
          <Button onClick={handleNext} disabled={selectedAnswers[currentQuestionIndex] == null} className="ml-auto">
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish'}
            <Icons.chevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}
