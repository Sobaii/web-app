import React from 'react';
import { Draggable } from 'react-draggable';
import { Resizable } from 're-resizable';

const ResizeAndDrag = (WrappedComponent) => {
  return (props) => {
    return (
      <Draggable>
        <Resizable
          defaultSize={{
            width: 200,
            height: 200,
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #ddd',
            background: '#f0f0f0',
            padding: '10px',
          }}
        >
          <WrappedComponent {...props} />
        </Resizable>
      </Draggable>
    );
  };
};

export default ResizeAndDrag;
