-- Create table for activities
CREATE TABLE public.atividades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  membros TEXT NOT NULL,
  categoria TEXT NOT NULL,
  data DATE NOT NULL,
  empresa TEXT,
  local TEXT NOT NULL,
  descricao TEXT NOT NULL,
  fotos JSONB DEFAULT '[]'::jsonb,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.atividades ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert activities (no auth required)
CREATE POLICY "Anyone can insert activities"
  ON public.atividades FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read activities
CREATE POLICY "Anyone can read activities"
  ON public.atividades FOR SELECT
  USING (true);

-- Allow anyone to update activities (for adding PDF url)
CREATE POLICY "Anyone can update activities"
  ON public.atividades FOR UPDATE
  USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidencias', 'evidencias', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('relatorios', 'relatorios', true);

-- Storage policies for evidencias bucket
CREATE POLICY "Anyone can upload evidencias"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidencias');

CREATE POLICY "Anyone can view evidencias"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'evidencias');

-- Storage policies for relatorios bucket
CREATE POLICY "Anyone can upload relatorios"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'relatorios');

CREATE POLICY "Anyone can view relatorios"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'relatorios');
