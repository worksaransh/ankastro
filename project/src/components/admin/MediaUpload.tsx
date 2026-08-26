import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon, Video, X } from 'lucide-react';

interface MediaUploadProps {
  value?: string;                 // current image URL
  onChange: (url: string) => void;
  videoValue?: string;            // current video URL (optional)
  onVideoChange?: (url: string) => void;
  bucket?: string;                // storage bucket (default: media)
  label?: string;
}

// Reusable media uploader: image to Supabase storage + optional YouTube/video URL.
// Used in report content, homepage, testimonials, etc.
export default function MediaUpload({
  value, onChange, videoValue, onVideoChange,
  bucket = 'media', label = 'Image',
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600', contentType: file.type,
      });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(publicUrl);
      toast.success('Image uploaded!');
    } catch (err: any) {
      toast.error('Upload failed: ' + (err.message || 'try again') + ' (bucket "' + bucket + '" exist karta hai?)');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>

      {value && (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-24 rounded-lg border border-border object-cover" />
          <button onClick={() => onChange('')} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          <span className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-border bg-background text-sm hover:bg-muted">
            <Upload className="w-3.5 h-3.5" />{uploading ? 'Uploading…' : 'Upload Image'}
          </span>
        </label>
        <span className="text-xs text-muted-foreground">or paste URL:</span>
        <Input className="h-9 flex-1 text-xs" placeholder="https://..." value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </div>

      {onVideoChange && (
        <div className="flex gap-2 items-center pt-1">
          <Video className="w-4 h-4 text-muted-foreground" />
          <Input className="h-9 flex-1 text-xs" placeholder="YouTube URL / video ID (optional)" value={videoValue || ''} onChange={(e) => onVideoChange(e.target.value)} />
        </div>
      )}
    </div>
  );
}
