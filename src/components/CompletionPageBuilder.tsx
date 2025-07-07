
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Eye, Copy, Plus, Trash2 } from "lucide-react";
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
  header?: {
    enabled: boolean;
    text: string;
    fontSize: string;
  };
  subHeader?: {
    enabled: boolean;
    text: string;
    fontSize: string;
  };
  mainImage?: {
    enabled: boolean;
    url: string;
    alt: string;
  };
  additionalButtons?: Array<{
    id: string;
    text: string;
    url: string;
    style: string;
  }>;
  textElements?: Array<{
    id: string;
    type: 'paragraph' | 'heading' | 'quote';
    content: string;
    fontSize: string;
    alignment: string;
  }>;
  footer?: {
    enabled: boolean;
    text: string;
    links?: Array<{
      id: string;
      text: string;
      url: string;
    }>;
  };
}

const CompletionPageBuilder = ({ onSave, initialConfig }: CompletionPageBuilderProps) => {
  const [config, setConfig] = useState<CompletionPageConfig>(
    initialConfig || {
      title: "Thank you for completing our quiz!",
      description: "Your responses have been recorded. Click the button below to continue.",
      buttonText: "Continue",
      buttonURL: "",
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

  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig(prev => ({
          ...prev,
          mainImage: {
            ...prev.mainImage!,
            url: e.target?.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addButton = () => {
    const newButton = {
      id: Date.now().toString(),
      text: "New Button",
      url: "",
      style: "primary"
    };
    setConfig(prev => ({
      ...prev,
      additionalButtons: [...(prev.additionalButtons || []), newButton]
    }));
  };

  const updateButton = (id: string, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      additionalButtons: prev.additionalButtons?.map(btn =>
        btn.id === id ? { ...btn, [field]: value } : btn
      )
    }));
  };

  const removeButton = (id: string) => {
    setConfig(prev => ({
      ...prev,
      additionalButtons: prev.additionalButtons?.filter(btn => btn.id !== id)
    }));
  };

  const addTextElement = (type: 'paragraph' | 'heading' | 'quote') => {
    const newElement = {
      id: Date.now().toString(),
      type,
      content: type === 'heading' ? 'New Heading' : type === 'quote' ? 'New Quote' : 'New paragraph content',
      fontSize: type === 'heading' ? 'text-2xl' : 'text-base',
      alignment: 'text-center'
    };
    setConfig(prev => ({
      ...prev,
      textElements: [...(prev.textElements || []), newElement]
    }));
  };

  const updateTextElement = (id: string, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      textElements: prev.textElements?.map(el =>
        el.id === id ? { ...el, [field]: value } : el
      )
    }));
  };

  const removeTextElement = (id: string) => {
    setConfig(prev => ({
      ...prev,
      textElements: prev.textElements?.filter(el => el.id !== id)
    }));
  };

  const addFooterLink = () => {
    const newLink = {
      id: Date.now().toString(),
      text: "Link",
      url: ""
    };
    setConfig(prev => ({
      ...prev,
      footer: {
        ...prev.footer!,
        links: [...(prev.footer?.links || []), newLink]
      }
    }));
  };

  const updateFooterLink = (id: string, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      footer: {
        ...prev.footer!,
        links: prev.footer?.links?.map(link =>
          link.id === id ? { ...link, [field]: value } : link
        )
      }
    }));
  };

  const removeFooterLink = (id: string) => {
    setConfig(prev => ({
      ...prev,
      footer: {
        ...prev.footer!,
        links: prev.footer?.links?.filter(link => link.id !== id)
      }
    }));
  };

  const generateURL = () => {
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
        <CardContent className="space-y-6">
          {/* Header Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Header Section</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="headerEnabled"
                  checked={config.header?.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    header: { ...prev.header!, enabled: e.target.checked }
                  }))}
                />
                <Label htmlFor="headerEnabled">Enable Header</Label>
              </div>
              {config.header?.enabled && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Header Text</Label>
                    <Input
                      value={config.header.text}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        header: { ...prev.header!, text: e.target.value }
                      }))}
                      placeholder="Enter header text"
                    />
                  </div>
                  <div>
                    <Label>Header Size</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={config.header.fontSize}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        header: { ...prev.header!, fontSize: e.target.value }
                      }))}
                    >
                      <option value="text-xl">Small</option>
                      <option value="text-2xl">Medium</option>
                      <option value="text-3xl">Large</option>
                      <option value="text-4xl">Extra Large</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sub Header Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Sub Header Section</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="subHeaderEnabled"
                  checked={config.subHeader?.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    subHeader: { ...prev.subHeader!, enabled: e.target.checked }
                  }))}
                />
                <Label htmlFor="subHeaderEnabled">Enable Sub Header</Label>
              </div>
              {config.subHeader?.enabled && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Sub Header Text</Label>
                    <Input
                      value={config.subHeader.text}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        subHeader: { ...prev.subHeader!, text: e.target.value }
                      }))}
                      placeholder="Enter sub header text"
                    />
                  </div>
                  <div>
                    <Label>Sub Header Size</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={config.subHeader.fontSize}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        subHeader: { ...prev.subHeader!, fontSize: e.target.value }
                      }))}
                    >
                      <option value="text-sm">Small</option>
                      <option value="text-base">Medium</option>
                      <option value="text-lg">Large</option>
                      <option value="text-xl">Extra Large</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Main Title</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="buttonText">Primary Button Text</Label>
              <Input
                id="buttonText"
                value={config.buttonText}
                onChange={(e) => setConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Main Description</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Main Image Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Main Image</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="mainImageEnabled"
                  checked={config.mainImage?.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    mainImage: { ...prev.mainImage!, enabled: e.target.checked }
                  }))}
                />
                <Label htmlFor="mainImageEnabled">Enable Main Image</Label>
              </div>
              {config.mainImage?.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label>Image Alt Text</Label>
                    <Input
                      value={config.mainImage.alt}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        mainImage: { ...prev.mainImage!, alt: e.target.value }
                      }))}
                      placeholder="Image description"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      id="mainImage"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('mainImage')?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Main Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text Elements */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Text Elements</h3>
              <div className="flex space-x-2">
                <Button onClick={() => addTextElement('paragraph')} size="sm" variant="outline">
                  Add Paragraph
                </Button>
                <Button onClick={() => addTextElement('heading')} size="sm" variant="outline">
                  Add Heading
                </Button>
                <Button onClick={() => addTextElement('quote')} size="sm" variant="outline">
                  Add Quote
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {config.textElements?.map((element) => (
                <div key={element.id} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize">{element.type}</span>
                    <Button onClick={() => removeTextElement(element.id)} size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-2">
                    <div className="md:col-span-1">
                      <Textarea
                        value={element.content}
                        onChange={(e) => updateTextElement(element.id, 'content', e.target.value)}
                        placeholder="Enter content"
                        rows={2}
                      />
                    </div>
                    <div>
                      <select
                        className="w-full p-2 border rounded"
                        value={element.fontSize}
                        onChange={(e) => updateTextElement(element.id, 'fontSize', e.target.value)}
                      >
                        <option value="text-sm">Small</option>
                        <option value="text-base">Medium</option>
                        <option value="text-lg">Large</option>
                        <option value="text-xl">Extra Large</option>
                      </select>
                    </div>
                    <div>
                      <select
                        className="w-full p-2 border rounded"
                        value={element.alignment}
                        onChange={(e) => updateTextElement(element.id, 'alignment', e.target.value)}
                      >
                        <option value="text-left">Left</option>
                        <option value="text-center">Center</option>
                        <option value="text-right">Right</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Buttons */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Additional Buttons</h3>
              <Button onClick={addButton} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Button
              </Button>
            </div>
            <div className="space-y-4">
              {config.additionalButtons?.map((button) => (
                <div key={button.id} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Button</span>
                    <Button onClick={() => removeButton(button.id)} size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-2">
                    <Input
                      value={button.text}
                      onChange={(e) => updateButton(button.id, 'text', e.target.value)}
                      placeholder="Button text"
                    />
                    <Input
                      value={button.url}
                      onChange={(e) => updateButton(button.id, 'url', e.target.value)}
                      placeholder="Button URL"
                    />
                    <select
                      className="w-full p-2 border rounded"
                      value={button.style}
                      onChange={(e) => updateButton(button.id, 'style', e.target.value)}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Styling */}
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

          {/* Footer Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Footer Section</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="footerEnabled"
                  checked={config.footer?.enabled}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    footer: { ...prev.footer!, enabled: e.target.checked }
                  }))}
                />
                <Label htmlFor="footerEnabled">Enable Footer</Label>
              </div>
              {config.footer?.enabled && (
                <div className="space-y-4">
                  <div>
                    <Label>Footer Text</Label>
                    <Textarea
                      value={config.footer.text}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        footer: { ...prev.footer!, text: e.target.value }
                      }))}
                      placeholder="Footer content"
                      rows={2}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Footer Links</Label>
                      <Button onClick={addFooterLink} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {config.footer.links?.map((link) => (
                        <div key={link.id} className="flex space-x-2">
                          <Input
                            value={link.text}
                            onChange={(e) => updateFooterLink(link.id, 'text', e.target.value)}
                            placeholder="Link text"
                          />
                          <Input
                            value={link.url}
                            onChange={(e) => updateFooterLink(link.id, 'url', e.target.value)}
                            placeholder="Link URL"
                          />
                          <Button onClick={() => removeFooterLink(link.id)} size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Primary Button Redirect URL</Label>
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
            className="p-8 rounded-lg text-center space-y-6"
            style={{
              backgroundColor: config.backgroundColor,
              color: config.textColor,
              backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {config.header?.enabled && (
              <h1 className={`${config.header.fontSize} font-bold`}>
                {config.header.text}
              </h1>
            )}

            {config.subHeader?.enabled && (
              <h2 className={`${config.subHeader.fontSize} font-semibold`}>
                {config.subHeader.text}
              </h2>
            )}

            {config.mainImage?.enabled && config.mainImage.url && (
              <img
                src={config.mainImage.url}
                alt={config.mainImage.alt}
                className="max-w-full h-auto mx-auto rounded-lg"
                style={{ maxHeight: '200px' }}
              />
            )}

            <h1 className="text-2xl font-bold">{config.title}</h1>
            <p className="opacity-90">{config.description}</p>

            {config.textElements?.map((element) => (
              <div key={element.id} className={element.alignment}>
                {element.type === 'heading' && (
                  <h3 className={`${element.fontSize} font-bold`}>
                    {element.content}
                  </h3>
                )}
                {element.type === 'paragraph' && (
                  <p className={element.fontSize}>
                    {element.content}
                  </p>
                )}
                {element.type === 'quote' && (
                  <blockquote className={`${element.fontSize} italic border-l-4 border-gray-400 pl-4`}>
                    "{element.content}"
                  </blockquote>
                )}
              </div>
            ))}

            <div className="space-y-3">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
                {config.buttonText}
              </Button>

              {config.additionalButtons?.map((button) => (
                <Button
                  key={button.id}
                  variant={button.style === 'primary' ? 'default' : button.style === 'secondary' ? 'secondary' : 'outline'}
                  className="ml-2"
                >
                  {button.text}
                </Button>
              ))}
            </div>

            {config.footer?.enabled && (
              <footer className="border-t pt-4 mt-8">
                <p className="text-sm opacity-75">{config.footer.text}</p>
                {config.footer.links && config.footer.links.length > 0 && (
                  <div className="flex justify-center space-x-4 mt-2">
                    {config.footer.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        className="text-sm underline opacity-75 hover:opacity-100"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </footer>
            )}
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
