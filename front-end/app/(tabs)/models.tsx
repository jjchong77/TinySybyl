import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useModel } from '@/context/ModelContext';
import { Check, Download, Trash } from 'lucide-react-native';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { formatBytes } from '@/utils/helpers';

export default function ModelsScreen() {
  const { theme } = useTheme();
  const { models, currentModel, setCurrentModel, downloadModel, deleteModel } = useModel();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  const handleSelectModel = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (model) setCurrentModel(model);
  };

  const handleDownload = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;
    
    setDownloading(modelId);
    setProgress(0);

    try {
      await downloadModel(model, (progressValue) => {
        setProgress(progressValue);
      });
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
      setProgress(0);
    }
  };

  const handleDelete = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;
    
    await deleteModel(model);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="LLaMA Models" />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Available Models</Text>
        
        {models.map((model) => (
          <View key={model.id} style={styles.modelCard}>
            <TouchableOpacity 
              style={styles.modelHeader}
              onPress={() => model.isDownloaded ? handleSelectModel(model.id) : handleDownload(model.id)}
              disabled={downloading !== null}
            >
              <View style={styles.modelInfo}>
                <Text style={styles.modelName}>{model.name}</Text>
                <Text style={styles.modelSize}>{formatBytes(model.size)}</Text>
              </View>
              
              {model.isDownloaded && (
                <View style={[styles.statusBadge, currentModel.id === model.id && styles.selectedBadge]}>
                  {currentModel.id === model.id ? (
                    <>
                      <Check size={12} color={isDark ? '#000' : '#fff'} />
                      <Text style={[styles.statusText, currentModel.id === model.id && styles.selectedText]}>
                        Selected
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.statusText}>Downloaded</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
            
            <Text style={styles.modelDescription}>{model.description}</Text>
            
            {downloading === model.id ? (
              <View style={styles.downloadProgress}>
                <ProgressBar progress={progress} />
                <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
              </View>
            ) : (
              <View style={styles.modelActions}>
                {!model.isDownloaded ? (
                  <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={() => handleDownload(model.id)}
                    disabled={downloading !== null}
                  >
                    {downloading !== null ? (
                      <ActivityIndicator size="small" color={isDark ? '#7c3aed' : '#1a365d'} />
                    ) : (
                      <>
                        <Download size={16} color={isDark ? '#7c3aed' : '#1a365d'} />
                        <Text style={styles.actionText}>Download</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionButton, currentModel.id === model.id && styles.disabledButton]} 
                      onPress={() => handleDelete(model.id)}
                      disabled={currentModel.id === model.id}
                    >
                      <Trash size={16} color={currentModel.id === model.id ? (isDark ? '#4b5563' : '#94a3b8') : (isDark ? '#ef4444' : '#dc2626')} />
                      <Text style={[styles.actionText, currentModel.id === model.id && styles.disabledText, { color: currentModel.id === model.id ? (isDark ? '#4b5563' : '#94a3b8') : (isDark ? '#ef4444' : '#dc2626') }]}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                    
                    {currentModel.id !== model.id && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleSelectModel(model.id)}
                      >
                        <Check size={16} color={isDark ? '#7c3aed' : '#1a365d'} />
                        <Text style={styles.actionText}>Select</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        ))}
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About LLaMA 3 Models</Text>
          <Text style={styles.infoText}>
            LLaMA 3 models are optimized to run efficiently on your device. 
            Smaller models use less memory but may have reduced capabilities.
            All models run completely on-device for privacy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: isDark ? '#e2e8f0' : '#334155',
    marginBottom: 16,
  },
  modelCard: {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: isDark ? '#e2e8f0' : '#334155',
    marginBottom: 4,
  },
  modelSize: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#94a3b8' : '#64748b',
  },
  modelDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#cbd5e1' : '#475569',
    marginBottom: 16,
    lineHeight: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#334155' : '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  selectedBadge: {
    backgroundColor: isDark ? '#a78bfa' : '#1a365d',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#cbd5e1' : '#475569',
  },
  selectedText: {
    color: isDark ? '#000' : '#fff',
    marginLeft: 4,
  },
  downloadProgress: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#cbd5e1' : '#475569',
    textAlign: 'center',
    marginTop: 4,
  },
  modelActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#334155' : '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#7c3aed' : '#1a365d',
    marginLeft: 8,
  },
  disabledText: {
    color: isDark ? '#4b5563' : '#94a3b8',
  },
  infoBox: {
    backgroundColor: isDark ? 'rgba(124, 58, 237, 0.1)' : 'rgba(26, 54, 93, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: isDark ? '#a78bfa' : '#1a365d',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#cbd5e1' : '#475569',
    lineHeight: 20,
  },
});