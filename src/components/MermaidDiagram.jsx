import mermaid from 'mermaid';
import React, { useEffect, useRef, useState } from 'react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
  }
});

export function MermaidDiagram({ chart, id }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Generate unique ID for this render
        const uniqueId = `mermaid-${id}-${Date.now()}`;
        
        // Render the diagram
        const { svg } = await mermaid.render(uniqueId, chart);
        
        setSvgContent(svg);
        setIsLoading(false);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure the container is properly mounted
    const timer = setTimeout(renderDiagram, 100);
    return () => clearTimeout(timer);
  }, [chart, id]);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '400px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8'
      }}>
        Loading diagram...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '400px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'red',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <div>Error rendering diagram:</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="mermaid-diagram"
      style={{ 
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
