import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Button, message, Select, Tag, Card, Switch, Space } from 'antd';
import { 
  FormatPainterOutlined, 
  SwapOutlined,
  CopyOutlined, 
  ClearOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  CodeOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;
const { Option } = Select;

const YamlFormatter: React.FC = () => {
  const [yamlInput, setYamlInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [yamlOutput, setYamlOutput] = useState('');
  const [isValidYaml, setIsValidYaml] = useState<boolean | null>(null);
  const [isValidJson, setIsValidJson] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'yaml-to-json' | 'json-to-yaml' | 'format-yaml'>('format-yaml');
  const [indentSize, setIndentSize] = useState(2);
  const [messageApi, contextHolder] = message.useMessage();

  // Simple YAML parser (basic implementation)
  const parseYaml = (yamlText: string): any => {
    try {
      // This is a simplified YAML parser for basic structures
      const lines = yamlText.split('\n');
      const result: any = {};
      const stack: any[] = [result];
      let currentIndent = 0;

      for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const indent = line.length - line.trimStart().length;
        
        if (trimmed.includes(':')) {
          const [key, ...valueParts] = trimmed.split(':');
          const value = valueParts.join(':').trim();
          
          // Adjust stack based on indentation
          while (stack.length > 1 && indent <= currentIndent) {
            stack.pop();
            currentIndent -= indentSize;
          }

          const current = stack[stack.length - 1];
          
          if (value) {
            // Parse value
            if (value === 'true' || value === 'false') {
              current[key.trim()] = value === 'true';
            } else if (value === 'null' || value === '~') {
              current[key.trim()] = null;
            } else if (!isNaN(Number(value)) && value !== '') {
              current[key.trim()] = Number(value);
            } else if (value.startsWith('"') && value.endsWith('"')) {
              current[key.trim()] = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
              current[key.trim()] = value.slice(1, -1);
            } else {
              current[key.trim()] = value;
            }
          } else {
            // Object
            current[key.trim()] = {};
            stack.push(current[key.trim()]);
            currentIndent = indent;
          }
        } else if (trimmed.startsWith('- ')) {
          // Array item
          const item = trimmed.slice(2);
          const current = stack[stack.length - 1];
          
          if (!Array.isArray(current)) {
            // Convert to array if needed
            const parent = stack[stack.length - 2];
            const keys = Object.keys(current);
            if (keys.length === 0) {
              const lastKey = Object.keys(parent).pop();
              if (lastKey) {
                parent[lastKey] = [];
                stack[stack.length - 1] = parent[lastKey];
              }
            }
          }
          
          if (Array.isArray(current)) {
            if (item === 'true' || item === 'false') {
              current.push(item === 'true');
            } else if (item === 'null' || item === '~') {
              current.push(null);
            } else if (!isNaN(Number(item)) && item !== '') {
              current.push(Number(item));
            } else {
              current.push(item);
            }
          }
        }
      }

      return result;
    } catch (err) {
      throw new Error('Invalid YAML format');
    }
  };

  // Simple YAML generator
  const generateYaml = (obj: any, indent: number = 0): string => {
    const spaces = ' '.repeat(indent);
    let result = '';

    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === 'object' && item !== null) {
          result += `${spaces}- \n${generateYaml(item, indent + indentSize)}`;
        } else {
          result += `${spaces}- ${formatValue(item)}\n`;
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          result += `${spaces}${key}:\n`;
          result += generateYaml(value, indent + indentSize);
        } else if (typeof value === 'object' && value !== null) {
          result += `${spaces}${key}:\n`;
          result += generateYaml(value, indent + indentSize);
        } else {
          result += `${spaces}${key}: ${formatValue(value)}\n`;
        }
      }
    }

    return result;
  };

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (typeof value === 'string') {
      if (value.includes('\n') || value.includes(':') || value.includes('#')) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    return String(value);
  };

  const validateAndConvert = () => {
    setError('');
    setIsValidYaml(null);
    setIsValidJson(null);

    try {
      if (mode === 'format-yaml' || mode === 'yaml-to-json') {
        if (!yamlInput.trim()) {
          setJsonOutput('');
          setYamlOutput('');
          return;
        }

        const parsed = parseYaml(yamlInput);
        setIsValidYaml(true);

        if (mode === 'yaml-to-json') {
          setJsonOutput(JSON.stringify(parsed, null, indentSize));
          messageApi.success('Converted YAML to JSON');
        } else {
          setYamlOutput(generateYaml(parsed));
          messageApi.success('YAML formatted');
        }
      } else if (mode === 'json-to-yaml') {
        if (!jsonOutput.trim()) {
          setYamlOutput('');
          return;
        }

        const parsed = JSON.parse(jsonOutput);
        setIsValidJson(true);
        setYamlOutput(generateYaml(parsed));
        messageApi.success('Converted JSON to YAML');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Conversion failed';
      setError(errorMsg);
      
      if (mode === 'format-yaml' || mode === 'yaml-to-json') {
        setIsValidYaml(false);
      } else {
        setIsValidJson(false);
      }
      
      messageApi.error(errorMsg);
    }
  };

  useEffect(() => {
    const timer = setTimeout(validateAndConvert, 300);
    return () => clearTimeout(timer);
  }, [yamlInput, jsonOutput, mode, indentSize]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setYamlInput('');
    setJsonOutput('');
    setYamlOutput('');
    setError('');
    setIsValidYaml(null);
    setIsValidJson(null);
    messageApi.info('Cleared');
  };

  const sampleYaml = `# Sample YAML configuration
database:
  host: localhost
  port: 5432
  name: myapp
  credentials:
    username: admin
    password: secret

features:
  - authentication
  - logging
  - caching

settings:
  debug: true
  max_connections: 100
  timeout: 30.5`;

  const sampleJson = `{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp",
    "credentials": {
      "username": "admin",
      "password": "secret"
    }
  },
  "features": [
    "authentication",
    "logging",
    "caching"
  ],
  "settings": {
    "debug": true,
    "max_connections": 100,
    "timeout": 30.5
  }
}`;

  return (
    <PageWrapper
      title="YAML Formatter & Converter"
      description="Format YAML, validate syntax, and convert between YAML and JSON formats."
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
                  <Option value="format-yaml">Format YAML</Option>
                  <Option value="yaml-to-json">YAML → JSON</Option>
                  <Option value="json-to-yaml">JSON → YAML</Option>
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Indent Size</div>
                <Select
                  value={indentSize}
                  onChange={setIndentSize}
                  style={{ width: '100%' }}
                >
                  <Option value={2}>2 Spaces</Option>
                  <Option value={4}>4 Spaces</Option>
                  <Option value={8}>8 Spaces</Option>
                </Select>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          {mode === 'format-yaml' ? (
            <div className="input-output-container">
              <div className="input-section">
                <div className="section-label">
                  <FileTextOutlined style={{ marginRight: '8px' }} />
                  Input YAML
                  {isValidYaml !== null && (
                    <Tag 
                      color={isValidYaml ? 'success' : 'error'} 
                      icon={isValidYaml ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    >
                      {isValidYaml ? 'Valid' : 'Invalid'}
                    </Tag>
                  )}
                  <Button 
                    size="small" 
                    type="link" 
                    onClick={() => setYamlInput(sampleYaml)}
                  >
                    Load Sample
                  </Button>
                </div>
                <TextArea
                  value={yamlInput}
                  onChange={(e) => setYamlInput(e.target.value)}
                  placeholder="Enter YAML here..."
                  style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                  autoSize={{ minRows: 15, maxRows: 30 }}
                />
              </div>
              
              <div className="output-section">
                <div className="section-label">
                  <FileTextOutlined style={{ marginRight: '8px' }} />
                  Formatted YAML
                </div>
                <TextArea
                  value={yamlOutput}
                  readOnly
                  placeholder="Formatted YAML will appear here..."
                  style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                  autoSize={{ minRows: 15, maxRows: 30 }}
                />
              </div>
            </div>
          ) : mode === 'yaml-to-json' ? (
            <div className="input-output-container">
              <div className="input-section">
                <div className="section-label">
                  <FileTextOutlined style={{ marginRight: '8px' }} />
                  YAML Input
                  {isValidYaml !== null && (
                    <Tag 
                      color={isValidYaml ? 'success' : 'error'} 
                      icon={isValidYaml ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    >
                      {isValidYaml ? 'Valid' : 'Invalid'}
                    </Tag>
                  )}
                  <Button 
                    size="small" 
                    type="link" 
                    onClick={() => setYamlInput(sampleYaml)}
                  >
                    Load Sample
                  </Button>
                </div>
                <TextArea
                  value={yamlInput}
                  onChange={(e) => setYamlInput(e.target.value)}
                  placeholder="Enter YAML here..."
                  style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                  autoSize={{ minRows: 15, maxRows: 30 }}
                />
              </div>
              
              <div className="output-section">
                <div className="section-label">
                  <CodeOutlined style={{ marginRight: '8px' }} />
                  JSON Output
                </div>
                <TextArea
                  value={jsonOutput}
                  readOnly
                  placeholder="JSON output will appear here..."
                  style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                  autoSize={{ minRows: 15, maxRows: 30 }}
                />
              </div>
            </div>
          ) : (
            <div className="input-output-container">
              <div className="input-section">
                <div className="section-label">
                  <CodeOutlined style={{ marginRight: '8px' }} />
                  JSON Input
                  {isValidJson !== null && (
                    <Tag 
                      color={isValidJson ? 'success' : 'error'} 
                      icon={isValidJson ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    >
                      {isValidJson ? 'Valid' : 'Invalid'}
                    </Tag>
                  )}
                  <Button 
                    size="small" 
                    type="link" 
                    onClick={() => setJsonOutput(sampleJson)}
                  >
                    Load Sample
                  </Button>
                </div>
                <TextArea
                  value={jsonOutput}
                  onChange={(e) => setJsonOutput(e.target.value)}
                  placeholder="Enter JSON here..."
                  style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                  autoSize={{ minRows: 15, maxRows: 30 }}
                />
              </div>
              
              <div className="output-section">
                <div className="section-label">
                  <FileTextOutlined style={{ marginRight: '8px' }} />
                  YAML Output
                </div>
                <TextArea
                  value={yamlOutput}
                  readOnly
                  placeholder="YAML output will appear here..."
                  style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                  autoSize={{ minRows: 15, maxRows: 30 }}
                />
              </div>
            </div>
          )}
        </Col>

        {error && (
          <Col span={24}>
            <div style={{ 
              padding: '12px', 
              background: 'var(--danger-color)', 
              color: 'white', 
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              <strong>Error:</strong> {error}
            </div>
          </Col>
        )}

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<FormatPainterOutlined />}
              onClick={validateAndConvert}
              className="btn"
            >
              {mode === 'format-yaml' ? 'Format' : 'Convert'}
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={() => {
                const output = mode === 'yaml-to-json' ? jsonOutput : yamlOutput;
                handleCopy(output);
              }}
              disabled={!(yamlOutput || jsonOutput)}
              className="btn"
            >
              Copy Output
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!yamlInput && !jsonOutput}
              className="btn"
            >
              Clear
            </Button>
          </div>
        </Col>

        <Col span={24}>
          <Card title="YAML Information" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>YAML Syntax:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Indentation matters (use spaces, not tabs)</li>
                    <li>Key-value pairs: <code>key: value</code></li>
                    <li>Arrays: <code>- item</code></li>
                    <li>Comments start with <code>#</code></li>
                    <li>Strings can be quoted or unquoted</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Data Types:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Strings: <code>text</code> or <code>"quoted"</code></li>
                    <li>Numbers: <code>42</code> or <code>3.14</code></li>
                    <li>Booleans: <code>true</code>, <code>false</code></li>
                    <li>Null: <code>null</code> or <code>~</code></li>
                    <li>Objects and arrays are nested</li>
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

export default YamlFormatter;