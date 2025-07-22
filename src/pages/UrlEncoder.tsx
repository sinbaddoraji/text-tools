import { useState } from 'react';
import { Input, Button, Row, Col, message, Radio, Tag } from 'antd';
import { LinkOutlined, UnlockOutlined, CopyOutlined, ClearOutlined } from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;

const URLEncoderDecoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodingType, setEncodingType] = useState<'component' | 'full'>('component');
  const [messageApi, contextHolder] = message.useMessage();

  const handleProcess = () => {
    if (!input.trim()) {
      messageApi.warning('Please enter a URL to process');
      return;
    }

    try {
      let result = '';
      
      if (mode === 'encode') {
        if (encodingType === 'component') {
          result = encodeURIComponent(input);
        } else {
          result = encodeURI(input);
        }
        messageApi.success('URL encoded successfully');
      } else {
        result = decodeURIComponent(input);
        messageApi.success('URL decoded successfully');
      }
      
      setOutput(result);
    } catch (error) {
      messageApi.error('Invalid URL format');
      setOutput('');
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

  const exampleUrls = [
    'https://example.com/path?param=hello world',
    'mailto:user@example.com?subject=Test Email',
    'https://site.com/search?q=special characters!@#$',
    'ftp://files.example.com/folder name/file.txt'
  ];

  const handleExample = (example: string) => {
    setInput(example);
    setOutput('');
  };

  return (
    <PageWrapper
      title="URL Encoder/Decoder"
      description="Encode and decode URLs for safe transmission and proper formatting in web applications."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="section-label">Operation Mode</div>
          <Radio.Group 
            value={mode} 
            onChange={(e) => {
              setMode(e.target.value);
              setOutput('');
            }}
            size="large"
          >
            <Radio.Button value="encode">
              <LinkOutlined /> Encode
            </Radio.Button>
            <Radio.Button value="decode">
              <UnlockOutlined /> Decode
            </Radio.Button>
          </Radio.Group>
        </Col>

        {mode === 'encode' && (
          <Col span={24}>
            <div className="section-label">Encoding Type</div>
            <Radio.Group 
              value={encodingType} 
              onChange={(e) => {
                setEncodingType(e.target.value);
                setOutput('');
              }}
              size="large"
            >
              <Radio.Button value="component">Component (encodeURIComponent)</Radio.Button>
              <Radio.Button value="full">Full URL (encodeURI)</Radio.Button>
            </Radio.Group>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              {encodingType === 'component' 
                ? 'Encodes all special characters including :/?#[]@!$&\'()*+,;='
                : 'Preserves URL structure, only encodes characters that are invalid in URLs'
              }
            </div>
          </Col>
        )}

        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">
                {mode === 'encode' ? 'Original URL' : 'Encoded URL'}
              </div>
              <TextArea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setOutput('');
                }}
                placeholder={
                  mode === 'encode' 
                    ? "Enter URL to encode..."
                    : "Enter encoded URL to decode..."
                }
                style={{ minHeight: '150px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 6, maxRows: 12 }}
              />
            </div>
            <div className="output-section">
              <div className="section-label">
                {mode === 'encode' ? 'Encoded URL' : 'Decoded URL'}
              </div>
              <TextArea
                value={output}
                placeholder="Result will appear here..."
                readOnly
                style={{ minHeight: '150px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 6, maxRows: 12 }}
              />
            </div>
          </div>
        </Col>
        
        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={mode === 'encode' ? <LinkOutlined /> : <UnlockOutlined />}
              onClick={handleProcess}
              disabled={!input}
            >
              {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
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

        <Col span={24}>
          <div className="example-section">
            <div className="section-label">Try these examples:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {exampleUrls.map((example, index) => (
                <Tag
                  key={index}
                  color="blue"
                  style={{ cursor: 'pointer', padding: '4px 12px', fontSize: '12px' }}
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

export default URLEncoderDecoder;