
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
      textColor: "#000000",
      header: {
        enabled: false,
        text: "",
        fontSize: "text-4xl"
      },
      subHeader: {
        enabled: false,
        text: "",
        fontSize: "text-xl"
      },
      mainImage: {
        enabled: false,
        url: "",
        alt: ""
      },
      additionalButtons: [],
      textElements: [],
      footer: {
        enabled: false,
        text: "",
        links: []
      }
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

  const handleButtonClick = (url: string) => {
    if (url) {
      window.location.href = url;
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
      <Card className="max-w-4xl mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <CardContent className="text-center py-12 px-8 space-y-6">
          {config.header?.enabled && (
            <h1 className={`${config.header.fontSize} font-bold`} style={{ color: config.textColor }}>
              {config.header.text}
            </h1>
          )}

          {config.subHeader?.enabled && (
            <h2 className={`${config.subHeader.fontSize} font-semibold`} style={{ color: config.textColor }}>
              {config.subHeader.text}
            </h2>
          )}

          {config.mainImage?.enabled && config.mainImage.url && (
            <div className="flex justify-center">
              <img
                src={config.mainImage.url}
                alt={config.mainImage.alt}
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}

          <h1 className="text-3xl font-bold mb-6" style={{ color: config.textColor }}>
            {config.title}
          </h1>
          <p className="text-lg mb-8 opacity-90" style={{ color: config.textColor }}>
            {config.description}
          </p>

          {config.textElements?.map((element) => (
            <div key={element.id} className={element.alignment}>
              {element.type === 'heading' && (
                <h3 className={`${element.fontSize} font-bold mb-4`} style={{ color: config.textColor }}>
                  {element.content}
                </h3>
              )}
              {element.type === 'paragraph' && (
                <p className={`${element.fontSize} mb-4`} style={{ color: config.textColor }}>
                  {element.content}
                </p>
              )}
              {element.type === 'quote' && (
                <blockquote className={`${element.fontSize} italic border-l-4 border-gray-400 pl-4 mb-4`} style={{ color: config.textColor }}>
                  "{element.content}"
                </blockquote>
              )}
            </div>
          ))}

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleButtonClick(config.buttonURL)}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              {config.buttonText}
            </Button>

            {config.additionalButtons?.map((button) => (
              <Button
                key={button.id}
                onClick={() => handleButtonClick(button.url)}
                variant={button.style === 'primary' ? 'default' : button.style === 'secondary' ? 'secondary' : 'outline'}
                size="lg"
              >
                {button.text}
              </Button>
            ))}
          </div>

          {config.footer?.enabled && (
            <footer className="border-t pt-6 mt-8">
              <p className="text-sm opacity-75 mb-4" style={{ color: config.textColor }}>
                {config.footer.text}
              </p>
              {config.footer.links && config.footer.links.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4">
                  {config.footer.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      className="text-sm underline opacity-75 hover:opacity-100"
                      style={{ color: config.textColor }}
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </footer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionPage;
