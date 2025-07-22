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

const formatXML = (xml: string, indentSize: string | number = 2) => {
  const padding = typeof indentSize === 'number' ? ' '.repeat(indentSize) : indentSize;
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;
  let formatted = '';
  xml = xml.replace(reg, '$1\r\n$2$3');
  xml.split('\r\n').forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }
    formatted += padding.repeat(pad) + node + '\r\n';
    pad += indent;
  });
  return formatted.trim();
};

const XMLFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [messageApi, contextHolder] = message.useMessage();

  const validateXML = (text: string) => {
    if (!text.trim()) {
      setIsValid(null);
      return false;
    }
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(text, 'application/xml');
      if (dom.getElementsByTagName('parsererror').length > 0) {
        setIsValid(false);
        return false;
      }
      setIsValid(true);
      return true;
    } catch {
      setIsValid(false);
      return false;
    }
  };

  const handleFormat = () => {
    if (!validateXML(input)) {
      messageApi.error('Invalid XML format');
      setFormatted('');
      return;
    }
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(input, 'application/xml');
      const serializer = new XMLSerializer();
      const rawXML = serializer.serializeToString(dom);
      setFormatted(formatXML(rawXML, indentSize));
      messageApi.success('XML formatted successfully');
    } catch {
      messageApi.error('Failed to format XML');
    }
  };

  const handleMinify = () => {
    if (!validateXML(input)) {
      messageApi.error('Invalid XML format');
      setFormatted('');
      return;
    }
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(input, 'application/xml');
      const serializer = new XMLSerializer();
      const minified = serializer.serializeToString(dom)
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
      setFormatted(minified);
      messageApi.success('XML minified successfully');
    } catch {
      messageApi.error('Failed to minify XML');
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
      validateXML(value);
    } else {
      setIsValid(null);
    }
  };

  const exampleXML = [
    '<note><to>User</to><from>System</from><heading>Reminder</heading><body>Don\'t forget to validate your XML!</body></note>',
    '<books><book id="1"><title>XML Guide</title><author>John Doe</author></book></books>',
    '<config><setting name="debug" value="true"/><setting name="timeout" value="30"/></config>'
  ];

  const handleExample = (example: string) => {
    setInput(example);
    setFormatted('');
    setIsValid(null);
  };

  return (
    <PageWrapper
      title="XML Formatter"
      description="Format, validate, and minify XML data with syntax highlighting and error detection."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">
                Input XML
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
                placeholder='<root><element attribute="value">Content</element></root>'
                style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 15, maxRows: 30 }}
              />
            </div>
            <div className="output-section">
              <div className="section-label">Formatted Output</div>
              <TextArea
                value={formatted}
                placeholder="Formatted XML will appear here..."
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

        <Col span={24}>
          <div className="example-section">
            <div className="section-label">Try these examples:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {exampleXML.map((example, index) => (
                <Tag
                  key={index}
                  color="blue"
                  style={{ cursor: 'pointer', padding: '4px 12px', fontSize: '12px' }}
                  onClick={() => handleExample(example)}
                >
                  Example {index + 1}
                </Tag>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default XMLFormatter;