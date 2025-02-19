import React, { useRef, useState } from 'react';
import MDEditor, { commands, help } from "@uiw/react-md-editor";

const mkdStr = `## Markdown Editor`;

const MarkDownEditor: React.FC = () => {
    const [value, setValue] = React.useState(mkdStr);
    
    return (
        <div data-color-mode="light">
            <MDEditor
                    height={400}
                    commands={[...commands.getCommands(), help]}
                    value={value}
                    onChange={(value) => setValue(value || '')}
                />
        </div>
      
    );
};

export default MarkDownEditor;