import { useState, useEffect } from 'react';
import { Input, Button, Select, Row, Col, message, Slider, Tag } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, SoundOutlined, ClearOutlined } from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;
const { Option } = Select;

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) {
      messageApi.warning('Please enter some text to speak');
      return;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        messageApi.info('Speech completed');
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        messageApi.error('Speech synthesis error');
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleClear = () => {
    setText('');
    handleStop();
    messageApi.info('Cleared');
  };

  const exampleTexts = [
    'Hello! Welcome to the text-to-speech converter.',
    'The quick brown fox jumps over the lazy dog.',
    'Technology makes our lives easier and more connected.'
  ];

  return (
    <PageWrapper
      title="Text to Speech"
      description="Convert text to natural-sounding speech with adjustable voice, speed, and pitch settings."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="single-input-container">
            <div className="input-section">
              <div className="section-label">Text to Speak</div>
              <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to convert to speech..."
                style={{ minHeight: '150px', fontSize: '16px' }}
                autoSize={{ minRows: 6, maxRows: 12 }}
              />
            </div>
          </div>
        </Col>

        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className="section-label">Voice</div>
              <Select 
                value={selectedVoice} 
                onChange={setSelectedVoice}
                style={{ width: '100%' }}
                size="large"
                showSearch
                filterOption={(input, option) => {
                  if (!option?.children) return false;
                  const children = Array.isArray(option.children) 
                    ? option.children.join(' ') 
                    : String(option.children);
                  return children.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {voices.map((voice) => (
                  <Option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <div className="section-label">Speed: {rate}x</div>
              <Slider
                min={0.5}
                max={2}
                step={0.1}
                value={rate}
                onChange={setRate}
              />
            </Col>
            <Col xs={24} sm={8}>
              <div className="section-label">Pitch: {pitch}</div>
              <Slider
                min={0.5}
                max={2}
                step={0.1}
                value={pitch}
                onChange={setPitch}
              />
            </Col>
            <Col xs={24} sm={8}>
              <div className="section-label">Volume: {Math.round(volume * 100)}%</div>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={setVolume}
              />
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <div className="action-buttons">
            {!isSpeaking ? (
              <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleSpeak}
                disabled={!text}
                className="btn"
              >
                Speak
              </Button>
            ) : (
              <>
                <Button 
                  size="large"
                  icon={<PauseCircleOutlined />}
                  onClick={handlePauseResume}
                  className="btn"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button 
                  size="large"
                  danger
                  icon={<SoundOutlined />}
                  onClick={handleStop}
                  className="btn"
                >
                  Stop
                </Button>
              </>
            )}
            <Button 
              size="large"
              danger={!isSpeaking}
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!text}
              className="btn"
            >
              Clear
            </Button>
          </div>
        </Col>

        <Col span={24}>
          <div className="example-section">
            <div className="section-label">Try these examples:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {exampleTexts.map((example, index) => (
                <Tag
                  key={index}
                  color="blue"
                  style={{ cursor: 'pointer', padding: '4px 12px', fontSize: '14px' }}
                  onClick={() => setText(example)}
                >
                  {example}
                </Tag>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default TextToSpeech;