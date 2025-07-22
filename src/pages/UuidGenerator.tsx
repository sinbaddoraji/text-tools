import React, { useState } from 'react';
import { Input, Row, Col, Button, message, Card, Select, Space, List, Typography } from 'antd';
import { 
  ReloadOutlined, 
  CopyOutlined, 
  ClearOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const UuidGenerator: React.FC = () => {
  const [currentUuid, setCurrentUuid] = useState('');
  const [uuidList, setUuidList] = useState<string[]>([]);
  const [version, setVersion] = useState('v4');
  const [format, setFormat] = useState('standard');
  const [quantity, setQuantity] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();

  const generateUuid = (ver: string = version): string => {
    switch (ver) {
      case 'v1':
        // Simplified v1 UUID (timestamp-based)
        const timestamp = Date.now().toString(16);
        const randomPart = Math.random().toString(16).substring(2, 15);
        return `${timestamp.substring(0, 8)}-${timestamp.substring(8, 12)}-1${timestamp.substring(12, 15)}-${randomPart.substring(0, 4)}-${randomPart.substring(4, 16)}`;
      
      case 'v4':
      default:
        // Standard v4 UUID (random)
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
  };

  const formatUuid = (uuid: string, fmt: string): string => {
    const cleanUuid = uuid.replace(/-/g, '');
    
    switch (fmt) {
      case 'uppercase':
        return uuid.toUpperCase();
      case 'lowercase':
        return uuid.toLowerCase();
      case 'nohyphens':
        return cleanUuid;
      case 'nohyphens-upper':
        return cleanUuid.toUpperCase();
      case 'brackets':
        return `{${uuid}}`;
      case 'csharp':
        return `new Guid("${uuid}")`;
      case 'java':
        return `UUID.fromString("${uuid}")`;
      case 'python':
        return `uuid.UUID('${uuid}')`;
      case 'javascript':
        return `'${uuid}'`;
      case 'sql':
        return `'${uuid.toUpperCase()}'`;
      case 'standard':
      default:
        return uuid;
    }
  };

  const handleGenerate = () => {
    const uuid = generateUuid();
    const formattedUuid = formatUuid(uuid, format);
    setCurrentUuid(formattedUuid);
    messageApi.success('UUID generated successfully');
  };

  const handleGenerateMultiple = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const uuid = generateUuid();
      newUuids.push(formatUuid(uuid, format));
    }
    setUuidList(prev => [...prev, ...newUuids]);
    messageApi.success(`Generated ${quantity} UUID${quantity > 1 ? 's' : ''}`);
  };

  const handleCopyCurrent = async () => {
    try {
      await navigator.clipboard.writeText(currentUuid);
      messageApi.success('UUID copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleCopyAll = async () => {
    if (uuidList.length === 0) {
      messageApi.warning('No UUIDs to copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(uuidList.join('\n'));
      messageApi.success(`Copied ${uuidList.length} UUIDs to clipboard`);
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleCopyUuid = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      messageApi.success('UUID copied');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setCurrentUuid('');
    setUuidList([]);
    messageApi.info('Cleared all UUIDs');
  };

  const handleRemoveUuid = (index: number) => {
    setUuidList(prev => prev.filter((_, i) => i !== index));
  };

  const formatOptions = [
    { value: 'standard', label: 'Standard (lowercase with hyphens)' },
    { value: 'uppercase', label: 'Uppercase with hyphens' },
    { value: 'lowercase', label: 'Lowercase with hyphens' },
    { value: 'nohyphens', label: 'No hyphens (lowercase)' },
    { value: 'nohyphens-upper', label: 'No hyphens (uppercase)' },
    { value: 'brackets', label: 'With curly brackets' },
    { value: 'csharp', label: 'C# Guid format' },
    { value: 'java', label: 'Java UUID format' },
    { value: 'python', label: 'Python UUID format' },
    { value: 'javascript', label: 'JavaScript string' },
    { value: 'sql', label: 'SQL format' }
  ];

  return (
    <PageWrapper
      title="UUID/GUID Generator"
      description="Generate unique identifiers in various formats for different programming languages and use cases."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="single-input-container">
            <div className="section-content">
              <div className="section-label">Current UUID</div>
              <Input
                value={currentUuid}
                readOnly
                placeholder="Generated UUID will appear here..."
                style={{ fontSize: '16px', fontFamily: 'monospace', textAlign: 'center' }}
                size="large"
                suffix={
                  currentUuid && (
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={handleCopyCurrent}
                      size="small"
                    />
                  )
                }
              />
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="single-input-container">
            <Card title="Generation Options" size="small">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <div style={{ marginBottom: '8px', fontWeight: 600 }}>Version</div>
                  <Select
                    value={version}
                    onChange={setVersion}
                    style={{ width: '100%' }}
                  >
                    <Option value="v4">Version 4 (Random)</Option>
                    <Option value="v1">Version 1 (Timestamp)</Option>
                  </Select>
                </Col>
                
                <Col xs={24} sm={8}>
                  <div style={{ marginBottom: '8px', fontWeight: 600 }}>Format</div>
                  <Select
                    value={format}
                    onChange={setFormat}
                    style={{ width: '100%' }}
                  >
                    {formatOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                
                <Col xs={24} sm={8}>
                  <div style={{ marginBottom: '8px', fontWeight: 600 }}>Batch Quantity</div>
                  <Select
                    value={quantity}
                    onChange={setQuantity}
                    style={{ width: '100%' }}
                  >
                    {[1, 5, 10, 25, 50, 100].map(num => (
                      <Option key={num} value={num}>{num}</Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </Card>
          </div>
        </Col>

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<ReloadOutlined />}
              onClick={handleGenerate}
            >
              Generate Single
            </Button>
            <Button 
              size="large"
              icon={<PlusOutlined />}
              onClick={handleGenerateMultiple}
            >
              Generate {quantity}
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={handleCopyAll}
              disabled={uuidList.length === 0}
            >
              Copy All ({uuidList.length})
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!currentUuid && uuidList.length === 0}
            >
              Clear All
            </Button>
          </div>
        </Col>

        {uuidList.length > 0 && (
          <Col span={24}>
            <Card 
              title={`Generated UUIDs (${uuidList.length})`} 
              size="small"
              extra={
                <Space>
                  <Button size="small" icon={<CopyOutlined />} onClick={handleCopyAll}>
                    Copy All
                  </Button>
                </Space>
              }
            >
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <List
                  size="small"
                  dataSource={uuidList}
                  renderItem={(uuid, index) => (
                    <List.Item
                      actions={[
                        <Button
                          key="copy"
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => handleCopyUuid(uuid)}
                        />,
                        <Button
                          key="delete"
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveUuid(index)}
                        />
                      ]}
                    >
                      <Text code style={{ fontSize: '14px' }}>{uuid}</Text>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card title="UUID Information" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <Text strong>Version 4 (Random):</Text>
                  <br />
                  <Text type="secondary">
                    Uses random or pseudo-random numbers. Most commonly used for general purposes.
                    Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text strong>Version 1 (Timestamp):</Text>
                  <br />
                  <Text type="secondary">
                    Based on timestamp and MAC address. Useful when you need time-ordered UUIDs.
                    Contains timestamp information that can be extracted.
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default UuidGenerator;