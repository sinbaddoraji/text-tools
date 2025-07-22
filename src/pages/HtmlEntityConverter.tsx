import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Button, message, Select, Card, Table, Space } from 'antd';
import { 
  SwapOutlined, 
  CopyOutlined, 
  ClearOutlined,
  CodeOutlined,
  FileTextOutlined,
  SearchOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea, Search } = Input;
const { Option } = Select;

const HtmlEntityConverter: React.FC = () => {
  const [plainText, setPlainText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [entityType, setEntityType] = useState<'named' | 'numeric' | 'hex'>('named');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const commonEntities = [
    { char: '<', named: '&lt;', numeric: '&#60;', hex: '&#x3C;', description: 'Less than' },
    { char: '>', named: '&gt;', numeric: '&#62;', hex: '&#x3E;', description: 'Greater than' },
    { char: '&', named: '&amp;', numeric: '&#38;', hex: '&#x26;', description: 'Ampersand' },
    { char: '"', named: '&quot;', numeric: '&#34;', hex: '&#x22;', description: 'Quotation mark' },
    { char: "'", named: '&apos;', numeric: '&#39;', hex: '&#x27;', description: 'Apostrophe' },
    { char: ' ', named: '&nbsp;', numeric: '&#160;', hex: '&#xA0;', description: 'Non-breaking space' },
    { char: '©', named: '&copy;', numeric: '&#169;', hex: '&#xA9;', description: 'Copyright' },
    { char: '®', named: '&reg;', numeric: '&#174;', hex: '&#xAE;', description: 'Registered trademark' },
    { char: '™', named: '&trade;', numeric: '&#8482;', hex: '&#x2122;', description: 'Trademark' },
    { char: '€', named: '&euro;', numeric: '&#8364;', hex: '&#x20AC;', description: 'Euro sign' },
    { char: '£', named: '&pound;', numeric: '&#163;', hex: '&#xA3;', description: 'Pound sign' },
    { char: '¥', named: '&yen;', numeric: '&#165;', hex: '&#xA5;', description: 'Yen sign' },
    { char: '$', named: '&dollar;', numeric: '&#36;', hex: '&#x24;', description: 'Dollar sign' },
    { char: '¢', named: '&cent;', numeric: '&#162;', hex: '&#xA2;', description: 'Cent sign' },
    { char: '±', named: '&plusmn;', numeric: '&#177;', hex: '&#xB1;', description: 'Plus-minus sign' },
    { char: '×', named: '&times;', numeric: '&#215;', hex: '&#xD7;', description: 'Multiplication sign' },
    { char: '÷', named: '&divide;', numeric: '&#247;', hex: '&#xF7;', description: 'Division sign' },
    { char: '∞', named: '&infin;', numeric: '&#8734;', hex: '&#x221E;', description: 'Infinity' },
    { char: '°', named: '&deg;', numeric: '&#176;', hex: '&#xB0;', description: 'Degree sign' },
    { char: 'α', named: '&alpha;', numeric: '&#945;', hex: '&#x3B1;', description: 'Greek alpha' },
    { char: 'β', named: '&beta;', numeric: '&#946;', hex: '&#x3B2;', description: 'Greek beta' },
    { char: 'γ', named: '&gamma;', numeric: '&#947;', hex: '&#x3B3;', description: 'Greek gamma' },
    { char: 'π', named: '&pi;', numeric: '&#960;', hex: '&#x3C0;', description: 'Greek pi' },
    { char: '→', named: '&rarr;', numeric: '&#8594;', hex: '&#x2192;', description: 'Right arrow' },
    { char: '←', named: '&larr;', numeric: '&#8592;', hex: '&#x2190;', description: 'Left arrow' },
    { char: '↑', named: '&uarr;', numeric: '&#8593;', hex: '&#x2191;', description: 'Up arrow' },
    { char: '↓', named: '&darr;', numeric: '&#8595;', hex: '&#x2193;', description: 'Down arrow' },
    { char: '♠', named: '&spades;', numeric: '&#9824;', hex: '&#x2660;', description: 'Spade suit' },
    { char: '♣', named: '&clubs;', numeric: '&#9827;', hex: '&#x2663;', description: 'Club suit' },
    { char: '♥', named: '&hearts;', numeric: '&#9829;', hex: '&#x2665;', description: 'Heart suit' },
    { char: '♦', named: '&diams;', numeric: '&#9830;', hex: '&#x2666;', description: 'Diamond suit' }
  ];

  const namedEntityMap: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
    ' ': '&nbsp;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '$': '&dollar;',
    '¢': '&cent;',
    '±': '&plusmn;',
    '×': '&times;',
    '÷': '&divide;',
    '∞': '&infin;',
    '°': '&deg;',
    'α': '&alpha;',
    'β': '&beta;',
    'γ': '&gamma;',
    'π': '&pi;',
    '→': '&rarr;',
    '←': '&larr;',
    '↑': '&uarr;',
    '↓': '&darr;',
    '♠': '&spades;',
    '♣': '&clubs;',
    '♥': '&hearts;',
    '♦': '&diams;'
  };

  const encodeHtml = (text: string): string => {
    let result = text;
    
    switch (entityType) {
      case 'named':
        // Use named entities for common characters
        result = text.replace(/[&<>"']/g, (char) => {
          switch (char) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&apos;';
            default: return char;
          }
        });
        break;
        
      case 'numeric':
        // Convert all non-ASCII characters to numeric entities
        result = text.replace(/[^\x00-\x7F]/g, (char) => {
          return `&#${char.charCodeAt(0)};`;
        });
        // Handle basic HTML characters
        result = result.replace(/[&<>"']/g, (char) => {
          switch (char) {
            case '&': return '&#38;';
            case '<': return '&#60;';
            case '>': return '&#62;';
            case '"': return '&#34;';
            case "'": return '&#39;';
            default: return char;
          }
        });
        break;
        
      case 'hex':
        // Convert all non-ASCII characters to hex entities
        result = text.replace(/[^\x00-\x7F]/g, (char) => {
          return `&#x${char.charCodeAt(0).toString(16).toUpperCase()};`;
        });
        // Handle basic HTML characters
        result = result.replace(/[&<>"']/g, (char) => {
          switch (char) {
            case '&': return '&#x26;';
            case '<': return '&#x3C;';
            case '>': return '&#x3E;';
            case '"': return '&#x22;';
            case "'": return '&#x27;';
            default: return char;
          }
        });
        break;
    }
    
    return result;
  };

  const decodeHtml = (text: string): string => {
    // Create a temporary element to decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      if (!plainText.trim()) {
        setEncodedText('');
        return;
      }
      const encoded = encodeHtml(plainText);
      setEncodedText(encoded);
      messageApi.success('Text encoded successfully');
    } else {
      if (!encodedText.trim()) {
        setPlainText('');
        return;
      }
      const decoded = decodeHtml(encodedText);
      setPlainText(decoded);
      messageApi.success('HTML entities decoded successfully');
    }
  };

  useEffect(() => {
    handleConvert();
  }, [plainText, encodedText, mode, entityType]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setPlainText('');
    setEncodedText('');
    messageApi.info('Cleared');
  };

  const filteredEntities = commonEntities.filter(entity =>
    entity.char.includes(searchTerm) ||
    entity.named.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const entityColumns = [
    {
      title: 'Character',
      dataIndex: 'char',
      key: 'char',
      width: 80,
      render: (char: string) => (
        <span style={{ fontSize: '18px', fontFamily: 'monospace' }}>{char}</span>
      )
    },
    {
      title: 'Named Entity',
      dataIndex: 'named',
      key: 'named',
      render: (entity: string) => (
        <code style={{ fontSize: '12px' }}>{entity}</code>
      )
    },
    {
      title: 'Numeric',
      dataIndex: 'numeric',
      key: 'numeric',
      render: (entity: string) => (
        <code style={{ fontSize: '12px' }}>{entity}</code>
      )
    },
    {
      title: 'Hex',
      dataIndex: 'hex',
      key: 'hex',
      render: (entity: string) => (
        <code style={{ fontSize: '12px' }}>{entity}</code>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
  ];

  const sampleText = 'The HTML tags <div>, <span> & <p> are commonly used. Special characters: © ™ ® € £ "quotes" & \'apostrophes\'.';

  return (
    <PageWrapper
      title="HTML Entity Converter"
      description="Encode and decode HTML entities with support for named, numeric, and hexadecimal formats."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <Card title="Conversion Options" size="small">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Mode</div>
                <Select
                  value={mode}
                  onChange={setMode}
                  style={{ width: '100%' }}
                >
                  <Option value="encode">Encode (Text → Entities)</Option>
                  <Option value="decode">Decode (Entities → Text)</Option>
                </Select>
              </Col>
              
              {mode === 'encode' && (
                <Col xs={24} sm={8}>
                  <div style={{ marginBottom: '8px', fontWeight: 600 }}>Entity Type</div>
                  <Select
                    value={entityType}
                    onChange={setEntityType}
                    style={{ width: '100%' }}
                  >
                    <Option value="named">Named (&amp;, &lt;, &gt;)</Option>
                    <Option value="numeric">Numeric (&#38;, &#60;, &#62;)</Option>
                    <Option value="hex">Hexadecimal (&#x26;, &#x3C;, &#x3E;)</Option>
                  </Select>
                </Col>
              )}
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">
                <FileTextOutlined style={{ marginRight: '8px' }} />
                Plain Text
                <Button 
                  size="small" 
                  type="link" 
                  onClick={() => setPlainText(sampleText)}
                >
                  Load Sample
                </Button>
              </div>
              <TextArea
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                placeholder="Enter plain text here..."
                style={{ minHeight: '300px', fontSize: '15px' }}
                autoSize={{ minRows: 12, maxRows: 20 }}
                readOnly={mode === 'decode'}
              />
              {plainText && mode === 'encode' && (
                <div style={{ marginTop: '12px' }}>
                  <Button 
                    size="small" 
                    icon={<CopyOutlined />}
                    onClick={() => handleCopy(plainText)}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
            
            <div className="output-section">
              <div className="section-label">
                <CodeOutlined style={{ marginRight: '8px' }} />
                HTML Entities
              </div>
              <TextArea
                value={encodedText}
                onChange={(e) => setEncodedText(e.target.value)}
                placeholder="HTML entities will appear here..."
                style={{ minHeight: '300px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 12, maxRows: 20 }}
                readOnly={mode === 'encode'}
              />
              {encodedText && mode === 'decode' && (
                <div style={{ marginTop: '12px' }}>
                  <Button 
                    size="small" 
                    icon={<CopyOutlined />}
                    onClick={() => handleCopy(encodedText)}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<SwapOutlined />}
              onClick={handleConvert}
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </Button>
            <Button 
              size="large"
              icon={<SwapOutlined />}
              onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}
            >
              Switch Mode
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(mode === 'encode' ? encodedText : plainText)}
              disabled={!(plainText || encodedText)}
            >
              Copy Output
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!plainText && !encodedText}
            >
              Clear
            </Button>
          </div>
        </Col>

        <Col span={24}>
          <Card 
            title="HTML Entity Reference"
            size="small"
            extra={
              <Search
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 200 }}
                allowClear
              />
            }
          >
            <Table
              dataSource={filteredEntities}
              columns={entityColumns}
              rowKey="char"
              size="small"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} entities`
              }}
              scroll={{ x: true }}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="HTML Entity Information" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Named Entities:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Human-readable names</li>
                    <li>Limited set of predefined entities</li>
                    <li>Example: &amp;amp; for &amp;</li>
                    <li>Most commonly used</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Numeric Entities:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Decimal character codes</li>
                    <li>Works for any Unicode character</li>
                    <li>Example: &amp;#38; for &amp;</li>
                    <li>Universal support</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Hex Entities:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Hexadecimal character codes</li>
                    <li>Compact representation</li>
                    <li>Example: &amp;#x26; for &amp;</li>
                    <li>Developer-friendly</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default HtmlEntityConverter;