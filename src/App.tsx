import React, { useState } from 'react';
import { 
  FontSizeOutlined, TagsOutlined, 
  CodeOutlined, LinkOutlined, LockOutlined, 
  RetweetOutlined, RedoOutlined, SoundOutlined, 
  CodeSandboxOutlined, 
  FileTextOutlined, ToolOutlined, ApiOutlined, BugOutlined,
  SafetyCertificateOutlined, KeyOutlined, ClockCircleOutlined,
  FileSearchOutlined, TableOutlined, DatabaseOutlined, QrcodeOutlined,
  SwapOutlined, GlobalOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Typography, Space } from 'antd';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import UpperLower from './pages/UpperLower';
import MarkDownEditor from './pages/Markdown';
import SlugGenerator from './pages/SlugGenerator';
import Base64Encoder from './pages/Base64Encoder';
import JSONFormatter from './pages/JsonFormatter';
import XmlFormatter from './pages/XmlFormatter';
import TextToSpeech from './pages/TextToSpeech';
import PalindromeChecker from './pages/PalindromeChecker';
import RandomStringGenerator from './pages/RandomStringGenerator';
import HashGenerator from './pages/HashGenerator';
import URLEncoderDecoder from './pages/UrlEncoder';
import RegexTester from './pages/RegexTester';
import PasswordGenerator from './pages/PasswordGenerator';
import UuidGenerator from './pages/UuidGenerator';
import TimestampConverter from './pages/TimestampConverter';
import JwtDecoder from './pages/JwtDecoder';
import CsvJsonConverter from './pages/CsvJsonConverter';
import YamlFormatter from './pages/YamlFormatter';
import SqlFormatter from './pages/SqlFormatter';
import HtmlEntityConverter from './pages/HtmlEntityConverter';
import QrCodeGenerator from './pages/QrCodeGenerator';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Text Tools', 'sub1', <FileTextOutlined />, [
    getItem('Case Converter', '', <FontSizeOutlined />),
    getItem('Slug Generator', 'SlugGenerator', <TagsOutlined />),
  ]),
  getItem('Encoding & Security', 'sub2', <LockOutlined />, [
    getItem('Base64 Encode/Decode', 'Base64Encode', <CodeOutlined />),
    getItem('URL Encoder/Decoder', 'UrlEncoder', <LinkOutlined />),
    getItem('Hash Generator', 'HashGenerator', <LockOutlined />),
  ]),
  getItem('Utilities', 'sub3', <ToolOutlined />, [
    getItem('Random String Generator', 'RandomStringGenerator', <RetweetOutlined />),
    getItem('Palindrome Checker', 'PalindromeChecker', <RedoOutlined />),
    getItem('Text-to-Speech', 'TextToSpeech', <SoundOutlined />),
  ]),
  getItem('Data Processing', 'sub4', <TableOutlined />, [
    getItem('CSV ↔ JSON Converter', 'CsvJsonConverter', <SwapOutlined />),
    getItem('YAML Formatter', 'YamlFormatter', <FileTextOutlined />),
    getItem('SQL Formatter', 'SqlFormatter', <DatabaseOutlined />),
    getItem('HTML Entity Converter', 'HtmlEntityConverter', <GlobalOutlined />),
    getItem('QR Code Generator', 'QrCodeGenerator', <QrcodeOutlined />)
  ]),
  getItem('Developer Tools', 'sub5', <ApiOutlined />, [
    getItem('JSON Formatter', 'JsonFormatter', <CodeSandboxOutlined />),
    getItem('XML Formatter', 'XmlFormatter', <CodeSandboxOutlined />),
    getItem('Markdown Editor', 'MarkDownEditor', <FileTextOutlined />),
    getItem('Regex Tester', 'RegexTester', <BugOutlined />),
    getItem('Password Generator', 'PasswordGenerator', <SafetyCertificateOutlined />),
    getItem('UUID Generator', 'UuidGenerator', <KeyOutlined />),
    getItem('Timestamp Converter', 'TimestampConverter', <ClockCircleOutlined />),
    getItem('JWT Decoder', 'JwtDecoder', <FileSearchOutlined />)
  ]),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onMenuClick: MenuProps['onClick'] = (e) => {
    navigate(`/${e.key}`);
  };

  const getSelectedKeys = () => {
    const path = location.pathname.slice(1);
    return path ? [path] : [''];
  };

  const getPageTitle = () => {
    const path = location.pathname.slice(1);
    const titles: Record<string, string> = {
      '': 'Case Converter',
      'SlugGenerator': 'Slug Generator',
      'Base64Encode': 'Base64 Encoder/Decoder',
      'UrlEncoder': 'URL Encoder/Decoder',
      'HashGenerator': 'Hash Generator',
      'RandomStringGenerator': 'Random String Generator',
      'PalindromeChecker': 'Palindrome Checker',
      'TextToSpeech': 'Text to Speech',
      'JsonFormatter': 'JSON Formatter',
      'XmlFormatter': 'XML Formatter',
      'MarkDownEditor': 'Markdown Editor',
      'CsvJsonConverter': 'CSV ↔ JSON Converter',
      'YamlFormatter': 'YAML Formatter',
      'SqlFormatter': 'SQL Formatter',
      'HtmlEntityConverter': 'HTML Entity Converter',
      'QrCodeGenerator': 'QR Code Generator',
      'RegexTester': 'Regex Tester',
      'PasswordGenerator': 'Password Generator',
      'UuidGenerator': 'UUID Generator',
      'TimestampConverter': 'Timestamp Converter',
      'JwtDecoder': 'JWT Decoder'
    };
    return titles[path] || 'Text Tools';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
      >
        <div className="app-logo">
          {!collapsed && 'Text Tools'}
        </div>
        <Menu 
          theme="dark" 
          selectedKeys={getSelectedKeys()} 
          mode="inline" 
          items={items} 
          onClick={onMenuClick} 
        />
      </Sider>
      <Layout>
        <Header>
          <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Title level={3} style={{ margin: 0 }}>
                {getPageTitle()}
              </Title>
            </Space>
          </Space>
        </Header>
        <Content>
          <div className="tool-container">
            <Routes>
              <Route path="/" element={<UpperLower />} />
              <Route path="/MarkDownEditor" element={<MarkDownEditor/>} />
              <Route path="/SlugGenerator" element={<SlugGenerator/>} />
              <Route path="/Base64Encode" element={<Base64Encoder/>} />
              <Route path="/UrlEncoder" element={<URLEncoderDecoder/>} />
              <Route path="/HashGenerator" element={<HashGenerator/>} />
              <Route path="/RandomStringGenerator" element={<RandomStringGenerator/>} />
              <Route path="/PalindromeChecker" element={<PalindromeChecker/>} />
              <Route path="/TextToSpeech" element={<TextToSpeech/>} />
              <Route path="/JsonFormatter" element={<JSONFormatter/>} />
              <Route path="/XmlFormatter" element={<XmlFormatter/>} />
              <Route path="/RegexTester" element={<RegexTester/>} />
              <Route path="/PasswordGenerator" element={<PasswordGenerator/>} />
              <Route path="/UuidGenerator" element={<UuidGenerator/>} />
              <Route path="/TimestampConverter" element={<TimestampConverter/>} />
              <Route path="/JwtDecoder" element={<JwtDecoder/>} />
              <Route path="/CsvJsonConverter" element={<CsvJsonConverter/>} />
              <Route path="/YamlFormatter" element={<YamlFormatter/>} />
              <Route path="/SqlFormatter" element={<SqlFormatter/>} />
              <Route path="/HtmlEntityConverter" element={<HtmlEntityConverter/>} />
              <Route path="/QrCodeGenerator" element={<QrCodeGenerator/>} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

const WrappedApp: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;