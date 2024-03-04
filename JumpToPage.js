import React, { useRef } from 'react';

const MyComponent = () => {
  // Step 1: Define a ref
  const contentRef = useRef(null);

  // Step 3: Implement a function to jump to content
  const jumpToContent = () => {
    // Step 4: Scroll to the content
    contentRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Step 2: Attach the ref to the content */}
      <button onClick={jumpToContent}>Jump to Content</button>
      {/* Content */}
      <div ref={contentRef}>
        <h1>Content Title</h1>
        <p>This is the content you want to jump to.</p>
      </div>
    </div>
  );
};

export default MyComponent;
