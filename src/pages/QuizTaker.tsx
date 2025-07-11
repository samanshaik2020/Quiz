
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Quiz data will be fetched from Supabase

const QuizTaker = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        console.log('Fetching quiz with ID:', quizId);
        
        // Check if this is a preview ID (starts with 'preview_')
        if (quizId && quizId.startsWith('preview_')) {
          console.log('This is a preview quiz, using sample data');
          const sampleQuiz = {
            title: "Preview Quiz",
            questions: [
              {
                questionText: "This is a preview question. What would you like to know?",
                options: ["More information", "How to use this", "Features", "Pricing"]
              },
              {
                questionText: "Would you like to create your own quiz?",
                options: ["Yes, definitely", "Maybe later", "I need more info", "No thanks"]
              }
            ],
            completionButtonText: "Finish Preview",
            completionButtonURL: "/"
          };
          setQuiz(sampleQuiz);
          setIsLoading(false);
          return;
        }
        
        // First, try to fetch the quiz directly by ID
    // If the ID starts with 'quiz_', we need to strip that prefix as Supabase expects a UUID
    const databaseId = quizId?.startsWith('quiz_') ? quizId.substring(5) : quizId;
    console.log('Querying database with ID:', databaseId);
    
    const { data: quizData, error } = await supabase
      .from('quizzes')
      .select('*, questions(*)')
      .eq('id', databaseId)
      .single();

        if (error) {
          console.error('Error fetching quiz by ID:', error);
          
          // If that fails, try fetching directly by ID again but with different formatting
          // Sometimes the ID might be stored differently in the database
          console.log('Trying to fetch quiz by ID directly from local storage');
          
          // Try to get from localStorage first (for newly created quizzes)
          const existingQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
          const localQuiz = existingQuizzes.find((q: any) => q.id === quizId);
          
          if (localQuiz) {
            console.log('Found quiz in localStorage:', localQuiz);
            setQuiz({
              title: localQuiz.title,
              questions: localQuiz.questions.map((q: any) => ({
                questionText: q.questionText,
                options: q.options
              })),
              completionButtonText: localQuiz.completionConfig?.buttonText || 'Finish',
              completionButtonURL: localQuiz.completionConfig?.buttonURL || '/'
            });
            setIsLoading(false);
            return;
          }
          
          // If not in localStorage, try by share_url as a fallback
          // But format it correctly for the database query
          console.log('Trying to fetch by share_url as fallback');
          
          // Since we're not querying by share_url anymore, let's handle the case directly
          
          // If it's a sample or test quiz, use mock data
          if (quizId === 'sample' || quizId === 'test') {
            console.log('Using sample quiz data');
            const mockQuiz = {
              title: "Sample Quiz",
              questions: [
                {
                  questionText: "What is your favorite color?",
                  options: ["Red", "Blue", "Green", "Yellow"]
                },
                {
                  questionText: "What is your favorite animal?",
                  options: ["Dog", "Cat", "Bird", "Fish"]
                }
              ],
              completionButtonText: "Finish",
              completionButtonURL: "/"
            };
            
            setQuiz(mockQuiz);
            setIsLoading(false);
            return;
          }
          
          // If we get here, we couldn't find the quiz anywhere
          console.error('Could not find quiz with ID:', quizId);
          setIsLoading(false);
          return;
        }

        if (quizData) {
          processQuizData(quizData);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error in quiz fetching:', err);
        setIsLoading(false);
      }
    };
    
    // Helper function to process quiz data
    const processQuizData = (quizData: any) => {
      try {
        console.log('Processing quiz data:', quizData);
        
        // Check if questions exist and are in the expected format
        if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
          console.error('Invalid or missing questions in quiz data');
          
          // Create a simple quiz with dummy data for testing
          const formattedQuiz = {
            title: quizData.title || "Quiz",
            questions: [{
              questionText: "This is a sample question since no questions were found",
              options: ["Option 1", "Option 2", "Option 3", "Option 4"]
            }],
            completionButtonText: "Finish",
            completionButtonURL: "/"
          };
          
          setQuiz(formattedQuiz);
        } else {
          // Transform the data to match the expected format
          const formattedQuiz = {
            title: quizData.title,
            questions: quizData.questions.map((q: any) => ({
              questionText: q.question_text || q.questionText || "Question",
              options: q.options || ["Option 1", "Option 2", "Option 3", "Option 4"]
            })),
            completionButtonText: quizData.completion_button_text || 'Continue',
            completionButtonURL: quizData.completion_button_url || '/'
          };
          
          setQuiz(formattedQuiz);
        }
      } catch (err) {
        console.error('Error processing quiz data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      fetchQuizData();
    } else {
      setIsLoading(false);
    }
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
