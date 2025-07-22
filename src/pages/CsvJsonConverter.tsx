import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Button, message, Select, Card, Switch, Space, Alert } from 'antd';
import { 
  SwapOutlined, 
  CopyOutlined, 
  ClearOutlined,
  DownloadOutlined,
  UploadOutlined,
  TableOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;
const { Option } = Select;

const CsvJsonConverter: React.FC = () => {
  const [csvData, setCsvData] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [convertMode, setConvertMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [prettifyJson, setPrettifyJson] = useState(true);
  const [error, setError] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const parseCSV = (csv: string, delimiter: string = ','): any[] => {
    const lines = csv.trim().split('\n');
    if (lines.length === 0) return [];

    const result: any[] = [];
    const headers = hasHeaders ? lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, '')) : [];
    const dataLines = hasHeaders ? lines.slice(1) : lines;

    dataLines.forEach((line, index) => {
      if (!line.trim()) return;
      
      const values = line.split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
      
      if (hasHeaders && headers.length > 0) {
        const obj: any = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });
        result.push(obj);
      } else {
        result.push(values);
      }
    });

    return result;
  };

  const jsonToCSV = (json: string): string => {
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of objects');
      }

      if (data.length === 0) return '';

      // Get all unique keys from all objects
      const allKeys = new Set<string>();
      data.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => allKeys.add(key));
        }
      });

      const headers = Array.from(allKeys);
      const csvLines: string[] = [];

      // Add headers if enabled
      if (hasHeaders) {
        csvLines.push(headers.map(h => `"${h}"`).join(delimiter));
      }

      // Add data rows
      data.forEach(item => {
        const row = headers.map(header => {
          const value = item[header] || '';
          // Escape quotes and wrap in quotes if contains delimiter
          const escaped = String(value).replace(/"/g, '""');
          return escaped.includes(delimiter) || escaped.includes('\n') || escaped.includes('"') 
            ? `"${escaped}"` 
            : escaped;
        });
        csvLines.push(row.join(delimiter));
      });

      return csvLines.join('\n');
    } catch (err) {
      throw new Error(`Invalid JSON: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleConvert = () => {
    setError('');
    
    try {
      if (convertMode === 'csv-to-json') {
        if (!csvData.trim()) {
          setJsonData('');
          return;
        }
        
        const parsed = parseCSV(csvData, delimiter);
        const jsonString = prettifyJson 
          ? JSON.stringify(parsed, null, 2) 
          : JSON.stringify(parsed);
        setJsonData(jsonString);
        messageApi.success(`Converted ${parsed.length} rows to JSON`);
      } else {
        if (!jsonData.trim()) {
          setCsvData('');
          return;
        }
        
        const csv = jsonToCSV(jsonData);
        setCsvData(csv);
        const lines = csv.split('\n').length - (hasHeaders ? 1 : 0);
        messageApi.success(`Converted ${lines} records to CSV`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Conversion failed';
      setError(errorMsg);
      messageApi.error(errorMsg);
    }
  };

  useEffect(() => {
    if ((convertMode === 'csv-to-json' && csvData) || (convertMode === 'json-to-csv' && jsonData)) {
      handleConvert();
    }
  }, [csvData, jsonData, delimiter, hasHeaders, prettifyJson, convertMode]);

  const handleCopy = async (data: string) => {
    try {
      await navigator.clipboard.writeText(data);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleDownload = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    messageApi.success(`Downloaded ${filename}`);
  };

  const handleClear = () => {
    setCsvData('');
    setJsonData('');
    setError('');
    messageApi.info('Cleared');
  };

  const sampleCSV = `name,age,city,email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com`;

  const sampleJSON = `[
  {
    "name": "John Doe",
    "age": 30,
    "city": "New York",
    "email": "john@example.com"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "city": "Los Angeles",
    "email": "jane@example.com"
  }
]`;

  return (
    <PageWrapper
      title="CSV ↔ JSON Converter"
      description="Convert between CSV and JSON formats with customizable delimiters and formatting options."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <Card title="Conversion Options" size="small">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Mode</div>
                <Select
                  value={convertMode}
                  onChange={setConvertMode}
                  style={{ width: '100%' }}
                >
                  <Option value="csv-to-json">CSV → JSON</Option>
                  <Option value="json-to-csv">JSON → CSV</Option>
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Delimiter</div>
                <Select
                  value={delimiter}
                  onChange={setDelimiter}
                  style={{ width: '100%' }}
                >
                  <Option value=",">Comma (,)</Option>
                  <Option value=";">Semicolon (;)</Option>
                  <Option value="\t">Tab</Option>
                  <Option value="|">Pipe (|)</Option>
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Options</div>
                <Space direction="vertical">
                  <Space>
                    <Switch
                      checked={hasHeaders}
                      onChange={setHasHeaders}
                    />
                    <span>First row contains headers</span>
                  </Space>
                  {convertMode === 'csv-to-json' && (
                    <Space>
                      <Switch
                        checked={prettifyJson}
                        onChange={setPrettifyJson}
                      />
                      <span>Prettify JSON output</span>
                    </Space>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {error && (
          <Col span={24}>
            <Alert
              message="Conversion Error"
              description={error}
              type="error"
              closable
              onClose={() => setError('')}
            />
          </Col>
        )}

        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">
                <TableOutlined style={{ marginRight: '8px' }} />
                CSV Data
                {convertMode === 'csv-to-json' && (
                  <Button 
                    size="small" 
                    type="link" 
                    onClick={() => setCsvData(sampleCSV)}
                  >
                    Load Sample
                  </Button>
                )}
              </div>
              <TextArea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder={convertMode === 'csv-to-json' 
                  ? "Enter CSV data here...\nname,age,city\nJohn,30,NYC\nJane,25,LA" 
                  : "CSV output will appear here..."
                }
                style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 15, maxRows: 30 }}
                readOnly={convertMode === 'json-to-csv'}
              />
              {csvData && convertMode === 'csv-to-json' && (
                <div style={{ marginTop: '12px' }}>
                  <Space>
                    <Button 
                      size="small" 
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(csvData)}
                    >
                      Copy
                    </Button>
                    <Button 
                      size="small" 
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(csvData, 'data.csv', 'text/csv')}
                    >
                      Download CSV
                    </Button>
                  </Space>
                </div>
              )}
            </div>
            
            <div className="output-section">
              <div className="section-label">
                <FileTextOutlined style={{ marginRight: '8px' }} />
                JSON Data
                {convertMode === 'json-to-csv' && (
                  <Button 
                    size="small" 
                    type="link" 
                    onClick={() => setJsonData(sampleJSON)}
                  >
                    Load Sample
                  </Button>
                )}
              </div>
              <TextArea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder={convertMode === 'json-to-csv' 
                  ? "Enter JSON array here...\n[\n  {\"name\": \"John\", \"age\": 30}\n]" 
                  : "JSON output will appear here..."
                }
                style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 15, maxRows: 30 }}
                readOnly={convertMode === 'csv-to-json'}
              />
              {jsonData && convertMode === 'json-to-csv' && (
                <div style={{ marginTop: '12px' }}>
                  <Space>
                    <Button 
                      size="small" 
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(jsonData)}
                    >
                      Copy
                    </Button>
                    <Button 
                      size="small" 
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(jsonData, 'data.json', 'application/json')}
                    >
                      Download JSON
                    </Button>
                  </Space>
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
              Convert
            </Button>
            <Button 
              size="large"
              icon={<SwapOutlined />}
              onClick={() => setConvertMode(convertMode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json')}
            >
              Switch Mode
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!csvData && !jsonData}
            >
              Clear
            </Button>
          </div>
        </Col>

        <Col span={24}>
          <Card title="Format Information" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>CSV Format Tips:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Use first row for column headers</li>
                    <li>Wrap values containing delimiters in quotes</li>
                    <li>Escape quotes by doubling them: "He said ""Hello"""</li>
                    <li>Empty values are preserved as empty strings</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>JSON Format Requirements:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Must be a valid JSON array</li>
                    <li>Each element should be an object for best results</li>
                    <li>Objects can have different keys (sparse data)</li>
                    <li>Nested objects will be stringified in CSV</li>
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

export default CsvJsonConverter;