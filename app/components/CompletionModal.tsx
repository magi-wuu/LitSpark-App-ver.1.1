import { Modal, ScrollView, Text, View } from 'react-native';
import { Action, ui } from '../../components/LearningUI';
export function CompletionModal({ visible, score, total, onClose, replay = false }: { visible: boolean; score: number; total: number; onClose: () => void; replay?: boolean }) {
  const percentage = total > 0 ? Math.round(score / total * 100) : 0;
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={{ flex: 1, backgroundColor: 'rgba(16,43,80,0.7)', justifyContent: 'center', padding: 20 }}>
      <ScrollView contentContainerStyle={[ui.card, { width: '100%', maxWidth: 560, alignSelf: 'center' }]} style={{ flexGrow: 0 }}>
        <Text accessibilityRole="header" style={ui.heading}>Reading complete!</Text><Text style={ui.body}>This attempt: {score} / {total} correct ({percentage}%).</Text>
        <Text style={ui.body}>{replay ? 'Great practice! This story was already completed, so no additional XP was awarded.' : 'You earned 10 XP for completing this story for the first time.'}</Text>
        <Text style={ui.muted}>Your completion is saved on this device. You can revisit the story any time.</Text><Action label="Back to stories" onPress={onClose} />
      </ScrollView>
    </View>
  </Modal>;
}
