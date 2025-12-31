interface FileAnalysisResult {
  summary: string;
  type: string;
  insights: string[];
  recommendations?: string[];
  data?: any;
}

export const analyzeFileWithAI = async (file: File): Promise<FileAnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Ошибка анализа файла');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    // Fallback для демонстрации
    return getMockAnalysis(file);
  }
};

const getMockAnalysis = (file: File): FileAnalysisResult => {
  const fileType = file.type.split('/')[0];
  
  switch (fileType) {
    case 'image':
      return {
        summary: `Изображение "${file.name}" размером ${(file.size / 1024).toFixed(1)}KB`,
        type: 'Изображение',
        insights: [
          'Формат файла: ' + file.type,
          'Разрешение можно определить при обработке',
          'Изображение содержит визуальную информацию',
          'Можно извлечь текст с помощью OCR'
        ],
        recommendations: [
          'Используйте изображение для визуального анализа',
          'Можно применить фильтры или обработку',
          'Подходит для распознавания объектов'
        ]
      };
      
    case 'audio':
      return {
        summary: `Аудиофайл "${file.name}" длительностью ~${Math.floor(file.size / 1000)} секунд`,
        type: 'Аудио',
        insights: [
          'Формат аудио: ' + file.type,
          'Качество звука зависит от битрейта',
          'Можно транскрибировать в текст',
          'Поддерживается распознавание речи'
        ],
        recommendations: [
          'Конвертируйте в текст для анализа',
          'Используйте для голосовых команд',
          'Можно извлечь метаданные'
        ]
      };
      
    case 'application':
      if (file.type.includes('pdf')) {
        return {
          summary: `PDF документ "${file.name}"`,
          type: 'PDF документ',
          insights: [
            'Документ содержит текст и изображения',
            'Можно извлечь структурированные данные',
            'Поддерживается поиск по содержимому',
            'Возможно наличие таблиц или графиков'
          ],
          recommendations: [
            'Извлеките текст для анализа',
            'Проверьте наличие таблиц для аналитики',
            'Используйте для суммаризации содержания'
          ]
        };
      }
      break;
      
    case 'text':
      return {
        summary: `Текстовый файл "${file.name}"`,
        type: 'Текстовый документ',
        insights: [
          'Содержит текстовые данные',
          'Размер файла: ' + file.size + ' байт',
          'Можно анализировать содержимое',
          'Поддерживается поиск и фильтрация'
        ],
        recommendations: [
          'Проанализируйте ключевые темы',
          'Извлеките именованные сущности',
          'Используйте для суммаризации'
        ]
      };
      
    default:
      return {
        summary: `Файл "${file.name}" типа ${file.type}`,
        type: 'Другой файл',
        insights: [
          'Тип файла: ' + file.type,
          'Размер: ' + (file.size / 1024).toFixed(1) + 'KB',
          'Можно попытаться извлечь метаданные'
        ],
        recommendations: [
          'Проверьте содержимое файла',
          'Используйте соответствующие инструменты обработки'
        ]
      };
  }
  
  return {
    summary: `Файл "${file.name}"`,
    type: 'Файл',
    insights: ['Файл готов к обработке'],
    recommendations: ['Используйте файл для анализа']
  };
};

export const generateChartData = async (files: File[]): Promise<any[]> => {
  // Генерация данных для графиков на основе загруженных файлов
  const fileTypes = files.reduce((acc, file) => {
    const type = file.type.split('/')[0] || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  
  return Object.entries(fileTypes).map(([type, count]) => ({
    name: type === 'image' ? 'Изображения' : 
          type === 'audio' ? 'Аудио' : 
          type === 'application' ? 'Документы' : 
          type === 'text' ? 'Текст' : 'Другие',
    value: count,
    size: files.filter(f => f.type.split('/')[0] === type).reduce((sum, f) => sum + f.size, 0),
    percentage: ((count / files.length) * 100).toFixed(1)
  }));
};
