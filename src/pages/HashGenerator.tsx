import { useState } from 'react';
import { Input, Button, Select, Row, Col, message } from 'antd';
import { SecurityScanOutlined, CopyOutlined, ClearOutlined } from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;
const { Option } = Select;

const HashGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [messageApi, contextHolder] = message.useMessage();

  const handleGenerate = async () => {
    if (!input.trim()) {
      messageApi.error('Please enter text to hash');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
      setHash(hashHex);
      messageApi.success(`${algorithm} hash generated successfully`);
    } catch (error) {
      messageApi.error('Error generating hash');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      messageApi.success('Hash copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setInput('');
    setHash('');
    messageApi.info('Cleared');
  };

  return (
    <PageWrapper
      title="Hash Generator"
      description="Generate cryptographic hashes (SHA-1, SHA-256, SHA-512) from text for data integrity verification."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="single-input-container">
            <div className="input-section">
              <div className="section-label">Input Text</div>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to generate hash..."
                style={{ minHeight: '150px', fontSize: '14px' }}
                autoSize={{ minRows: 6, maxRows: 12 }}
              />
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="action-buttons" style={{ justifyContent: 'flex-start', gap: '12px' }}>
            <Select 
              value={algorithm} 
              onChange={setAlgorithm}
              style={{ width: 150 }}
              size="large"
            >
              <Option value="SHA-1">SHA-1</Option>
              <Option value="SHA-256">SHA-256</Option>
              <Option value="SHA-512">SHA-512</Option>
            </Select>
            <Button 
              type="primary" 
              size="large"
              icon={<SecurityScanOutlined />}
              onClick={handleGenerate}
              disabled={!input}
            >
              Generate Hash
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!input && !hash}
            >
              Clear
            </Button>
          </div>
        </Col>

        {hash && (
          <Col span={24}>
            <div className="output-section">
              <div className="section-label">Generated {algorithm} Hash</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Input
                  value={hash}
                  readOnly
                  style={{ fontFamily: 'monospace', fontSize: '14px' }}
                />
                <Button 
                  type="primary"
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                >
                  Copy
                </Button>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </PageWrapper>
  );
};

export default HashGenerator;