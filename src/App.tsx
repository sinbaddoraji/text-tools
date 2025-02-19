import React, { useState } from 'react';
import { 
  FontSizeOutlined, SyncOutlined, NumberOutlined, ScissorOutlined, 
  SearchOutlined, CopyOutlined, TagsOutlined, 
  CodeOutlined, LinkOutlined, LockOutlined, 
  RetweetOutlined, RedoOutlined, SoundOutlined, 
  CodeSandboxOutlined, MenuUnfoldOutlined, MenuFoldOutlined 
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, Row, Col } from 'antd';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import UpperLower from './pages/UpperLower';
import MarkDownEditor from './pages/Markdown';

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
    getItem('Text Formatter', 'TextFormatter', <FontSizeOutlined />),
  ]),
  getItem('Search & Replace', 'sub2', <SearchOutlined />, [
    getItem('Find & Replace', '5', <SearchOutlined />),
    getItem('Copy to Clipboard', '6', <CopyOutlined />),
    getItem('Slug Generator', '7', <TagsOutlined />),
  ]),
  getItem('Encoding & Security', 'sub3', <LockOutlined />, [
    getItem('Base64 Encode/Decode', '8', <CodeOutlined />),
    getItem('URL Encoder/Decoder', '9', <LinkOutlined />),
    getItem('Hash Generator', '10', <LockOutlined />),
  ]),
  getItem('Fun & Validation', 'sub4', <RetweetOutlined />, [
    getItem('Random String Generator', '11', <RetweetOutlined />),
    getItem('Palindrome Checker', '12', <RedoOutlined />),
    getItem('Text-to-Speech', '13', <SoundOutlined />),
  ]),
  getItem('Developer Tools', 'sub5', <CodeSandboxOutlined />, [
    getItem('JSON Formatter', '14', <CodeSandboxOutlined />),
    getItem('XML Formatter', '15', <CodeSandboxOutlined />),
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
                <Route path="/TextFormatter" element={<UpperLower />} />
                <Route path="/MarkDownEditor" element={<MarkDownEditor/>} />
                <Route path="/6" element={<div>Copy to Clipboard</div>} />
                <Route path="/7" element={<div>Slug Generator</div>} />
                <Route path="/8" element={<div>Base64 Encode/Decode</div>} />
                <Route path="/9" element={<div>URL Encoder/Decoder</div>} />
                <Route path="/10" element={<div>Hash Generator</div>} />
                <Route path="/11" element={<div>Random String Generator</div>} />
                <Route path="/12" element={<div>Palindrome Checker</div>} />
                <Route path="/13" element={<div>Text-to-Speech</div>} />
                <Route path="/14" element={<div>JSON Formatter</div>} />
                <Route path="/15" element={<div>XML Formatter</div>} />
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