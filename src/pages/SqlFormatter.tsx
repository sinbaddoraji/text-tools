import React, { useState } from 'react';
import { Input, Row, Col, Button, message, Select, Card, Switch, Space } from 'antd';
import { 
  FormatPainterOutlined, 
  CompressOutlined,
  CopyOutlined, 
  ClearOutlined,
  DatabaseOutlined,
  CodeOutlined
} from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const { TextArea } = Input;
const { Option } = Select;

const SqlFormatter: React.FC = () => {
  const [sqlInput, setSqlInput] = useState('');
  const [sqlOutput, setSqlOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [keywordCase, setKeywordCase] = useState<'upper' | 'lower'>('upper');
  const [lineBreaks, setLineBreaks] = useState(true);
  const [indentJoins, setIndentJoins] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
    'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
    'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
    'ALTER', 'DROP', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
    'CONSTRAINT', 'UNIQUE', 'CHECK', 'DEFAULT', 'AUTO_INCREMENT',
    'VARCHAR', 'CHAR', 'TEXT', 'INT', 'INTEGER', 'BIGINT', 'DECIMAL', 'FLOAT',
    'DOUBLE', 'BOOLEAN', 'DATE', 'TIME', 'TIMESTAMP', 'DATETIME',
    'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'DISTINCT',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'UNION', 'ALL', 'EXCEPT', 'INTERSECT'
  ];

  const formatSql = (sql: string): string => {
    if (!sql.trim()) return '';

    let formatted = sql
      .replace(/\s+/g, ' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .replace(/,\s*/g, ', ')
      .trim();

    // Handle keyword case
    const keywordRegex = new RegExp(`\\b(${sqlKeywords.join('|')})\\b`, 'gi');
    formatted = formatted.replace(keywordRegex, (match) => 
      keywordCase === 'upper' ? match.toUpperCase() : match.toLowerCase()
    );

    if (!lineBreaks) {
      return formatted;
    }

    const indent = ' '.repeat(indentSize);
    let result = '';
    let currentIndent = 0;
    let inParentheses = 0;
    let inString = false;
    let stringChar = '';

    const tokens = formatted.split(/(\s+|[(),;]|'[^']*'|"[^"]*")/);
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const nextToken = tokens[i + 1];
      const upperToken = token.toUpperCase();

      // Handle string literals
      if ((token.startsWith("'") && token.endsWith("'")) || 
          (token.startsWith('"') && token.endsWith('"'))) {
        result += token;
        continue;
      }

      // Handle parentheses
      if (token === '(') {
        inParentheses++;
        result += token;
        continue;
      }
      
      if (token === ')') {
        inParentheses--;
        result += token;
        continue;
      }

      // Handle semicolons
      if (token === ';') {
        result += token;
        if (nextToken && nextToken.trim()) {
          result += '\n\n';
          currentIndent = 0;
        }
        continue;
      }

      // Skip whitespace tokens
      if (token.trim() === '') {
        continue;
      }

      // Major keywords that start new lines
      if (['SELECT', 'FROM', 'WHERE', 'GROUP', 'HAVING', 'ORDER', 'UNION', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'].includes(upperToken)) {
        if (result.trim() && !result.endsWith('\n')) {
          result += '\n';
        }
        result += ' '.repeat(currentIndent * indentSize) + token;
        
        if (upperToken === 'SELECT') {
          currentIndent = 1;
        }
        continue;
      }

      // JOIN keywords
      if (['JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER'].includes(upperToken)) {
        if (upperToken === 'JOIN' || (upperToken === 'OUTER' && nextToken && nextToken.toUpperCase() === 'JOIN')) {
          result += '\n';
          if (indentJoins) {
            result += ' '.repeat((currentIndent - 1) * indentSize);
          } else {
            result += ' '.repeat(currentIndent * indentSize);
          }
        } else {
          result += ' ';
        }
        result += token;
        continue;
      }

      // BY keyword (for GROUP BY, ORDER BY)
      if (upperToken === 'BY') {
        result += ' ' + token;
        continue;
      }

      // ON keyword (for JOIN conditions)
      if (upperToken === 'ON' && inParentheses === 0) {
        result += '\n' + ' '.repeat((currentIndent + 1) * indentSize) + token;
        continue;
      }

      // AND, OR in WHERE/HAVING clauses
      if (['AND', 'OR'].includes(upperToken) && inParentheses === 0) {
        result += '\n' + ' '.repeat((currentIndent + 1) * indentSize) + token;
        continue;
      }

      // Commas in SELECT lists
      if (token === ',' && inParentheses === 0) {
        result += token + '\n' + ' '.repeat(currentIndent * indentSize);
        continue;
      }

      // Default case - add the token with a space
      if (result.trim() && !result.endsWith(' ') && !result.endsWith('\n')) {
        result += ' ';
      }
      result += token;
    }

    return result.trim();
  };

  const minifySql = (sql: string): string => {
    return sql
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),;])\s*/g, '$1')
      .trim();
  };

  const handleFormat = () => {
    if (!sqlInput.trim()) {
      setSqlOutput('');
      return;
    }

    try {
      const formatted = formatSql(sqlInput);
      setSqlOutput(formatted);
      messageApi.success('SQL formatted successfully');
    } catch (err) {
      messageApi.error('Failed to format SQL');
    }
  };

  const handleMinify = () => {
    if (!sqlInput.trim()) {
      setSqlOutput('');
      return;
    }

    try {
      const minified = minifySql(sqlInput);
      setSqlOutput(minified);
      messageApi.success('SQL minified successfully');
    } catch (err) {
      messageApi.error('Failed to minify SQL');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlOutput);
      messageApi.success('Copied to clipboard');
    } catch {
      messageApi.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setSqlInput('');
    setSqlOutput('');
    messageApi.info('Cleared');
  };

  const sampleSql = `select u.id,u.name,u.email,p.title,p.content,c.name as category from users u left join posts p on u.id=p.user_id inner join categories c on p.category_id=c.id where u.active=1 and p.published_at is not null and p.created_at between '2023-01-01' and '2023-12-31' group by u.id,c.id having count(p.id)>5 order by u.name asc,p.created_at desc limit 10 offset 20;`;

  return (
    <PageWrapper
      title="SQL Formatter"
      description="Format, beautify, and minify SQL queries with customizable styling options."
    >
      {contextHolder}
      <Row gutter={[0, 32]}>
        <Col span={24}>
          <Card title="Formatting Options" size="small">
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={6}>
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
              
              <Col xs={24} sm={6}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Keyword Case</div>
                <Select
                  value={keywordCase}
                  onChange={setKeywordCase}
                  style={{ width: '100%' }}
                >
                  <Option value="upper">UPPERCASE</Option>
                  <Option value="lower">lowercase</Option>
                </Select>
              </Col>

              <Col xs={24} sm={6}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Line Breaks</div>
                <Switch
                  checked={lineBreaks}
                  onChange={setLineBreaks}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </Col>

              <Col xs={24} sm={6}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Indent JOINs</div>
                <Switch
                  checked={indentJoins}
                  onChange={setIndentJoins}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                  disabled={!lineBreaks}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <div className="input-output-container">
            <div className="input-section">
              <div className="section-label">
                <DatabaseOutlined style={{ marginRight: '8px' }} />
                SQL Input
                <Button 
                  size="small" 
                  type="link" 
                  onClick={() => setSqlInput(sampleSql)}
                >
                  Load Sample
                </Button>
              </div>
              <TextArea
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                placeholder="Enter your SQL query here..."
                style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 15, maxRows: 30 }}
              />
            </div>
            
            <div className="output-section">
              <div className="section-label">
                <CodeOutlined style={{ marginRight: '8px' }} />
                Formatted SQL
              </div>
              <TextArea
                value={sqlOutput}
                readOnly
                placeholder="Formatted SQL will appear here..."
                style={{ minHeight: '400px', fontSize: '14px', fontFamily: 'monospace' }}
                autoSize={{ minRows: 15, maxRows: 30 }}
              />
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="action-buttons">
            <Button 
              type="primary" 
              size="large"
              icon={<FormatPainterOutlined />}
              onClick={handleFormat}
              disabled={!sqlInput.trim()}
              className="btn"
            >
              Format SQL
            </Button>
            <Button 
              size="large"
              icon={<CompressOutlined />}
              onClick={handleMinify}
              disabled={!sqlInput.trim()}
              className="btn"
            >
              Minify SQL
            </Button>
            <Button 
              type="primary"
              size="large"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              disabled={!sqlOutput}
              className="btn"
            >
              Copy Output
            </Button>
            <Button 
              size="large"
              danger
              icon={<ClearOutlined />}
              onClick={handleClear}
              disabled={!sqlInput && !sqlOutput}
              className="btn"
            >
              Clear
            </Button>
          </div>
        </Col>

        <Col span={24}>
          <Card title="SQL Formatting Information" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Formatting Features:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>Proper indentation for readability</li>
                    <li>Line breaks after major keywords</li>
                    <li>Aligned JOIN clauses and conditions</li>
                    <li>Consistent keyword casing</li>
                    <li>Comma placement in SELECT lists</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Supported SQL Elements:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    <li>SELECT, INSERT, UPDATE, DELETE statements</li>
                    <li>JOIN operations (INNER, LEFT, RIGHT, FULL)</li>
                    <li>WHERE, GROUP BY, HAVING, ORDER BY clauses</li>
                    <li>Common functions and data types</li>
                    <li>Subqueries and UNION operations</li>
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

export default SqlFormatter;