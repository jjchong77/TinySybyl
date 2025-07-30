import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Message } from '@/types/chat';
import Markdown from 'react-native-markdown-display';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isUser = message.role === 'user';
  const styles = getStyles(isDark);

  // Set dynamic text colors for roles and timestamps
  const textColor = isUser
  ? isDark ? '#f8fafc' : '#ffffff' // white on dark blue
  : isDark ? '#f8fafc' : '#1e293b'; // dark text on light background

  const roleColor = isDark ? '#cbd5e1' : '#334155';
  const timestampColor = isDark ? 'rgba(203, 213, 225, 0.7)' : 'rgba(51, 65, 85, 0.7)';

  return (
  <View style={[
    styles.container,
    isUser ? styles.userContainer : styles.aiContainer,
    message.isError && styles.errorContainer
  ]}>
    <View style={styles.bubbleHeader}>
      <Text style={[styles.bubbleRole, { color: roleColor }]}>
        {isUser ? 'You' : 'LLaMA 3'}
      </Text>
      <Text style={[styles.timestamp, { color: timestampColor }]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>

    <Markdown
              style={{
                body: [styles.messageText, { color: textColor }],
                strong: { fontWeight: 'bold' },
                em: { fontStyle: 'italic' },
                code_inline: {
                  fontFamily: 'Courier',
                  backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
                  color: isDark ? '#cbd5e1' : '#1e293b',
                  paddingHorizontal: 6,
                  paddingVertical: 3,
                  borderRadius: 6,
                },
                fence: {
                  fontFamily: 'Courier',
                  backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                  color: isDark ? '#f8fafc' : '#1e293b',
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 8,
                  marginBottom: 8,
                },
                code_block: {
                  fontFamily: 'Courier',
                  backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                  color: isDark ? '#f8fafc' : '#1e293b',
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 8,
                  marginBottom: 8,
                },
              }}
            >
              {message.text}
      </Markdown>
  </View>
  );
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: isDark ? '#7c3aed' : '#1a365d',
  },
  aiContainer: {
    alignSelf: 'flex-start',
    backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
  },
  errorContainer: {
    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.1)',
    borderWidth: 1,
    borderColor: isDark ? '#ef4444' : '#dc2626',
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bubbleRole: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  errorText: {
    color: isDark ? '#fca5a5' : '#dc2626',
  },
});
