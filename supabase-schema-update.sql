-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS footer_links CASCADE;
DROP TABLE IF EXISTS text_elements CASCADE;
DROP TABLE IF EXISTS additional_buttons CASCADE;
DROP TABLE IF EXISTS completion_pages CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS responses CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Note: Supabase Auth automatically creates auth.users table
-- We'll create a profiles table to extend user information

-- User Profiles table (extending auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for profiles
ALTER TABLE profiles REPLICA IDENTITY FULL;

-- Function to create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  share_url TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'multiple_choice', 'true_false', 'text', etc.
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Options table (for multiple choice questions)
CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Responses table (to track quiz submissions)
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  respondent_identifier TEXT, -- email or other identifier
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Answer table (individual answers to questions)
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID REFERENCES responses(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES options(id) ON DELETE SET NULL,
  text_answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Completion Pages table (for custom completion pages)
CREATE TABLE completion_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  button_text TEXT NOT NULL DEFAULT 'Continue',
  button_url TEXT,
  background_color TEXT DEFAULT '#ffffff',
  text_color TEXT DEFAULT '#000000',
  background_image TEXT,
  header_enabled BOOLEAN DEFAULT false,
  header_text TEXT,
  header_font_size TEXT DEFAULT 'text-4xl',
  subheader_enabled BOOLEAN DEFAULT false,
  subheader_text TEXT,
  subheader_font_size TEXT DEFAULT 'text-xl',
  main_image_enabled BOOLEAN DEFAULT false,
  main_image_url TEXT,
  main_image_alt TEXT,
  footer_enabled BOOLEAN DEFAULT false,
  footer_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional Buttons table (for completion page)
CREATE TABLE additional_buttons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  completion_page_id UUID REFERENCES completion_pages(id) ON DELETE CASCADE,
  button_text TEXT NOT NULL,
  button_url TEXT NOT NULL,
  button_style TEXT DEFAULT 'primary',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Text Elements table (for completion page)
CREATE TABLE text_elements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  completion_page_id UUID REFERENCES completion_pages(id) ON DELETE CASCADE,
  element_type TEXT NOT NULL, -- 'paragraph', 'heading', 'quote'
  content TEXT NOT NULL,
  font_size TEXT DEFAULT 'text-base',
  alignment TEXT DEFAULT 'text-center',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer Links table (for completion page)
CREATE TABLE footer_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  completion_page_id UUID REFERENCES completion_pages(id) ON DELETE CASCADE,
  link_text TEXT NOT NULL,
  link_url TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_quizzes_created_by ON quizzes(created_by);
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_options_question_id ON options(question_id);
CREATE INDEX idx_responses_quiz_id ON responses(quiz_id);
CREATE INDEX idx_answers_response_id ON answers(response_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_completion_pages_quiz_id ON completion_pages(quiz_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_quizzes_modtime
BEFORE UPDATE ON quizzes
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_questions_modtime
BEFORE UPDATE ON questions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_options_modtime
BEFORE UPDATE ON options
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_responses_modtime
BEFORE UPDATE ON responses
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_answers_modtime
BEFORE UPDATE ON answers
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_completion_pages_modtime
BEFORE UPDATE ON completion_pages
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE completion_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY profiles_select_own ON profiles FOR SELECT
  USING (auth.uid() = id);
  
CREATE POLICY profiles_update_own ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for quizzes table
CREATE POLICY quizzes_select_own ON quizzes FOR SELECT
  USING (auth.uid() = created_by);
  
CREATE POLICY quizzes_insert_own ON quizzes FOR INSERT
  WITH CHECK (auth.uid() = created_by);
  
CREATE POLICY quizzes_update_own ON quizzes FOR UPDATE
  USING (auth.uid() = created_by);
  
CREATE POLICY quizzes_delete_own ON quizzes FOR DELETE
  USING (auth.uid() = created_by);

-- Create policies for questions table
CREATE POLICY questions_select_own ON questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = questions.quiz_id
    AND quizzes.created_by = auth.uid()
  ));
  
CREATE POLICY questions_insert_own ON questions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = questions.quiz_id
    AND quizzes.created_by = auth.uid()
  ));
  
CREATE POLICY questions_update_own ON questions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = questions.quiz_id
    AND quizzes.created_by = auth.uid()
  ));
  
CREATE POLICY questions_delete_own ON questions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = questions.quiz_id
    AND quizzes.created_by = auth.uid()
  ));

-- Similar policies for other tables
-- For options
CREATE POLICY options_select_own ON options FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM questions
    JOIN quizzes ON questions.quiz_id = quizzes.id
    WHERE options.question_id = questions.id
    AND quizzes.created_by = auth.uid()
  ));

-- For completion pages
CREATE POLICY completion_pages_select_own ON completion_pages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = completion_pages.quiz_id
    AND quizzes.created_by = auth.uid()
  ));
  
CREATE POLICY completion_pages_insert_own ON completion_pages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = completion_pages.quiz_id
    AND quizzes.created_by = auth.uid()
  ));
  
CREATE POLICY completion_pages_update_own ON completion_pages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = completion_pages.quiz_id
    AND quizzes.created_by = auth.uid()
  ));
  
CREATE POLICY completion_pages_delete_own ON completion_pages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = completion_pages.quiz_id
    AND quizzes.created_by = auth.uid()
  ));
