
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Eye, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompletionPageBuilderProps {
  onSave: (config: CompletionPageConfig) => void;
  initialConfig?: CompletionPageConfig;
}

export interface CompletionPageConfig {
  title: string;
  description: string;
  buttonText: string;
  buttonURL: string;
  backgroundImage?: string;
  backgroundColor: string;
  textColor: string;
}

const CompletionPageBuilder = ({ onSave, initialConfig }: CompletionPageBuilderProps) => {
  const [config, setConfig] = useState<CompletionPageConfig>(
    initialConfig || {
      title: "Thank you for completing our quiz!",
      description: "Your responses have been recorded. Click the button below to continue.",
      buttonText: "Continue",
      buttonURL: "",
      backgroundColor: "#ffffff",
      textColor: "#000000"
    }
  );
  
  const [generatedURL, setGeneratedURL] = useState("");
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({ ...prev, backgroundImage: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateURL = () => {
    // Generate a unique ID for the completion page
    const pageId = `completion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const url = `${window.location.origin}/completion/${pageId}`;
    setGeneratedURL(url);
    setConfig(prev => ({ ...prev, buttonURL: url }));
    
    toast({
      title: "URL Generated!",
      description: "A unique completion page URL has been generated.",
    });
  };

  const copyURL = () => {
    if (generatedURL) {
      navigator.clipboard.writeText(generatedURL);
      toast({
        title: "URL Copied!",
        description: "The completion page URL has been copied to your clipboard.",
      });
    }
  };

  const handleSave = () => {
    if (!config.buttonURL.trim()) {
      toast({
        title: "URL Required",
        description: "Please generate or enter a redirect URL.",
        variant: "destructive",
      });
      return;
    }
    
    onSave(config);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Completion Page Builder</CardTitle>
          <CardDescription>
            Customize how your completion page looks and behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={config.buttonText}
                onChange={(e) => setConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="color"
                  id="backgroundColor"
                  value={config.backgroundColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={config.backgroundColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  placeholder="#ffffff"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="color"
                  id="textColor"
                  value={config.textColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={config.textColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="backgroundImage">Background Image (Optional)</Label>
            <div className="mt-2">
              <input
                type="file"
                id="backgroundImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('backgroundImage')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Background Image
              </Button>
            </div>
          </div>

          <div>
            <Label>Redirect URL</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                value={config.buttonURL}
                onChange={(e) => setConfig(prev => ({ ...prev, buttonURL: e.target.value }))}
                placeholder="Enter URL or generate one"
              />
              <Button onClick={generateURL} variant="outline">
                Generate URL
              </Button>
              {generatedURL && (
                <Button onClick={copyURL} variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-8 rounded-lg text-center"
            style={{
              backgroundColor: config.backgroundColor,
              color: config.textColor,
              backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h1 className="text-2xl font-bold mb-4">{config.title}</h1>
            <p className="mb-6 opacity-90">{config.description}</p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              {config.buttonText}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Save Completion Page Configuration
      </Button>
    </div>
  );
};

export default CompletionPageBuilder;
