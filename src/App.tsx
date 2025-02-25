import React, { useState } from 'react';
import { 
  FontSizeOutlined, TagsOutlined, 
  CodeOutlined, LinkOutlined, LockOutlined, 
  RetweetOutlined, RedoOutlined, SoundOutlined, 
  CodeSandboxOutlined, MenuUnfoldOutlined, MenuFoldOutlined 
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, Row, Col } from 'antd';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

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

const { Header, Content, Sider,Footer } = Layout;

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
  getItem('Formatting', 'sub1', <FontSizeOutlined />, [
    getItem('Text Formatter', '', <FontSizeOutlined />),
    getItem('Slug Generator', 'SlugGenerator', <TagsOutlined />),
  ]),
  getItem('Encoding & Security', 'sub3', <LockOutlined />, [
    getItem('Base64 Encode/Decode', 'Base64Encode', <CodeOutlined />),
    getItem('URL Encoder/Decoder', 'UrlEncoder', <LinkOutlined />),
    getItem('Hash Generator', 'HashGenerator', <LockOutlined />),
  ]),
  getItem('Fun & Validation', 'sub4', <RetweetOutlined />, [
    getItem('Random String Generator', 'RandomStringGenerator', <RetweetOutlined />),
    getItem('Palindrome Checker', 'PalindromeChecker', <RedoOutlined />),
    getItem('Text-to-Speech', 'TextToSpeech', <SoundOutlined />),
  ]),
  getItem('Developer Tools', 'sub5', <CodeSandboxOutlined />, [
    getItem('JSON Formatter', 'JsonFormatter', <CodeSandboxOutlined />),
    getItem('XML Formatter', 'XmlFormatter', <CodeSandboxOutlined />),
    getItem('MarkDown Editor', 'MarkDownEditor', <CodeSandboxOutlined />)
  ]),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const colorBgContainer = "hsv(0, 0%, 40%)";
  const navigate = useNavigate();

  const onMenuClick: MenuProps['onClick'] = (e) => {
    navigate(`/${e.key}`);
  };

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '100vw', backgroundColor: colorBgContainer }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={onMenuClick} />
      </Sider>
      <Layout style={{ minHeight: '100vh', backgroundColor: colorBgContainer }}>

        <Header style={{ padding: 0, backgroundColor: 'white'  }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>

        <Content style={{ margin: '14px', backgroundColor: colorBgContainer }}>
          <Row style={{ width: '100%' }}>
            <Col span={24}>
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
                <Route path="*" element={<p>Not found</p>} />
              </Routes>
            </Col>
          </Row>
        </Content>

        <Footer style={{ padding: 0, backgroundColor: 'white'  }}></Footer>

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