import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useModel } from '@/context/ModelContext';
import { SendHorizontal } from 'lucide-react-native';
import MessageBubble from '@/components/MessageBubble';
import Header from '@/components/Header';
import { Message } from '@/types/chat';
import { sendPromptToLLaMA } from '@/utils/modelInference';

export default function ChatScreen() {
  const { theme } = useTheme();
  const { currentModel } = useModel();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    try {
      //const aiResponse = await generateText(input.trim(), currentModel);
      const aiResponse = await sendPromptToLLaMA(input.trim());

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Scroll to bottom again after response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I had trouble generating a response. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };
const handleKeyPress = ({ nativeEvent }: any) => {
  if (nativeEvent.key === 'Enter' && !nativeEvent.shiftKey && !isGenerating) {
    nativeEvent.preventDefault?.(); // prevent newline if sending
    handleSend();
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Chat with LLaMA" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={styles.modelIndicator}>
          <Text style={styles.modelText}>Using: {currentModel.name}</Text>
        </View>
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Send a message to start chatting with LLaMA 3
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          
          {isGenerating && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={isDark ? '#7c3aed' : '#1a365d'} />
              <Text style={styles.loadingText}>Generating response...</Text>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onKeyPress={handleKeyPress}

            //onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || isGenerating) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || isGenerating}
          >
            <SendHorizontal size={20} color={!input.trim() || isGenerating ? (isDark ? '#94a3b8' : '#cbd5e1') : '#fff'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  keyboardAvoid: {
    flex: 1,
  },
  modelIndicator: {
    backgroundColor: isDark ? 'rgba(124, 58, 237, 0.2)' : 'rgba(26, 54, 93, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  modelText: {
    color: isDark ? '#a78bfa' : '#1a365d',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingTop: 8,
    paddingBottom: 16,
    minHeight: '100%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    color: isDark ? '#94a3b8' : '#64748b',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
  },
  loadingText: {
    color: isDark ? '#e2e8f0' : '#334155',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
    backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
  },
  input: {
    flex: 1,
    backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: isDark ? '#e2e8f0' : '#334155',
    
    maxHeight: 100,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    backgroundColor: isDark ? '#7c3aed' : '#1a365d',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: isDark ? '#334155' : '#e2e8f0',
  },
});