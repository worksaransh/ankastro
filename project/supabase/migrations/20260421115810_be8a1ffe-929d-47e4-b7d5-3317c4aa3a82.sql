
CREATE TABLE public.famous_persons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  life_path INTEGER NOT NULL,
  destiny_number INTEGER NOT NULL,
  soul_urge INTEGER NOT NULL,
  personality_number INTEGER NOT NULL,
  profession TEXT NOT NULL DEFAULT '',
  short_bio TEXT NOT NULL DEFAULT '',
  verified BOOLEAN NOT NULL DEFAULT false,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.famous_persons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read verified famous persons"
ON public.famous_persons
FOR SELECT
USING (verified = true);

CREATE POLICY "Admins can manage famous persons"
ON public.famous_persons
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_famous_persons_updated_at
BEFORE UPDATE ON public.famous_persons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
