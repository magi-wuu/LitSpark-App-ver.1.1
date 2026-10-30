import { Modal, ScrollView, Text, View } from 'react-native';
import { Action, ui } from '../../components/LearningUI';
import { colors as c } from '../../constants/theme';
interface Props { visible: boolean; correct: boolean; explanation: string; onContinue: () => void }
export default function FeedbackPanel({ visible, correct, explanation, onContinue }: Props) {
  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onContinue}>
    <View style={{ flex: 1, backgroundColor: 'rgba(16,43,80,0.65)', justifyContent: 'center', padding: 20 }}>
      <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={[ui.card, { width: '100%', maxWidth: 560, alignSelf: 'center' }]}>
        <Text accessibilityRole="header" style={[ui.heading, { color: correct ? '#176239' : c.navy }]}>{correct ? 'Correct!' : 'Keep learning'}</Text>
        <Text style={ui.body}>{explanation || 'Review your answer and try the next question.'}</Text><Action label="Continue" onPress={onContinue} />
      </ScrollView>
    </View>
  </Modal>;
}
