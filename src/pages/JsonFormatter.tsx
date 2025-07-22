import { useState } from 'react';
import { Input, Button, Row, Col, message, Select, Tag } from 'antd';
import { 
  FormatPainterOutlined, 
  CompressOutlined, 
  CopyOutlined, 
  ClearOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;
const { Option } = Select;

const JSONFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [messageApi, contextHolder] = message.useMessage();

  const validateJSON = (text: string) => {
    if (!text.trim()) {
      setIsValid(null);
      return false;
    }
    try {
      JSON.parse(text);
      setIsValid(true);
      return true;
    } catch {
      setIsValid(false);
      return false;
    }
  };

  const handleFormat = () => {
    if (!validateJSON(input)) {
      messageApi.error('Invalid JSON format');
      setFormatted('');
      return;
    }
    try {
      const obj = JSON.parse(input);
      setFormatted(JSON.stringify(obj, null, indentSize));
      messageApi.success('JSON formatted successfully');
    } catch {
      messageApi.error('Failed to format JSON');
    }
  };

  const handleMinify = () => {
    if (!validateJSON(input)) {
      messageApi.error('Invalid JSON format');
      setFormatted('');
      return;
    }
    try {
      const obj = JSON.parse(input);
      setFormatted(JSON.stringify(obj));
      messageApi.success('JSON minified successfully');
    } catch {
      messageApi.error('Failed to minify JSON');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted || input);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setInput('');
    setFormatted('');
    setIsValid(null);
    messageApi.info('Cleared');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.trim()) {
      validateJSON(value);
    } else {
      setIsValid(null);
    }
  };

  return (
    <PageWrapper
      title="JSON Formatter"
      description="Format, validate, and minify JSON data with syntax highlighting and error detection."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">
                Input JSON
                {isValid !== null && (
                  <Tag 
                    color={isValid ? 'success' : 'error'} 
                    icon={isValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    style={{ marginLeft: 8 }}
                  >
                    {isValid ? 'Valid' : 'Invalid'}
                  </Tag>
                )}
              </div>
              <TextArea
                value={input}
                onChange={handleInputChange}
                placeholder='{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York"\n}'
                style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 15, maxRows: 30 }}
              />
            </div>
            <div className="output-section">
              <div className="section-label">Formatted Output</div>
              <TextArea
                value={formatted}
                placeholder="Formatted JSON will appear here..."
                readOnly
                style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 15, maxRows: 30 }}
              />
            </div>
          </div>
        </Col>
        
        <Col span={24}>
          <div className="action-buttons">
            <Select 
              value={indentSize} 
              onChange={setIndentSize}
              style={{ width: 120 }}
            >
              <Option value={2}>2 Spaces</Option>
              <Option value={4}>4 Spaces</Option>
              <Option value={'\t'}>Tab</Option>
            </Select>
            <Button 
              type="primary" 
              size="large"
              icon={<FormatPainterOutlined />}
              onClick={handleFormat}
              disabled={!input}
            >
              Format
            </Button>
            <Button 
              size="large"
              icon={<CompressOutlined />}
              onClick={handleMinify}
              disabled={!input}
            >
              Minify
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!input && !formatted}
            >
              Copy
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!input && !formatted}
            >
              Clear
            </Button>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default JSONFormatter;