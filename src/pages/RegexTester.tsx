import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Button, message, Card, Tag, Switch, Space } from 'antd';
import { 
  PlayCircleOutlined, 
  CopyOutlined, 
  ClearOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;

interface Match {
  match: string;
  index: number;
  groups: string[];
}

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testText, setTestText] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const testRegex = () => {
    if (!pattern.trim()) {
      setMatches([]);
      setIsValid(null);
      setError('');
      return;
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');
      
      const regex = new RegExp(pattern, flagString);
      setIsValid(true);
      setError('');

      if (!testText.trim()) {
        setMatches([]);
        return;
      }

      const foundMatches: Match[] = [];
      if (flags.g) {
        let match;
        while ((match = regex.exec(testText)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (!flags.g) break;
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      
      setMatches(foundMatches);
      messageApi.success(`Found ${foundMatches.length} match${foundMatches.length !== 1 ? 'es' : ''}`);
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid regex');
      setMatches([]);
      messageApi.error('Invalid regular expression');
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testText]);

  const handleCopyPattern = async () => {
    const flagString = Object.entries(flags)
      .filter(([, enabled]) => enabled)
      .map(([flag]) => flag)
      .join('');
    
    const fullPattern = `/${pattern}/${flagString}`;
    try {
      await navigator.clipboard.writeText(fullPattern);
      messageApi.success('Pattern copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setPattern('');
    setTestText('');
    setMatches([]);
    setIsValid(null);
    setError('');
    messageApi.info('Cleared');
  };

  const highlightMatches = (text: string, matches: Match[]) => {
    if (matches.length === 0) return text;
    
    let result = '';
    let lastIndex = 0;
    
    matches.forEach((match) => {
      result += text.slice(lastIndex, match.index);
      result += `<mark style="background-color: #ffe58f; padding: 2px 4px; border-radius: 3px; font-weight: 600;">${match.match}</mark>`;
      lastIndex = match.index + match.match.length;
    });
    
    result += text.slice(lastIndex);
    return result;
  };

  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
    { name: 'Phone', pattern: '\\+?1?-?\\(?([0-9]{3})\\)?[-.]?([0-9]{3})[-.]?([0-9]{4})' },
    { name: 'IPv4', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
    { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})' }
  ];

  return (
    <PageWrapper
      title="Regex Tester"
      description="Test regular expressions with real-time matching and highlighting."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <div className="section-content">
            <div className="section-label">
              Regular Expression Pattern
              {isValid !== null && (
                <Tag 
                  color={isValid ? 'success' : 'error'} 
                  icon={isValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                >
                  {isValid ? 'Valid' : 'Invalid'}
                </Tag>
              )}
            </div>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter your regex pattern (e.g., \d+|[a-zA-Z]+)"
              style={{ fontSize: '16px', fontFamily: 'monospace' }}
              status={isValid === false ? 'error' : undefined}
            />
            {error && (
              <div style={{ color: 'var(--danger-color)', marginTop: '8px', fontSize: '14px' }}>
                {error}
              </div>
            )}
          </div>
        </Col>

        <Col span={24}>
          <div className="section-content">
            <div className="section-label">Flags</div>
            <Space wrap>
              <Space>
                <Switch
                  checked={flags.g}
                  onChange={(checked) => setFlags(prev => ({ ...prev, g: checked }))}
                />
                <span>Global (g)</span>
              </Space>
              <Space>
                <Switch
                  checked={flags.i}
                  onChange={(checked) => setFlags(prev => ({ ...prev, i: checked }))}
                />
                <span>Ignore Case (i)</span>
              </Space>
              <Space>
                <Switch
                  checked={flags.m}
                  onChange={(checked) => setFlags(prev => ({ ...prev, m: checked }))}
                />
                <span>Multiline (m)</span>
              </Space>
              <Space>
                <Switch
                  checked={flags.s}
                  onChange={(checked) => setFlags(prev => ({ ...prev, s: checked }))}
                />
                <span>Dot All (s)</span>
              </Space>
            </Space>
          </div>
        </Col>

        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">Test Text</div>
              <TextArea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Enter text to test against your regex..."
                style={{ minHeight: '300px', fontSize: '15px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 12, maxRows: 20 }}
              />
            </div>
            
            <div className="output-section">
              <div className="section-label">
                Highlighted Results ({matches.length} match{matches.length !== 1 ? 'es' : ''})
              </div>
              <div
                style={{
                  minHeight: '300px',
                  padding: '12px 16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '15px',
                  fontFamily: 'monospace',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
                dangerouslySetInnerHTML={{
                  __html: testText ? highlightMatches(testText, matches) : 'Highlighted matches will appear here...'
                }}
              />
            </div>
          </div>
        </Col>

        {matches.length > 0 && (
          <Col span={24}>
            <Card title="Match Details" size="small">
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {matches.map((match, index) => (
                  <div key={index} style={{ marginBottom: '12px', padding: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                    <div><strong>Match {index + 1}:</strong> "{match.match}"</div>
                    <div><strong>Position:</strong> {match.index}-{match.index + match.match.length}</div>
                    {match.groups.length > 0 && (
                      <div><strong>Groups:</strong> {match.groups.map((group, i) => `$${i + 1}: "${group}"`).join(', ')}</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card title="Common Patterns" size="small">
            <Space wrap>
              {commonPatterns.map((item) => (
                <Button
                  key={item.name}
                  size="small"
                  onClick={() => setPattern(item.pattern)}
                >
                  {item.name}
                </Button>
              ))}
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={testRegex}
              disabled={!pattern}
              className="btn"
            >
              Test Regex
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={handleCopyPattern}
              disabled={!pattern}
              className="btn"
            >
              Copy Pattern
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!pattern && !testText}
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

export default RegexTester;