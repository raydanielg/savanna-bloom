import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('url');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.url);
        setPreview(data.url);
      } else {
        // For demo, use the local preview URL
        const localUrl = URL.createObjectURL(file);
        onChange(localUrl);
      }
    } catch (error) {
      // For demo purposes, use a placeholder or the file's local URL
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl);
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
            src={preview}
            alt="Preview"
            className="h-32 w-auto rounded-lg border object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Invalid+Image';
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
