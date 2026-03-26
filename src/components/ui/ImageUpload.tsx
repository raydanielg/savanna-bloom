import { useState, useRef, useEffect } from "react";
import axios from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStorageUrl } from "@/lib/storage";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<'upload' | 'url'>('url');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value changes from parent
  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Using the dedicated admin upload endpoint
      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.url) {
        onChange(response.data.url);
        setPreview(response.data.url);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.response?.data?.message || "Failed to upload image to server",
      });
      // Fallback to local preview for UX, but it won't persist correctly
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreview(url);
  };

  const handleClear = () => {
    onChange('');
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant={mode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('url')}
          className={mode === 'url' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        >
          <Link className="h-4 w-4 mr-1" />
          URL
        </Button>
        <Button
          type="button"
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
          className={mode === 'upload' ? 'bg-orange-600 hover:bg-orange-700' : ''}
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </Button>
      </div>

      {mode === 'url' ? (
        <div className="flex gap-2">
          <Input
            value={value || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-500">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </span>
            <span className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</span>
          </label>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative mt-2 inline-block">
          <img
            src={getStorageUrl(preview)}
            alt="Preview"
            className="h-32 w-auto rounded-lg border object-cover min-w-[100px] bg-slate-50"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (preview && !preview.startsWith('http') && !preview.startsWith('data:')) {
                // If the storage URL failed and it's a relative path, try prepending storage/ if not present
                if (!preview.startsWith('storage/')) {
                  target.src = getStorageUrl(`storage/${preview}`);
                }
              }
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
