import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useModel } from '@/context/ModelContext';
import { Moon, Sun, Trash, Cpu, RefreshCw, HardDrive } from 'lucide-react-native';
import Header from '@/components/Header';
import { formatBytes } from '@/utils/helpers';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { clearConversation, currentModel, clearAllModels, getStorageInfo } = useModel();
  
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  
  const storageInfo = getStorageInfo();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <View style={styles.iconContainer}>
                {isDark ? <Moon size={20} color="#a78bfa" /> : <Sun size={20} color="#fb923c" />}
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#cbd5e1', true: '#7c3aed' }}
              thumbColor={Platform.OS === 'ios' ? '#ffffff' : isDark ? '#a78bfa' : '#f1f5f9'}
              ios_backgroundColor="#cbd5e1"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Model Settings</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Cpu size={20} color={isDark ? '#a78bfa' : '#1a365d'} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Current Model</Text>
                <Text style={styles.infoValue}>{currentModel.name}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <HardDrive size={20} color={isDark ? '#a78bfa' : '#1a365d'} />
              </View>
              <View>
                <Text style={styles.infoLabel}>Model Storage</Text>
                <Text style={styles.infoValue}>{formatBytes(storageInfo.modelsSize)} used</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.settingButton} onPress={clearConversation}>
            <View style={styles.settingButtonIcon}>
              <RefreshCw size={20} color={isDark ? '#a78bfa' : '#1a365d'} />
            </View>
            <View style={styles.settingButtonContent}>
              <Text style={styles.settingButtonText}>Clear Conversation History</Text>
              <Text style={styles.settingButtonDescription}>
                Delete all chat messages
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingButton, styles.dangerButton]} 
            onPress={clearAllModels}
          >
            <View style={[styles.settingButtonIcon, styles.dangerIcon]}>
              <Trash size={20} color={isDark ? '#fca5a5' : '#dc2626'} />
            </View>
            <View style={styles.settingButtonContent}>
              <Text style={[styles.settingButtonText, styles.dangerText]}>Remove All Models</Text>
              <Text style={[styles.settingButtonDescription, styles.dangerDescription]}>
                Delete all downloaded models to free space
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutCard}>
            <Text style={styles.appName}>LLaMA 3 Mobile</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              This app runs LLaMA 3 language models directly on your device
              for privacy-focused, offline AI capabilities.
            </Text>
          </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: isDark ? '#e2e8f0' : '#334155',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#334155' : '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#e2e8f0' : '#334155',
  },
  infoCard: {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#94a3b8' : '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#e2e8f0' : '#334155',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  dangerButton: {
    borderWidth: 1,
    borderColor: isDark ? '#ef4444' : '#dc2626',
  },
  settingButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#334155' : '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.1)',
  },
  settingButtonContent: {
    flex: 1,
  },
  settingButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#e2e8f0' : '#334155',
    marginBottom: 4,
  },
  dangerText: {
    color: isDark ? '#ef4444' : '#dc2626',
  },
  settingButtonDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#94a3b8' : '#64748b',
  },
  dangerDescription: {
    color: isDark ? '#fca5a5' : '#ef4444',
  },
  aboutCard: {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  appName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: isDark ? '#e2e8f0' : '#334155',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#94a3b8' : '#64748b',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#cbd5e1' : '#475569',
    lineHeight: 20,
  },
});