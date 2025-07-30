import React, { createContext, useContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { ModelInfo } from '@/types/model';

// Define the available models
const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'tinyllama-1.1b',
    name: 'TinyLlama 1.1B',
    description: 'Smallest model, 1.1 billion parameters. Best for low-resource devices. Good for simple tasks.',
    size: 600 * 1024 * 1024, // ~600MB
    downloadUrl: 'https://huggingface.co/TinyLlama/TinyLlama-1.1B-intermediate-step-1431k-3T',
    isDownloaded: false,
  },
  {
    id: 'llama3-8b-gguf',
    name: 'LLaMA 3 8B (GGUF)',
    description: 'Mid-sized model, 8 billion parameters. Good balance of performance and quality. Suitable for most tasks.',
    size: 4 * 1024 * 1024 * 1024, // ~4GB
    downloadUrl: 'https://huggingface.co/meta-llama/Meta-Llama-3-8B-GGUF',
    isDownloaded: false,
  }
];

interface ModelContextType {
  models: ModelInfo[];
  currentModel: ModelInfo;
  setCurrentModel: (model: ModelInfo) => void;
  downloadModel: (model: ModelInfo, progressCallback: (progress: number) => void) => Promise<void>;
  deleteModel: (model: ModelInfo) => Promise<void>;
  clearConversation: () => void;
  clearAllModels: () => Promise<void>;
  getStorageInfo: () => { modelsSize: number };
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [models, setModels] = useState<ModelInfo[]>(AVAILABLE_MODELS);
  const [currentModel, setCurrentModel] = useState<ModelInfo>(AVAILABLE_MODELS[0]);
  
  // Simulate model download for demo purposes
  const downloadModel = async (model: ModelInfo, progressCallback: (progress: number) => void) => {
    // In a real app, this would download the actual model file
    
    // Simulate download progress
    for (let i = 0; i <= 100; i += 5) {
      progressCallback(i / 100);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Mark the model as downloaded
    const updatedModels = models.map(m => 
      m.id === model.id ? { ...m, isDownloaded: true } : m
    );
    
    setModels(updatedModels);
    
    // If this is the first downloaded model, set it as current
    if (!currentModel.isDownloaded) {
      setCurrentModel({ ...model, isDownloaded: true });
    }
  };
  
  const deleteModel = async (model: ModelInfo) => {
    // In a real app, this would delete the model file
    
    // Mark the model as not downloaded
    const updatedModels = models.map(m => 
      m.id === model.id ? { ...m, isDownloaded: false } : m
    );
    
    setModels(updatedModels);
    
    // If deleting the current model, switch to another downloaded model
    if (currentModel.id === model.id) {
      const anotherDownloadedModel = updatedModels.find(m => m.isDownloaded && m.id !== model.id);
      if (anotherDownloadedModel) {
        setCurrentModel(anotherDownloadedModel);
      }
    }
  };
  
  const clearConversation = () => {
    // In a real app, this would clear conversation history from storage
    console.log('Conversation cleared');
  };
  
  const clearAllModels = async () => {
    // In a real app, this would delete all model files
    
    // Mark all models as not downloaded
    const updatedModels = models.map(m => ({ ...m, isDownloaded: false }));
    setModels(updatedModels);
    
    // Reset current model to the first one
    setCurrentModel({ ...updatedModels[0] });
  };
  
  const getStorageInfo = () => {
    // Calculate total size of downloaded models
    const modelsSize = models
      .filter(m => m.isDownloaded)
      .reduce((total, model) => total + model.size, 0);
    
    return { modelsSize };
  };
  
  // Simulate having the smallest model already downloaded
  useEffect(() => {
    // Simulate a downloaded model for demo purposes
    setTimeout(() => {
      const updatedModels = models.map(m => 
        m.id === 'tinyllama-1.1b' ? { ...m, isDownloaded: true } : m
      );
      setModels(updatedModels);
      setCurrentModel({ ...updatedModels[0], isDownloaded: true });
    }, 1000);
  }, []);
  
  return (
    <ModelContext.Provider
      value={{
        models,
        currentModel,
        setCurrentModel,
        downloadModel,
        deleteModel,
        clearConversation,
        clearAllModels,
        getStorageInfo,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export const useModel = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
};