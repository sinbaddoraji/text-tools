import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Button, message, Card, Tag, Alert, Descriptions } from 'antd';
import { 
  CopyOutlined, 
  ClearOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface JwtPayload {
  [key: string]: any;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

interface DecodedJwt {
  header: any;
  payload: JwtPayload;
  signature: string;
  isValid: boolean;
  isExpired: boolean;
  expiresAt?: string;
  issuedAt?: string;
  notBefore?: string;
}

const JwtDecoder: React.FC = () => {
  const [jwtToken, setJwtToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const base64UrlDecode = (str: string): string => {
    // Add padding if needed
    let padded = str;
    while (padded.length % 4) {
      padded += '=';
    }
    
    // Replace URL-safe characters
    padded = padded.replace(/-/g, '+').replace(/_/g, '/');
    
    try {
      return atob(padded);
    } catch {
      throw new Error('Invalid base64 encoding');
    }
  };

  const decodeJwt = (token: string): DecodedJwt => {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
    }

    const [headerB64, payloadB64, signature] = parts;

    let header, payload;

    try {
      header = JSON.parse(base64UrlDecode(headerB64));
    } catch {
      throw new Error('Invalid header encoding');
    }

    try {
      payload = JSON.parse(base64UrlDecode(payloadB64));
    } catch {
      throw new Error('Invalid payload encoding');
    }

    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp ? payload.exp < now : false;
    const isValid = true; // We can't verify signature without the secret

    return {
      header,
      payload,
      signature,
      isValid,
      isExpired,
      expiresAt: payload.exp ? dayjs.unix(payload.exp).format('YYYY-MM-DD HH:mm:ss UTC') : undefined,
      issuedAt: payload.iat ? dayjs.unix(payload.iat).format('YYYY-MM-DD HH:mm:ss UTC') : undefined,
      notBefore: payload.nbf ? dayjs.unix(payload.nbf).format('YYYY-MM-DD HH:mm:ss UTC') : undefined
    };
  };

  useEffect(() => {
    if (!jwtToken.trim()) {
      setDecoded(null);
      setError('');
      return;
    }

    try {
      const result = decodeJwt(jwtToken.trim());
      setDecoded(result);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode JWT');
      setDecoded(null);
    }
  }, [jwtToken]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setJwtToken('');
    setDecoded(null);
    setError('');
    messageApi.info('Cleared');
  };

  const sampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const getAlgorithmColor = (alg: string): string => {
    switch (alg?.toLowerCase()) {
      case 'hs256':
      case 'hs384':
      case 'hs512':
        return 'blue';
      case 'rs256':
      case 'rs384':
      case 'rs512':
        return 'green';
      case 'es256':
      case 'es384':
      case 'es512':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <PageWrapper
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens (JWT) with detailed payload analysis."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="section-content">
            <div className="section-label">
              JWT Token
              {decoded && (
                <Tag 
                  color={decoded.isValid ? 'success' : 'error'} 
                  icon={decoded.isValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                >
                  {decoded.isValid ? 'Valid Format' : 'Invalid'}
                </Tag>
              )}
              {decoded && decoded.isExpired && (
                <Tag color="warning" icon={<WarningOutlined />}>
                  Expired
                </Tag>
              )}
            </div>
            <TextArea
              value={jwtToken}
              onChange={(e) => setJwtToken(e.target.value)}
              placeholder="Paste your JWT token here..."
              style={{ minHeight: '120px', fontSize: '14px', fontFamily: 'monospace' }}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
            {error && (
              <Alert
                message="Decoding Error"
                description={error}
                type="error"
                style={{ marginTop: '16px' }}
              />
            )}
            <div style={{ marginTop: '16px' }}>
              <Button size="small" onClick={() => setJwtToken(sampleJwt)}>
                Load Sample JWT
              </Button>
            </div>
          </div>
        </Col>

        {decoded && (
          <>
            <Col span={24}>
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card 
                    title="Header" 
                    size="small"
                    extra={
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2))}
                      />
                    }
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Algorithm">
                        <Tag color={getAlgorithmColor(decoded.header.alg)}>
                          {decoded.header.alg || 'Not specified'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Type">
                        {decoded.header.typ || 'Not specified'}
                      </Descriptions.Item>
                      {decoded.header.kid && (
                        <Descriptions.Item label="Key ID">
                          {decoded.header.kid}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontWeight: 600, marginBottom: '8px' }}>Raw Header:</div>
                      <pre style={{ 
                        fontSize: '12px', 
                        backgroundColor: 'var(--bg-tertiary)', 
                        padding: '12px', 
                        borderRadius: '4px',
                        margin: 0,
                        overflow: 'auto'
                      }}>
                        {JSON.stringify(decoded.header, null, 2)}
                      </pre>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card 
                    title="Payload" 
                    size="small"
                    extra={
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2))}
                      />
                    }
                  >
                    <Descriptions column={1} size="small">
                      {decoded.payload.iss && (
                        <Descriptions.Item label="Issuer (iss)">
                          {decoded.payload.iss}
                        </Descriptions.Item>
                      )}
                      {decoded.payload.sub && (
                        <Descriptions.Item label="Subject (sub)">
                          {decoded.payload.sub}
                        </Descriptions.Item>
                      )}
                      {decoded.payload.aud && (
                        <Descriptions.Item label="Audience (aud)">
                          {Array.isArray(decoded.payload.aud) 
                            ? decoded.payload.aud.join(', ') 
                            : decoded.payload.aud}
                        </Descriptions.Item>
                      )}
                      {decoded.expiresAt && (
                        <Descriptions.Item label="Expires (exp)">
                          <Tag color={decoded.isExpired ? 'error' : 'success'}>
                            {decoded.expiresAt}
                          </Tag>
                        </Descriptions.Item>
                      )}
                      {decoded.issuedAt && (
                        <Descriptions.Item label="Issued At (iat)">
                          {decoded.issuedAt}
                        </Descriptions.Item>
                      )}
                      {decoded.notBefore && (
                        <Descriptions.Item label="Not Before (nbf)">
                          {decoded.notBefore}
                        </Descriptions.Item>
                      )}
                      {decoded.payload.jti && (
                        <Descriptions.Item label="JWT ID (jti)">
                          {decoded.payload.jti}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontWeight: 600, marginBottom: '8px' }}>Raw Payload:</div>
                      <pre style={{ 
                        fontSize: '12px', 
                        backgroundColor: 'var(--bg-tertiary)', 
                        padding: '12px', 
                        borderRadius: '4px',
                        margin: 0,
                        overflow: 'auto',
                        maxHeight: '200px'
                      }}>
                        {JSON.stringify(decoded.payload, null, 2)}
                      </pre>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <Card title="Token Analysis" size="small">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: decoded.isValid ? 'var(--secondary-color)' : 'var(--danger-color)' }}>
                        {decoded.isValid ? '✓' : '✗'}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Format Valid
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: decoded.isExpired ? 'var(--danger-color)' : 'var(--secondary-color)' }}>
                        {decoded.isExpired ? '✗' : '✓'}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Not Expired
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning-color)' }}>
                        ?
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Signature (requires secret)
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </>
        )}

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={() => decoded && handleCopy(JSON.stringify({ header: decoded.header, payload: decoded.payload }, null, 2))}
              disabled={!decoded}
              className="btn"
            >
              Copy Decoded
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!jwtToken}
              className="btn"
            >
              Clear
            </Button>
          </div>
        </Col>

        <Col span={24}>
          <Card title="JWT Information" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>About JWT:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>JSON Web Tokens are a compact way to securely transmit information</li>
                    <li>Consists of three parts: Header, Payload, and Signature</li>
                    <li>Base64URL encoded and separated by dots</li>
                    <li>Can be verified and trusted because they are digitally signed</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Security Note:</div>
                  <Alert
                    message="This tool only decodes the JWT structure. Signature verification requires the secret key and is not performed here."
                    type="warning"
                    showIcon
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default JwtDecoder;