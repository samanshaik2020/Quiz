
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Copy, LogOut, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demo
const mockQuizzes = [
  {
    id: "quiz_1",
    title: "Product Feedback Survey",
    createdAt: new Date("2024-01-15"),
    questionsCount: 5,
    completionButtonText: "Get Free Trial",
    completionButtonURL: "https://example.com/trial"
  },
  {
    id: "quiz_2", 
    title: "Lead Generation Quiz",
    createdAt: new Date("2024-01-20"),
    questionsCount: 3,
    completionButtonText: "Schedule Demo",
    completionButtonURL: "https://example.com/demo"
  }
];

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("quizflow_token");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("quizflow_token");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of QuizFlow.",
    });
    navigate("/");
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
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
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
                {quizzes.reduce((sum, quiz) => sum + quiz.questionsCount, 0)}
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
                        <span className="font-medium">Redirect:</span> {quiz.completionButtonText} → {quiz.completionButtonURL}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-gray-600">
                          Quiz Link: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{getQuizUrl(quiz.id).substring(0, 40)}...</code>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyQuizLink(quiz.id)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Link
                          </Button>
                          <Link to={`/quiz/${quiz.id}`} target="_blank">
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          </Link>
                        </div>
                      </div>
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
