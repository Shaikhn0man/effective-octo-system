import mermaid from 'mermaid';
import React, { useEffect, useRef } from 'react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
});

export function MermaidDiagram({ chart, id }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.render(`mermaid-${id}`, chart).then(({ svg }) => {
        containerRef.current.innerHTML = svg;
      });
    }
  }, [chart, id]);

  return <div ref={containerRef} className="mermaid-diagram" />;
}
