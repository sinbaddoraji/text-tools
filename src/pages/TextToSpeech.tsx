import { useState } from 'react';
import { Input, Button, Space } from 'antd';

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  const handleTextToSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) {
          utterance.voice = voice;
        }
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak"
        rows={4}
      />
      <Button onClick={handleTextToSpeech}>
        {isSpeaking ? 'Stop' : 'Speak'}
      </Button>
    </Space>
  );
};

export default TextToSpeech;