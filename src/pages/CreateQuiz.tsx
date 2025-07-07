import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CompletionPageBuilder, { CompletionPageConfig } from "@/components/CompletionPageBuilder";

interface Question {
  id: string;
  questionText: string;
  options: string[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  completionConfig: CompletionPageConfig;
  createdAt: Date;
}

const CreateQuiz = () => {
  const [step, setStep] = useState(1);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOptions, setCurrentOptions] = useState(["", ""]);
  const [completionConfig, setCompletionConfig] = useState<CompletionPageConfig | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const addOption = () => {
    setCurrentOptions([...currentOptions, ""]);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setCurrentOptions(newOptions);
  };

  const removeOption = (index: number) => {
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter((_, i) => i !== index);
      setCurrentOptions(newOptions);
    }
  };

  const addQuestion = () => {
    if (currentQuestion.trim() && currentOptions.filter(opt => opt.trim()).length >= 2) {
      const newQuestion: Question = {
        id: Date.now().toString(),
        questionText: currentQuestion,
        options: currentOptions.filter(opt => opt.trim())
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion("");
      setCurrentOptions(["", ""]);
      toast({
        title: "Question added!",
        description: "Question has been added to your quiz.",
      });
    } else {
      toast({
        title: "Invalid question",
        description: "Please enter a question and at least 2 options.",
        variant: "destructive",
      });
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const createQuiz = () => {
    if (!quizTitle.trim() || questions.length === 0 || !completionConfig) {
      toast({
        title: "Missing information",
        description: "Please complete all steps including the completion page configuration.",
        variant: "destructive",
      });
      return;
    }

    const quizId = `quiz_${Date.now()}`;
    const newQuiz: Quiz = {
      id: quizId,
      title: quizTitle,
      questions,
      completionConfig,
      createdAt: new Date()
    };

    // Store quiz in localStorage for demo purposes
    const existingQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    existingQuizzes.push(newQuiz);
    localStorage.setItem("quizzes", JSON.stringify(existingQuizzes));

    // Also store the completion page configuration separately for the completion page to access
    localStorage.setItem(`completion_config_${newQuiz.id}`, JSON.stringify(completionConfig));

    toast({
      title: "Quiz created successfully!",
      description: `Your quiz has been created. Share this URL: ${window.location.origin}/quiz/${quizId}`,
    });
    
    navigate("/admin/dashboard");
  };

  const nextStep = () => {
    if (step === 1 && !quizTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a quiz title to continue.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && questions.length === 0) {
      toast({
        title: "Add questions",
        description: "Please add at least one question to continue.",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleCompletionConfigSave = (config: CompletionPageConfig) => {
    setCompletionConfig(config);
    toast({
      title: "Completion page configured!",
      description: "Your completion page has been configured successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              to="/admin/dashboard" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-green-600 rounded"></div>
              <span className="text-lg font-bold text-gray-900">Create Quiz</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                <span className={`ml-2 text-sm ${step >= stepNum ? 'text-gray-900' : 'text-gray-500'}`}>
                  {stepNum === 1 ? 'Title' : stepNum === 2 ? 'Questions' : 'Completion'}
                </span>
                {stepNum < 3 && <div className="w-8 h-px bg-gray-300 ml-4"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Quiz Title */}
        {step === 1 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Quiz Title</CardTitle>
              <CardDescription>Give your quiz a clear, engaging title</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Product Feedback Survey"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button onClick={nextStep} className="w-full">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Questions */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Questions</CardTitle>
                <CardDescription>
                  Create engaging questions for your quiz. Users will see one question at a time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="What is your biggest challenge with..."
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Answer Options</Label>
                  <div className="space-y-2 mt-2">
                    {currentOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                        />
                        {currentOptions.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                <Button onClick={addQuestion} className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            {questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Preview ({questions.length} questions)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-700 mb-2">{question.questionText}</p>
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="text-sm text-gray-600">
                              • {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={nextStep} className="w-full mt-4">
                    Continue to Completion Setup <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 3: Completion Setup */}
        {step === 3 && (
          <div className="space-y-6">
            <CompletionPageBuilder
              onSave={handleCompletionConfigSave}
              initialConfig={completionConfig}
            />
            
            {completionConfig && (
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Create Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">Quiz Summary</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Title:</strong> {quizTitle}</p>
                      <p><strong>Questions:</strong> {questions.length}</p>
                      <p><strong>Completion Action:</strong> {completionConfig.buttonText}</p>
                    </div>
                  </div>
                  <Button onClick={createQuiz} className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Create Quiz
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;
