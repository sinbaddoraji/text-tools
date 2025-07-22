import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Button, message, Slider, Checkbox, Card, Progress, Space } from 'antd';
import { 
  ReloadOutlined, 
  CopyOutlined, 
  ClearOutlined,
  SecurityScanOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [showPassword, setShowPassword] = useState(true);
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' });
  const [messageApi, contextHolder] = message.useMessage();

  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  };

  const generatePassword = () => {
    let chars = '';
    
    if (options.uppercase) chars += charset.uppercase;
    if (options.lowercase) chars += charset.lowercase;
    if (options.numbers) chars += charset.numbers;
    if (options.symbols) chars += charset.symbols;

    if (options.excludeSimilar) {
      chars = chars.split('').filter(char => !charset.similar.includes(char)).join('');
    }
    
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(char => !charset.ambiguous.includes(char)).join('');
    }

    if (!chars) {
      messageApi.error('Please select at least one character type');
      return;
    }

    let result = '';
    
    // Ensure at least one character from each selected type
    if (options.uppercase) result += charset.uppercase[Math.floor(Math.random() * charset.uppercase.length)];
    if (options.lowercase) result += charset.lowercase[Math.floor(Math.random() * charset.lowercase.length)];
    if (options.numbers) result += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
    if (options.symbols) result += charset.symbols[Math.floor(Math.random() * charset.symbols.length)];

    // Fill the rest randomly
    for (let i = result.length; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    // Shuffle the result
    result = result.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(result);
    calculateStrength(result);
    messageApi.success('Password generated successfully');
  };

  const calculateStrength = (pwd: string) => {
    let score = 0;
    let label = '';
    let color = '';

    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    if (pwd.length >= 16) score += 1;

    switch (true) {
      case score >= 6:
        label = 'Very Strong';
        color = '#52c41a';
        break;
      case score >= 5:
        label = 'Strong';
        color = '#73d13d';
        break;
      case score >= 4:
        label = 'Good';
        color = '#faad14';
        break;
      case score >= 3:
        label = 'Fair';
        color = '#ff7a45';
        break;
      default:
        label = 'Weak';
        color = '#ff4d4f';
    }

    setStrength({ score: Math.min(score * 14.3, 100), label, color });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      messageApi.success('Password copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setPassword('');
    setStrength({ score: 0, label: '', color: '' });
    messageApi.info('Cleared');
  };

  const presets = [
    { name: 'PIN (4 digits)', length: 4, options: { uppercase: false, lowercase: false, numbers: true, symbols: false, excludeSimilar: false, excludeAmbiguous: false } },
    { name: 'Simple (8 chars)', length: 8, options: { uppercase: true, lowercase: true, numbers: true, symbols: false, excludeSimilar: true, excludeAmbiguous: false } },
    { name: 'Standard (12 chars)', length: 12, options: { uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: true, excludeAmbiguous: false } },
    { name: 'Strong (16 chars)', length: 16, options: { uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: false, excludeAmbiguous: false } },
    { name: 'Maximum (32 chars)', length: 32, options: { uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: false, excludeAmbiguous: false } }
  ];

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  return (
    <PageWrapper
      title="Password Generator"
      description="Generate secure passwords with customizable options and strength analysis."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="single-input-container">
            <div className="section-content">
              <div className="section-label">Generated Password</div>
              <Input.Password
                value={password}
                readOnly
                placeholder="Generated password will appear here..."
                style={{ fontSize: '18px', fontFamily: 'monospace', textAlign: 'center' }}
                size="large"
                visibilityToggle={{
                  visible: showPassword,
                  onVisibleChange: setShowPassword
                }}
              />
              {password && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span>Password Strength:</span>
                    <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  </div>
                  <Progress 
                    percent={strength.score} 
                    strokeColor={strength.color}
                    showInfo={false}
                  />
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="single-input-container">
            <Card title="Password Options" size="small">
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <div>
                    <div style={{ marginBottom: '12px', fontWeight: 600 }}>Length: {length}</div>
                    <Slider
                      min={4}
                      max={50}
                      value={length}
                      onChange={setLength}
                      marks={{
                        4: '4',
                        8: '8',
                        12: '12',
                        16: '16',
                        24: '24',
                        32: '32',
                        50: '50'
                      }}
                    />
                  </div>
                </Col>
                
                <Col span={24}>
                  <div>
                    <div style={{ marginBottom: '16px', fontWeight: 600 }}>Character Types</div>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={6}>
                        <Checkbox
                          checked={options.uppercase}
                          onChange={(e) => setOptions(prev => ({ ...prev, uppercase: e.target.checked }))}
                        >
                          Uppercase (A-Z)
                        </Checkbox>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Checkbox
                          checked={options.lowercase}
                          onChange={(e) => setOptions(prev => ({ ...prev, lowercase: e.target.checked }))}
                        >
                          Lowercase (a-z)
                        </Checkbox>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Checkbox
                          checked={options.numbers}
                          onChange={(e) => setOptions(prev => ({ ...prev, numbers: e.target.checked }))}
                        >
                          Numbers (0-9)
                        </Checkbox>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Checkbox
                          checked={options.symbols}
                          onChange={(e) => setOptions(prev => ({ ...prev, symbols: e.target.checked }))}
                        >
                          Symbols (!@#$...)
                        </Checkbox>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col span={24}>
                  <div>
                    <div style={{ marginBottom: '16px', fontWeight: 600 }}>Exclusions</div>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Checkbox
                          checked={options.excludeSimilar}
                          onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
                        >
                          Exclude similar characters (il1Lo0O)
                        </Checkbox>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Checkbox
                          checked={options.excludeAmbiguous}
                          onChange={(e) => setOptions(prev => ({ ...prev, excludeAmbiguous: e.target.checked }))}
                        >
                          Exclude ambiguous symbols
                        </Checkbox>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </Col>

        <Col span={24}>
          <div className="single-input-container">
            <Card title="Quick Presets" size="small">
              <Space wrap>
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    size="small"
                    onClick={() => {
                      setLength(preset.length);
                      setOptions(preset.options);
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
              </Space>
            </Card>
          </div>
        </Col>

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<ReloadOutlined />}
              onClick={generatePassword}
              className="btn"
            >
              Generate New
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!password}
              className="btn"
            >
              Copy Password
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!password}
              className="btn"
            >
              Clear
            </Button>
          </div>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default PasswordGenerator;