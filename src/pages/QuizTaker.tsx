
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle } from "lucide-react";

// Mock quiz data
const mockQuizData = {
  quiz_1: {
    title: "Product Feedback Survey",
    questions: [
      {
        questionText: "What is your biggest challenge with project management?",
        options: ["Time tracking", "Team communication", "Resource allocation", "Deadline management"]
      },
      {
        questionText: "How large is your team?",
        options: ["1-5 people", "6-15 people", "16-50 people", "50+ people"]
      },
      {
        questionText: "What's your budget range for project management tools?",
        options: ["$0-50/month", "$50-200/month", "$200-500/month", "$500+/month"]
      },
      {
        questionText: "Which features are most important to you?",
        options: ["Gantt charts", "Time tracking", "Reporting", "Integrations"]
      },
      {
        questionText: "How did you hear about us?",
        options: ["Social media", "Google search", "Referral", "Advertisement"]
      }
    ],
    completionButtonText: "Get Free Trial",
    completionButtonURL: "https://example.com/trial"
  },
  quiz_2: {
    title: "Lead Generation Quiz",
    questions: [
      {
        questionText: "What type of business do you run?",
        options: ["E-commerce", "SaaS", "Consulting", "Other"]
      },
      {
        questionText: "What's your main marketing goal?",
        options: ["Increase sales", "Build brand awareness", "Generate leads", "Retain customers"]
      },
      {
        questionText: "What's your monthly marketing budget?",
        options: ["$0-1,000", "$1,000-5,000", "$5,000-10,000", "$10,000+"]
      }
    ],
    completionButtonText: "Schedule Demo",
    completionButtonURL: "https://example.com/demo"
  }
};

const QuizTaker = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching quiz data
    setTimeout(() => {
      const quizData = mockQuizData[quizId as keyof typeof mockQuizData];
      if (quizData) {
        setQuiz(quizData);
      }
      setIsLoading(false);
    }, 500);
  }, [quizId]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (currentQuestionIndex + 1 < quiz.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setIsCompleted(true);
      }
    }
  };

  const handleRedirect = () => {
    window.location.href = quiz.completionButtonURL;
  };

  const progressPercentage = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardContent>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
            <p className="text-gray-600">The quiz you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">QuizFlow</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          
          {!isCompleted && (
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span>{Math.round(progressPercentage)}% complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          {!isCompleted ? (
            /* Question Display */
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                  {quiz.questions[currentQuestionIndex].questionText}
                </h2>
                
                <div className="space-y-3 mb-8">
                  {quiz.questions[currentQuestionIndex].options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === option
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          selectedAnswer === option
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === option && (
                            <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                          )}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                <Button 
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
                  size="lg"
                >
                  {currentQuestionIndex + 1 === quiz.questions.length ? 'Complete Quiz' : 'Next Question'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Completion Screen */
            <Card className="shadow-xl border-0 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Quiz Completed! 🎉
                </h2>
                
                <p className="text-gray-600 mb-8 text-lg">
                  Thank you for taking the time to complete our quiz. 
                  Your responses help us serve you better.
                </p>
                
                <Button 
                  onClick={handleRedirect}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-3"
                >
                  {quiz.completionButtonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <p className="text-sm text-gray-500 mt-4">
                  You'll be redirected to continue your journey with us.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;
