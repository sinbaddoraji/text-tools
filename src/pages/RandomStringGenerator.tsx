import { useState } from 'react';
import { Input, Button, Slider, Checkbox, Row, Col, message, InputNumber } from 'antd';
import { ReloadOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const RandomStringGenerator: React.FC = () => {
  const [randomString, setRandomString] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const generateRandomString = () => {
    let characters = '';
    
    if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) characters += '0123456789';
    if (includeSymbols) characters += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!characters) {
      messageApi.warning('Please select at least one character type');
      return;
    }
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setRandomString(result);
    messageApi.success('Random string generated');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(randomString);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const generateMultiple = (count: number) => {
    const strings: string[] = [];
    for (let j = 0; j < count; j++) {
      let characters = '';
      if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
      if (includeNumbers) characters += '0123456789';
      if (includeSymbols) characters += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      strings.push(result);
    }
    setRandomString(strings.join('\n'));
    messageApi.success(`Generated ${count} random strings`);
  };

  return (
    <PageWrapper
      title="Random String Generator"
      description="Generate secure random strings with customizable length and character types."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="generator-settings">
            <div className="section-label">String Length</div>
            <Row gutter={16} align="middle">
              <Col flex="1">
                <Slider
                  value={length}
                  onChange={(value) => setLength(value)}
                  min={1}
                  max={100}
                  marks={{
                    1: '1',
                    25: '25',
                    50: '50',
                    75: '75',
                    100: '100'
                  }}
                />
              </Col>
              <Col>
                <InputNumber
                  min={1}
                  max={100}
                  value={length}
                  onChange={(value) => setLength(value || 16)}
                  style={{ width: 80 }}
                />
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={24}>
          <div className="section-label">Character Types</div>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Checkbox
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              >
                Uppercase (A-Z)
              </Checkbox>
            </Col>
            <Col xs={12} sm={6}>
              <Checkbox
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              >
                Lowercase (a-z)
              </Checkbox>
            </Col>
            <Col xs={12} sm={6}>
              <Checkbox
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              >
                Numbers (0-9)
              </Checkbox>
            </Col>
            <Col xs={12} sm={6}>
              <Checkbox
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              >
                Symbols (!@#$%...)
              </Checkbox>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<ReloadOutlined />}
              onClick={generateRandomString}
              className="btn"
            >
              Generate String
            </Button>
            <Button 
              size="large"
              icon={<SettingOutlined />}
              onClick={() => generateMultiple(5)}
              className="btn"
            >
              Generate 5 Strings
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!randomString}
              className="btn"
            >
              Copy
            </Button>
          </div>
        </Col>

        {randomString && (
          <Col span={24}>
            <div className="output-section">
              <div className="section-label">Generated String(s)</div>
              <Input.TextArea
                value={randomString}
                readOnly
                autoSize={{ minRows: 2, maxRows: 10 }}
                style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '16px',
                  backgroundColor: '#f5f5f5',
                  cursor: 'text'
                }}
              />
            </div>
          </Col>
        )}
      </Row>
    </PageWrapper>
  );
};

export default RandomStringGenerator;