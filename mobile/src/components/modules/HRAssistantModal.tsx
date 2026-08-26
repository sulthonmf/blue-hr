import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useLanguageStore } from '../../stores/useLanguageStore';

interface HRAssistantModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HRAssistantModal: React.FC<HRAssistantModalProps> = ({ visible, onClose }) => {
  const { t } = useLanguageStore();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Halo! Saya Asisten HR AI. Ada yang bisa saya bantu terkait kebijakan cuti, klaim reimbursement, atau syarat lembur?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let reply = 'Kuota cuti tahunan Anda saat ini tersisa 12 hari. Anda dapat mengajukan via menu Cuti di aplikasi.';
      if (userMsg.toLowerCase().includes('reimburse') || userMsg.toLowerCase().includes('klaim')) {
        reply = 'Klaim reimbursement memerlukan upload foto nota/struk pengeluaran fisik yang valid melalui menu Reimbursements.';
      } else if (userMsg.toLowerCase().includes('lembur')) {
        reply = 'Upah lembur dihitung 1.5x upah per jam untuk jam pertama dan 2x upah per jam untuk jam berikutnya.';
      }
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t.aiAssistant}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
            {messages.map((m, idx) => (
              <View
                key={idx}
                style={[
                  styles.msgBubble,
                  m.sender === 'user' ? styles.userBubble : styles.botBubble
                ]}
              >
                <Text style={[styles.msgText, m.sender === 'user' ? styles.userText : styles.botText]}>
                  {m.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Ketik pertanyaan..."
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendBtnText}>Kirim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, height: '75%', padding: 16 },
  header: { flexDirection: 'row', justify: 'space-between', alignItems: 'center', pb: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  closeBtn: { padding: 4 },
  closeText: { fontSize: 18, color: '#64748b', fontWeight: '700' },
  chatArea: { flex: 1, my: 12 },
  chatContent: { gap: 10 },
  msgBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#2563eb' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9' },
  msgText: { fontSize: 13, lineHeight: 18 },
  userText: { color: '#ffffff' },
  botText: { color: '#0f172a' },
  inputRow: { flexDirection: 'row', gap: 8, pt: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  textInput: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, px: 12, py: 10, fontSize: 13, color: '#0f172a' },
  sendBtn: { backgroundColor: '#2563eb', borderRadius: 12, px: 16, py: 10, justifyContent: 'center' },
  sendBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 13 }
});
