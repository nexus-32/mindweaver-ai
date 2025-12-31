import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image, Music, File, Brain, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { analyzeFileWithAI, generateChartData } from '@/lib/fileAnalysis';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'audio' | 'document' | 'other';
  size: number;
  uploading?: boolean;
  progress?: number;
  analysis?: any;
  analyzed?: boolean;
}

interface FileUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: {
    'image/*'?: string[];
    'audio/*'?: string[];
    'application/pdf'?: string[];
    'text/*'?: string[];
    [key: string]: string[] | undefined;
  };
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.md', '.csv'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  className = ''
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const getFileType = (file: File): UploadedFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.includes('pdf') || file.type.includes('document') || file.type.startsWith('text/')) return 'document';
    return 'other';
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const analyzeFile = async (uploadedFile: UploadedFile) => {
    try {
      setUploadedFiles(prev => 
        prev.map(f => f.id === uploadedFile.id ? { ...f, analyzed: false } : f)
      );

      const analysis = await analyzeFileWithAI(uploadedFile.file);
      
      setUploadedFiles(prev => 
        prev.map(f => f.id === uploadedFile.id ? { ...f, analysis, analyzed: true } : f)
      );

      toast({
        title: "Анализ завершен",
        description: `${uploadedFile.file.name} проанализирован ИИ`,
      });
    } catch (error) {
      toast({
        title: "Ошибка анализа",
        description: "Не удалось проанализировать файл",
        variant: "destructive",
      });
    }
  };

  const analyzeAllFiles = async () => {
    const unanalyzedFiles = uploadedFiles.filter(f => !f.analyzed);
    
    for (const file of unanalyzedFiles) {
      await analyzeFile(file);
    }
  };

  const generateAnalytics = async () => {
    try {
      const files = uploadedFiles.map(f => f.file);
      const chartData = await generateChartData(files);
      
      toast({
        title: "Аналитика создана",
        description: "Данные готовы для визуализации в режиме Аналитика",
      });
      
      // Здесь можно передать данные в компонент аналитики
      console.log('Generated chart data:', chartData);
    } catch (error) {
      toast({
        title: "Ошибка аналитики",
        description: "Не удалось сгенерировать аналитику",
        variant: "destructive",
      });
    }
  };

  const simulateUpload = (file: UploadedFile) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === file.id ? { ...f, uploading: true, progress: 0 } : f)
    );

    const interval = setInterval(() => {
      setUploadedFiles(prev => {
        const updated = prev.map(f => {
          if (f.id === file.id && f.uploading) {
            const newProgress = (f.progress || 0) + Math.random() * 30;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, uploading: false, progress: 100 };
            }
            return { ...f, progress: Math.min(newProgress, 99) };
          }
          return f;
        });
        return updated;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles(prev => 
        prev.map(f => f.id === file.id ? { ...f, uploading: false, progress: 100 } : f)
      );
      toast({
        title: "Файл загружен",
        description: `${file.file.name} успешно загружен`,
      });
    }, 2000);
  };

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "Ошибка",
        description: `Максимум ${maxFiles} файлов`,
        variant: "destructive",
      });
      return;
    }

    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        toast({
          title: "Ошибка загрузки",
          description: `${file.name}: ${error.message}`,
          variant: "destructive",
        });
      });
    });

    const newFiles: UploadedFile[] = [];
    
    for (const file of acceptedFiles) {
      const preview = await createPreview(file);
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        type: getFileType(file),
        size: file.size,
      };
      newFiles.push(uploadedFile);
    }

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Simulate upload for each file
    newFiles.forEach(file => simulateUpload(file));
  }, [uploadedFiles, maxFiles, onFilesChange]);

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: true,
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <Card 
        {...getRootProps()} 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Отпустите файлы здесь' : 'Перетащите файлы сюда'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            или нажмите для выбора файлов
          </p>
          <p className="text-xs text-muted-foreground">
            Поддерживаются изображения, аудио, документы (макс. {formatFileSize(maxSize)})
          </p>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Загруженные файлы ({uploadedFiles.length})</h4>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={analyzeAllFiles}
                disabled={uploadedFiles.every(f => f.analyzed)}
              >
                <Brain className="w-4 h-4 mr-2" />
                Анализировать все
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAnalytics}
                disabled={uploadedFiles.length === 0}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Аналитика
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            {uploadedFiles.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center gap-3">
                  {file.preview && (
                    <img 
                      src={file.preview} 
                      alt={file.file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  {!file.preview && (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                      {file.uploading && ` • Загрузка...`}
                      {file.progress === 100 && !file.uploading && ` • Загружено`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.uploading && (
                      <div className="w-20">
                        <Progress value={file.progress} className="h-1" />
                      </div>
                    )}
                    {file.analyzed && (
                      <Badge variant="secondary" className="text-xs">
                        <Brain className="w-3 h-3 mr-1" />
                        Проанализирован
                      </Badge>
                    )}
                    {!file.uploading && !file.analyzed && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => analyzeFile(file)}
                      >
                        <Brain className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      disabled={file.uploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {file.analysis && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">{file.analysis.summary}</p>
                    <div className="space-y-1">
                      {file.analysis.insights?.slice(0, 2).map((insight: string, index: number) => (
                        <p key={index} className="text-xs text-muted-foreground">• {insight}</p>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
