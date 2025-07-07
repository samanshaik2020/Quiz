
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CompletionPageConfig } from "@/components/CompletionPageBuilder";

const CompletionPage = () => {
  const { pageId } = useParams();
  const [config, setConfig] = useState<CompletionPageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this from your backend
    // For demo purposes, we'll use a default config
    const defaultConfig: CompletionPageConfig = {
      title: "Thank you for completing our quiz!",
      description: "Your responses have been recorded. Click the button below to continue.",
      buttonText: "Continue",
      buttonURL: "/",
      backgroundColor: "#ffffff",
      textColor: "#000000"
    };
    
    setConfig(defaultConfig);
    setLoading(false);
  }, [pageId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-4">The completion page you're looking for doesn't exist.</p>
            <Button onClick={() => window.location.href = "/"}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleButtonClick = () => {
    if (config.buttonURL) {
      window.location.href = config.buttonURL;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card className="max-w-2xl mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <CardContent className="text-center py-12 px-8">
          <h1 className="text-3xl font-bold mb-6" style={{ color: config.textColor }}>
            {config.title}
          </h1>
          <p className="text-lg mb-8 opacity-90" style={{ color: config.textColor }}>
            {config.description}
          </p>
          <Button
            onClick={handleButtonClick}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            {config.buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionPage;
