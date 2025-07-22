import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Button, message, Select, Tag } from 'antd';
import { LinkOutlined, CopyOutlined, ClearOutlined } from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;
const { Option } = Select;

const SlugGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [separator, setSeparator] = useState('-');
  const [caseType, setCaseType] = useState<'lower' | 'upper'>('lower');
  const [messageApi, contextHolder] = message.useMessage();

  const generateSlug = (text: string) => {
    let slugified = text
      .toLowerCase()
      // Remove accents and special characters
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Replace spaces and special characters with separator
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_]+/g, separator)
      // Remove multiple separators
      .replace(new RegExp(`${separator}{2,}`, 'g'), separator)
      // Remove separator from start and end
      .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');
    
    // Apply case type
    if (caseType === 'upper') {
      slugified = slugified.toUpperCase();
    }
    
    return slugified;
  };

  useEffect(() => {
    if (input) {
      setSlug(generateSlug(input));
    } else {
      setSlug('');
    }
  }, [input, separator, caseType]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(slug);
      messageApi.success('Slug copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setInput('');
    setSlug('');
    messageApi.info('Cleared');
  };

  const exampleTexts = [
    'Hello World! This is a Test',
    'Product Name (2024 Edition)',
    'Email@address.com/path',
    '¡Hola! ¿Cómo estás?',
    'Multiple   Spaces   Here'
  ];

  const handleExample = (example: string) => {
    setInput(example);
  };

  return (
    <PageWrapper
      title="Slug Generator"
      description="Convert text into URL-friendly slugs with customizable separators and case options."
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
                placeholder="Enter text to convert to slug..."
                style={{ minHeight: '120px', fontSize: '16px' }}
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </div>
          </div>
        </Col>

        <Col span={24}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <div className="section-label">Separator</div>
              <Select 
                value={separator} 
                onChange={setSeparator}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="-">Hyphen (-)</Option>
                <Option value="_">Underscore (_)</Option>
                <Option value=".">Dot (.)</Option>
                <Option value="">None</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <div className="section-label">Case</div>
              <Select 
                value={caseType} 
                onChange={setCaseType}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="lower">lowercase</Option>
                <Option value="upper">UPPERCASE</Option>
              </Select>
            </Col>
          </Row>
        </Col>

        {slug && (
          <Col span={24}>
            <div className="output-section">
              <div className="section-label">Generated Slug</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Input
                  value={slug}
                  readOnly
                  style={{ fontSize: '16px', fontFamily: 'monospace' }}
                  prefix={<LinkOutlined />}
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

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!input}
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
                  onClick={() => handleExample(example)}
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

export default SlugGenerator;