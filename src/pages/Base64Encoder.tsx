import { useState } from 'react';
import { Input, Button, Row, Col, message } from 'antd';
import { LockOutlined, UnlockOutlined, CopyOutlined, ClearOutlined } from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;

const Base64Encoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const handleEncode = () => {
    try {
      setOutput(btoa(input));
      messageApi.success('Text encoded successfully');
    } catch (error) {
      messageApi.error('Failed to encode text');
    }
  };

  const handleDecode = () => {
    try {
      setOutput(atob(input));
      messageApi.success('Text decoded successfully');
    } catch (error) {
      messageApi.error('Invalid Base64 string');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    messageApi.info('Cleared');
  };

  return (
    <PageWrapper
      title="Base64 Encoder/Decoder"
      description="Encode and decode text to/from Base64 format for secure data transmission."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">Input Text</div>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to encode or Base64 string to decode..."
                style={{ minHeight: '200px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 8, maxRows: 15 }}
              />
            </div>
            <div className="output-section">
              <div className="section-label">Output</div>
              <TextArea
                value={output}
                placeholder="Result will appear here..."
                readOnly
                style={{ minHeight: '200px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 8, maxRows: 15 }}
              />
            </div>
          </div>
        </Col>
        
        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<LockOutlined />}
              onClick={handleEncode}
              disabled={!input}
            >
              Encode
            </Button>
            <Button 
              size="large"
              icon={<UnlockOutlined />}
              onClick={handleDecode}
              disabled={!input}
            >
              Decode
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!output}
            >
              Copy Result
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!input && !output}
            >
              Clear
            </Button>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default Base64Encoder;