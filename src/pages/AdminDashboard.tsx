
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Copy, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserProfile from "@/components/auth/UserProfile";
import { AuthService } from "@/services/auth-service";
import { QuizService } from "@/services/quiz-service";
import { Loader2 } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  createdAt: Date;
  questionsCount?: number;
  completionButtonText?: string;
  completionButtonURL?: string;
  questions?: any[];
  completionConfig?: any;
}

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated and load quizzes
    const init = async () => {
      try {
        setLoading(true);
        const user = await AuthService.getCurrentUser();
        
        if (!user) {
          navigate("/admin/login");
          return;
        }
        
        setCurrentUser(user);
        await loadQuizzes(user.id);
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        toast({
          title: "Error loading dashboard",
          description: "Please try again or contact support",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate, toast]);

  // Load quizzes from Supabase
  const loadQuizzes = async (userId: string) => {
    try {
      const quizzesData = await QuizService.getQuizzesByUser(userId);
      
      // Format the quizzes for display
      const formattedQuizzes = quizzesData.map((quiz: any) => ({
        ...quiz,
        id: quiz.id,
        title: quiz.title,
        createdAt: new Date(quiz.created_at),
        isActive: quiz.is_active,
        shareUrl: quiz.share_url
      }));
      
      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error("Error loading quizzes:", error);
      setQuizzes([]);
    }
  };

  const copyQuizLink = (quizId: string) => {
    const link = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Quiz link has been copied to your clipboard.",
    });
  };

  const getQuizUrl = (quizId: string) => {
    return `${window.location.origin}/quiz/${quizId}`;
  };

  // Show loading state while checking authentication and loading quizzes
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">QuizFlow</span>
            <Badge variant="secondary" className="ml-2">Admin</Badge>
          </div>
          <div className="w-64">
            <UserProfile />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your quizzes and track performance</p>
          </div>
          <Link to="/admin/create">
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Quiz
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzes.length}</div>
              <p className="text-xs text-muted-foreground">Active quizzes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quizzes.reduce((sum, quiz) => sum + (quiz.questionsCount || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all quizzes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Average across quizzes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Quizzes</h2>
          
          {quizzes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500 mb-4">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
                  <p className="text-sm">Create your first quiz to get started!</p>
                </div>
                <Link to="/admin/create">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Create Your First Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>
                          {quiz.questionsCount} questions • Created {quiz.createdAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium">Button:</span> {quiz.completionButtonText || 'Not configured'}
                      </div>

                      {/* Quiz URL Section */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-md border">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Quiz URL</span>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                              onClick={() => copyQuizLink(quiz.id)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Link to={`/quiz/${quiz.id}`} target="_blank">
                              <Button size="sm" variant="ghost" className="h-7 px-2">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Open
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border flex items-center justify-between">
                          <code className="text-xs break-all">{getQuizUrl(quiz.id)}</code>
                        </div>
                      </div>
                      
                      {/* Redirect URL Section */}
                      {quiz.completionButtonURL && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Redirect URL</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                              onClick={() => navigator.clipboard.writeText(quiz.completionButtonURL)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <code className="text-xs break-all">{quiz.completionButtonURL}</code>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
