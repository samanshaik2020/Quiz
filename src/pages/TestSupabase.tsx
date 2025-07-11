import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { QuizService } from '@/services/quiz-service';
import CompletionPageBuilder from '@/components/CompletionPageBuilder';

export default function TestSupabase() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [quizId, setQuizId] = useState<string>('');
  const [testQuizId, setTestQuizId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Test Supabase connection on component mount
  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('quizzes').select('count()', { count: 'exact', head: true });
        
        if (error) {
          throw error;
        }
        
        setConnected(true);
        toast({
          title: 'Connection Successful',
          description: 'Successfully connected to Supabase database.',
        });
      } catch (error) {
        console.error('Supabase connection error:', error);
        setConnected(false);
        toast({
          title: 'Connection Failed',
          description: 'Could not connect to Supabase database. Check your credentials.',
          variant: 'destructive',
        });
      }
    }
    
    checkConnection();
  }, [toast]);

  // Create a test quiz
  const createTestQuiz = async () => {
    setLoading(true);
    try {
      const quiz = await QuizService.createQuiz({
        title: 'Test Quiz',
        description: 'This is a test quiz created to verify Supabase integration',
        created_by: 'test-user',
        is_active: true
      });
      
      if (quiz) {
        setTestQuizId(quiz.id);
        toast({
          title: 'Quiz Created',
          description: `Test quiz created with ID: ${quiz.id}`,
        });
      } else {
        throw new Error('Failed to create quiz');
      }
    } catch (error) {
      console.error('Error creating test quiz:', error);
      toast({
        title: 'Quiz Creation Failed',
        description: 'Could not create test quiz.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle saving completion page
  const handleSaveCompletionPage = (config: any) => {
    toast({
      title: 'Configuration Saved',
      description: 'Completion page configuration has been saved.',
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Integration Test</CardTitle>
          <CardDescription>
            Test the connection to your Supabase database and verify quiz operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span>Connection Status:</span>
              {connected === null ? (
                <span className="text-yellow-500">Checking...</span>
              ) : connected ? (
                <span className="text-green-500">Connected</span>
              ) : (
                <span className="text-red-500">Failed</span>
              )}
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={createTestQuiz} 
                disabled={!connected || loading}
                className="mr-2"
              >
                Create Test Quiz
              </Button>
              
              {testQuizId && (
                <div className="p-2 bg-gray-100 rounded">
                  <p>Test Quiz ID: <span className="font-mono">{testQuizId}</span></p>
                </div>
              )}
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="quizId">Enter Quiz ID to Edit</Label>
              <div className="flex space-x-2">
                <Input 
                  id="quizId"
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  placeholder="Enter quiz ID to load/save completion page"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {quizId && (
        <Card>
          <CardHeader>
            <CardTitle>Completion Page Builder</CardTitle>
            <CardDescription>
              Edit the completion page for quiz ID: {quizId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionPageBuilder 
              onSave={handleSaveCompletionPage}
              quizId={quizId}
              useSupabase={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
