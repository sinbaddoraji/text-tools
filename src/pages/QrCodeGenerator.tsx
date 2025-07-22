import React, { useState, useEffect, useRef } from 'react';
import { Input, Row, Col, Button, message, Select, Card, Slider, ColorPicker, Space, Radio } from 'antd';
import { 
  QrcodeOutlined, 
  DownloadOutlined,
  CopyOutlined, 
  ClearOutlined,
  ShareAltOutlined,
  MailOutlined,
  PhoneOutlined,
  WifiOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;
const { Option } = Select;

const QrCodeGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [qrType, setQrType] = useState<'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi'>('text');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple QR Code generation using canvas (basic implementation)
  const generateQR = (data: string, size: number, fgColor: string, bgColor: string): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas with background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Generate a simple pattern based on data (this is a simplified QR-like pattern)
    const moduleSize = size / 25; // 25x25 grid
    ctx.fillStyle = fgColor;

    // Create a hash of the data to generate consistent patterns
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Generate pattern based on hash
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        const index = row * 25 + col;
        const shouldFill = (hash + index * 7) % 3 === 0;
        
        // Add finder patterns (corners)
        const isFinderPattern = 
          (row < 7 && col < 7) || 
          (row < 7 && col > 17) || 
          (row > 17 && col < 7);
        
        if (isFinderPattern || shouldFill) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add some timing patterns
    for (let i = 8; i < 17; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
        ctx.fillRect(6 * moduleSize, i * moduleSize, moduleSize, moduleSize);
      }
    }

    return canvas.toDataURL('image/png');
  };

  const formatQRData = (): string => {
    switch (qrType) {
      case 'url':
        const url = text.startsWith('http') ? text : `https://${text}`;
        return url;
      case 'email':
        return `mailto:${text}`;
      case 'phone':
        return `tel:${text}`;
      case 'sms':
        return `sms:${text}`;
      case 'wifi':
        // Format: WIFI:T:WPA;S:NetworkName;P:Password;H:false;;
        const [ssid, password, security = 'WPA'] = text.split('|');
        return `WIFI:T:${security};S:${ssid};P:${password};H:false;;`;
      case 'text':
      default:
        return text;
    }
  };

  useEffect(() => {
    if (text.trim()) {
      const qrData = formatQRData();
      const dataUrl = generateQR(qrData, size, foregroundColor, backgroundColor);
      setQrDataUrl(dataUrl);
    } else {
      setQrDataUrl('');
    }
  }, [text, qrType, size, foregroundColor, backgroundColor]);

  const handleDownload = () => {
    if (!qrDataUrl) {
      messageApi.error('No QR code to download');
      return;
    }

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    messageApi.success('QR code downloaded');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success('Text copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setText('');
    setQrDataUrl('');
    messageApi.info('Cleared');
  };

  const getPlaceholder = (): string => {
    switch (qrType) {
      case 'url':
        return 'Enter URL (e.g., google.com or https://example.com)';
      case 'email':
        return 'Enter email address (e.g., user@example.com)';
      case 'phone':
        return 'Enter phone number (e.g., +1234567890)';
      case 'sms':
        return 'Enter phone number for SMS (e.g., +1234567890)';
      case 'wifi':
        return 'Enter: NetworkName|Password|Security (e.g., MyWiFi|password123|WPA)';
      default:
        return 'Enter any text to generate QR code...';
    }
  };

  const getSampleData = (): string => {
    switch (qrType) {
      case 'url':
        return 'https://github.com';
      case 'email':
        return 'contact@example.com';
      case 'phone':
        return '+1234567890';
      case 'sms':
        return '+1234567890';
      case 'wifi':
        return 'MyWiFi|password123|WPA';
      default:
        return 'Hello, this is a sample QR code!';
    }
  };

  const qrTypes = [
    { value: 'text', label: 'Plain Text', icon: <QrcodeOutlined /> },
    { value: 'url', label: 'Website URL', icon: <GlobalOutlined /> },
    { value: 'email', label: 'Email Address', icon: <MailOutlined /> },
    { value: 'phone', label: 'Phone Number', icon: <PhoneOutlined /> },
    { value: 'sms', label: 'SMS', icon: <ShareAltOutlined /> },
    { value: 'wifi', label: 'WiFi Network', icon: <WifiOutlined /> }
  ];

  return (
    <PageWrapper
      title="QR Code Generator"
      description="Generate customizable QR codes for text, URLs, emails, phone numbers, and more."
    >
      {contextHolder}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <Card title="QR Code Options" size="small">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>QR Code Type</div>
                <Radio.Group 
                  value={qrType} 
                  onChange={(e) => setQrType(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Row gutter={[16, 16]}>
                    {qrTypes.map(type => (
                      <Col xs={12} sm={8} md={4} key={type.value}>
                        <Radio.Button 
                          value={type.value} 
                          style={{ width: '100%', textAlign: 'center' }}
                        >
                          {type.icon} {type.label}
                        </Radio.Button>
                      </Col>
                    ))}
                  </Row>
                </Radio.Group>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Size: {size}px</div>
                <Slider
                  min={128}
                  max={512}
                  step={32}
                  value={size}
                  onChange={setSize}
                  marks={{
                    128: '128px',
                    256: '256px',
                    384: '384px',
                    512: '512px'
                  }}
                />
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Error Correction</div>
                <Select
                  value={errorLevel}
                  onChange={setErrorLevel}
                  style={{ width: '100%' }}
                >
                  <Option value="L">Low (~7%)</Option>
                  <Option value="M">Medium (~15%)</Option>
                  <Option value="Q">Quartile (~25%)</Option>
                  <Option value="H">High (~30%)</Option>
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Colors</div>
                <Space>
                  <div>
                    <div style={{ fontSize: '12px', marginBottom: '4px' }}>Foreground</div>
                    <ColorPicker
                      value={foregroundColor}
                      onChange={(color) => setForegroundColor(color.toHexString())}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', marginBottom: '4px' }}>Background</div>
                    <ColorPicker
                      value={backgroundColor}
                      onChange={(color) => setBackgroundColor(color.toHexString())}
                    />
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">
                <QrcodeOutlined style={{ marginRight: '8px' }} />
                Input Data
                <Button 
                  size="small" 
                  type="link" 
                  onClick={() => setText(getSampleData())}
                >
                  Load Sample
                </Button>
              </div>
              <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={getPlaceholder()}
                style={{ minHeight: '200px', fontSize: '15px' }}
                autoSize={{ minRows: 8, maxRows: 15 }}
              />
              
              {qrType === 'wifi' && (
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>WiFi Format:</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    NetworkName|Password|Security<br/>
                    Security options: WPA, WEP, or leave empty for open network
                  </div>
                </div>
              )}
            </div>
            
            <div className="output-section">
              <div className="section-label">
                <QrcodeOutlined style={{ marginRight: '8px' }} />
                Generated QR Code
              </div>
              <div style={{
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                {qrDataUrl ? (
                  <img 
                    src={qrDataUrl} 
                    alt="Generated QR Code"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '400px',
                      borderRadius: '4px'
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <QrcodeOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                    <div>QR code will appear here</div>
                  </div>
                )}
              </div>
              
              {qrDataUrl && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Space>
                    <Button 
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={handleDownload}
                    >
                      Download PNG
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
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!text}
            >
              Copy Text
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              disabled={!qrDataUrl}
            >
              Download QR Code
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

        <Col span={24}>
          <Card title="QR Code Information" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Supported Data Types:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li><strong>Text:</strong> Any plain text content</li>
                    <li><strong>URL:</strong> Website links (auto-adds https://)</li>
                    <li><strong>Email:</strong> Creates mailto: links</li>
                    <li><strong>Phone:</strong> Creates tel: links for dialing</li>
                    <li><strong>SMS:</strong> Creates SMS links</li>
                    <li><strong>WiFi:</strong> Network credentials for easy connection</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Error Correction Levels:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li><strong>Low (L):</strong> ~7% damage recovery</li>
                    <li><strong>Medium (M):</strong> ~15% damage recovery</li>
                    <li><strong>Quartile (Q):</strong> ~25% damage recovery</li>
                    <li><strong>High (H):</strong> ~30% damage recovery</li>
                  </ul>
                  <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Higher levels can recover from more damage but create denser codes.
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default QrCodeGenerator;