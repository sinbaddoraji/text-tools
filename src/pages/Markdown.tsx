import React, { useState } from 'react';
import MDEditor, { commands, help } from "@uiw/react-md-editor";
import { Row, Col, Button, message } from 'antd';
import { CopyOutlined, ClearOutlined, DownloadOutlined } from '@ant-design/icons';
import PageWrapper from '../components/PageWrapper';

const defaultMarkdown = `# Welcome to Markdown Editor

## Features
- **Bold text**
- *Italic text*
- ~~Strikethrough~~
- \`Inline code\`

### Code Blocks
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists
1. First item
2. Second item
3. Third item

### Links and Images
[Visit GitHub](https://github.com)

### Tables
| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

> This is a blockquote

---

Happy writing! 🚀`;

const MarkDownEditor: React.FC = () => {
    const [value, setValue] = useState(defaultMarkdown);
    const [messageApi, contextHolder] = message.useMessage();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            messageApi.success('Markdown copied to clipboard');
        } catch {
            messageApi.error('Failed to copy');
        }
    };

    const handleClear = () => {
        setValue('');
        messageApi.info('Editor cleared');
    };

    const handleDownload = () => {
        const blob = new Blob([value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        messageApi.success('Markdown file downloaded');
    };
    
    return (
        <PageWrapper
            title="Markdown Editor"
            description="Write and preview Markdown with live rendering, syntax highlighting, and export options."
        >
            {contextHolder}
            <Row gutter={[0, 32]}>
                <Col span={24}>
                    <div data-color-mode="light">
                        <MDEditor
                            height={500}
                            commands={[...commands.getCommands(), help]}
                            value={value}
                            onChange={(value) => setValue(value ?? '')}
                        />
                    </div>
                </Col>
                
                <Col span={24}>
                    <div className="action-buttons">
                        <Button 
                            type="primary"
                            size="large"
                            icon={<CopyOutlined />}
                            onClick={handleCopy}
                            disabled={!value}
                            className="btn"
                        >
                            Copy Markdown
                        </Button>
                        <Button 
                            size="large"
                            icon={<DownloadOutlined />}
                            onClick={handleDownload}
                            disabled={!value}
                            className="btn"
                        >
                            Download .md
                        </Button>
                        <Button 
                            size="large"
                            danger
                            icon={<ClearOutlined />}
                            onClick={handleClear}
                            disabled={!value}
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

export default MarkDownEditor;