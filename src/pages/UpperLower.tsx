import React, { useState } from 'react';
import { Input, Row, Col, Button, message } from 'antd';
import { 
  SwapOutlined, 
  RetweetOutlined, 
  ScissorOutlined,
  CopyOutlined,
  ClearOutlined,
  FontSizeOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;

const UpperLower: React.FC = () => {
  const [text, setText] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const handleUppercase = () => {
    setText(text.toUpperCase());
    messageApi.success('Converted to uppercase');
  };

  const handleLowercase = () => {
    setText(text.toLowerCase());
    messageApi.success('Converted to lowercase');
  };

  const handleCapitalize = () => {
    const capitalized = text.replace(/\b\w/g, (char) => char.toUpperCase());
    setText(capitalized);
    messageApi.success('Capitalized first letters');
  };

  const handleAlternating = () => {
    const alternating = text
      .split('')
      .map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
    setText(alternating);
    messageApi.success('Applied alternating case');
  };

  const handleInvertCase = () => {
    const inverted = text
      .split('')
      .map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
    setText(inverted);
    messageApi.success('Inverted case');
  };

  const handleReverse = () => {
    setText(text.split('').reverse().join(''));
    messageApi.success('Text reversed');
  };

  const handleTrim = () => {
    const trimmed = text.trim().replace(/\s+/g, ' ');
    setText(trimmed);
    messageApi.success('Removed extra spaces');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setText('');
    messageApi.info('Text cleared');
  };

  const getWordCount = () => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const getCharCount = () => {
    return text.length;
  };

  const getCharCountNoSpaces = () => {
    return text.replace(/\s/g, '').length;
  };

  return (
    <PageWrapper
      title="Case Converter"
      description="Transform your text with various case conversions, reverse text, and more."
    >
      {contextHolder}
      <div className="single-input-container">
        <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="input-section">
            <div className="section-label">Input Text</div>
            <TextArea
              showCount
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              placeholder="Enter or paste your text here..."
              style={{ minHeight: '300px', fontSize: '16px' }}
              autoSize={{ minRows: 12, maxRows: 20 }}
            />
          </div>
        </Col>
        
        <Col span={24}>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-value">{getWordCount()}</div>
              <div className="stat-label">Words</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{getCharCount()}</div>
              <div className="stat-label">Characters</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{getCharCountNoSpaces()}</div>
              <div className="stat-label">Characters (no spaces)</div>
            </div>
          </div>
        </Col>
        
        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<FontSizeOutlined />}
              onClick={handleUppercase}
              disabled={!text}
            >
              UPPERCASE
            </Button>
            <Button 
              size="large"
              icon={<FontSizeOutlined />}
              onClick={handleLowercase}
              disabled={!text}
            >
              lowercase
            </Button>
            <Button 
              size="large"
              icon={<FontSizeOutlined />}
              onClick={handleCapitalize}
              disabled={!text}
            >
              Capitalize Words
            </Button>
            <Button 
              size="large"
              icon={<SwapOutlined />}
              onClick={handleAlternating}
              disabled={!text}
            >
              aLtErNaTiNg
            </Button>
            <Button 
              size="large"
              icon={<SwapOutlined />}
              onClick={handleInvertCase}
              disabled={!text}
            >
              iNVERT cASE
            </Button>
            <Button 
              size="large"
              icon={<RetweetOutlined />}
              onClick={handleReverse}
              disabled={!text}
            >
              Reverse
            </Button>
            <Button 
              size="large"
              icon={<ScissorOutlined />}
              onClick={handleTrim}
              disabled={!text}
            >
              Trim Spaces
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!text}
            >
              Copy
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!text}
            >
              Clear
            </Button>
          </div>
          </Col>
        </Row>
      </div>
    </PageWrapper>
  );
};

export default UpperLower;