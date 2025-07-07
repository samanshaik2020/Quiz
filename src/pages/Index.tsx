
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">QuizFlow</span>
          </div>
          <Link to="/admin/login">
            <Button variant="outline" className="hover:bg-blue-50">
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Create Engaging
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> Sequential Quizzes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Build beautiful one-question-at-a-time quizzes that guide users to your desired destination. 
            Perfect for lead generation, surveys, and user engagement.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/admin/login">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose QuizFlow?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to create, manage, and deploy engaging quizzes that convert.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Sequential Flow</h3>
            <p className="text-gray-600">
              One question at a time keeps users focused and increases completion rates significantly.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Custom Redirects</h3>
            <p className="text-gray-600">
              Guide users exactly where you want them to go after completing your quiz.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Easy Management</h3>
            <p className="text-gray-600">
              Create, edit, and share your quizzes with an intuitive admin dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using QuizFlow to engage their audience and drive conversions.
          </p>
          <Link to="/admin/login">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Create Your First Quiz
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-green-600 rounded"></div>
            <span className="text-lg font-semibold">QuizFlow</span>
          </div>
          <p>&copy; 2024 QuizFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
