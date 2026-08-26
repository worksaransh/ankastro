import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContentMap {
  [key: string]: string;
}

export const useSiteContent = () => {
  const { language } = useLanguage();
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('key, value')
        .eq('language', language);
      
      if (data) {
        const map: ContentMap = {};
        data.forEach((item: any) => { map[item.key] = item.value; });
        setContent(map);
      }
      setLoading(false);
    };
    load();
  }, [language]);

  const get = (key: string, fallback = '') => content[key] || fallback;
  
  const getJson = (key: string, fallback: any = null) => {
    try { return content[key] ? JSON.parse(content[key]) : fallback; }
    catch { return fallback; }
  };

  return { content, get, getJson, loading };
};
