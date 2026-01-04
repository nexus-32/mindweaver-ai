import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ImageGenerationState {
  isGenerating: boolean;
  generatedImages: string[];
  currentPrompt: string;
  error: string | null;
}

interface ImageGenerationContextType extends ImageGenerationState {
  generateImage: (prompt: string) => Promise<void>;
  clearImages: () => void;
  setPrompt: (prompt: string) => void;
}

const ImageGenerationContext = createContext<ImageGenerationContextType | undefined>(undefined);

export const useImageGeneration = () => {
  const context = useContext(ImageGenerationContext);
  if (context === undefined) {
    throw new Error('useImageGeneration must be used within an ImageGenerationProvider');
  }
  return context;
};

interface ImageGenerationProviderProps {
  children: ReactNode;
}

export const ImageGenerationProvider: React.FC<ImageGenerationProviderProps> = ({ children }) => {
  const [state, setState] = useState<ImageGenerationState>({
    isGenerating: false,
    generatedImages: [],
    currentPrompt: '',
    error: null,
  });

  const generateImage = useCallback(async (prompt: string) => {
    setState(prev => ({ ...prev, isGenerating: true, error: null, currentPrompt: prompt }));
    
    try {
      // Simulate API call - replace with actual image generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated image URL
      const imageUrl = `https://picsum.photos/seed/${Date.now()}/512/512.jpg`;
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        generatedImages: [...prev.generatedImages, imageUrl],
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate image',
      }));
    }
  }, []);

  const clearImages = useCallback(() => {
    setState(prev => ({
      ...prev,
      generatedImages: [],
      error: null,
    }));
  }, []);

  const setPrompt = useCallback((prompt: string) => {
    setState(prev => ({ ...prev, currentPrompt: prompt }));
  }, []);

  const value: ImageGenerationContextType = {
    ...state,
    generateImage,
    clearImages,
    setPrompt,
  };

  return (
    <ImageGenerationContext.Provider value={value}>
      {children}
    </ImageGenerationContext.Provider>
  );
};

export default ImageGenerationContext;
