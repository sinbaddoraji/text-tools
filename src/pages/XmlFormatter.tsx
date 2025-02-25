import { useState } from 'react';
import { Input, Button, Space } from 'antd';

const formatXML = (xml: string) => {
  const PADDING = '  '; // Default indentation
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;
  let formatted = '';
  xml = xml.replace(reg, '$1\r\n$2$3');
  xml.split('\r\n').forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w([^>]*[^/])?>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }
    formatted += PADDING.repeat(pad) + node + '\r\n';
    pad += indent;
  });
  return formatted.trim();
};

const XMLFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');

  const handleFormat = () => {
    try {
      if (!input.trim()) {
        setFormatted('');
        return;
      }
      const parser = new DOMParser();
      const dom = parser.parseFromString(input, 'application/xml');

      // Error Check for Invalid XML
      if (dom.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML');
      }

      const serializer = new XMLSerializer();
      const rawXML = serializer.serializeToString(dom);
      setFormatted(formatXML(rawXML));
    } catch (error) {
      alert('Invalid XML');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Input.TextArea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter XML to format"
        rows={4}
      />
      <Button onClick={handleFormat}>Format XML</Button>
      <Input.TextArea
        value={formatted}
        placeholder="Formatted XML"
        readOnly
        rows={8}
      />
    </Space>
  );
};

export default XMLFormatter;