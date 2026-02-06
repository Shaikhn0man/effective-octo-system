import { RotateCcw, ToggleLeft, ToggleRight, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { screenFlowData } from "../data/screenFlowData";
import { MermaidDiagram } from "./MermaidDiagram";

export function ScreenFlowView() {
  const [isBusinessView, setIsBusinessView] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const toggleView = () => {
    setIsBusinessView(!isBusinessView);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.3), 3));
  };

  // Touch/Pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch gesture
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      containerRef.current.initialPinchDistance = distance;
      containerRef.current.initialScale = scale;
    } else if (e.touches.length === 1) {
      // Single touch for panning
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (containerRef.current.initialPinchDistance) {
        const scaleChange = distance / containerRef.current.initialPinchDistance;
        const newScale = Math.min(Math.max(containerRef.current.initialScale * scaleChange, 0.3), 3);
        setScale(newScale);
      }
    } else if (e.touches.length === 1 && isDragging) {
      // Pan
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.initialPinchDistance = null;
      containerRef.current.initialScale = null;
    }
  };

  // Mouse drag for panning
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [scale, position, isDragging, dragStart]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: "100%", 
        height: "100%", 
        overflow: "hidden", 
        position: "relative",
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Floating Toggle Button */}
      <div style={{
        position: "fixed",
        top: "100px",
        right: "30px",
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        userSelect: "none"
      }}
      onClick={toggleView}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.4)";
        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
      }}
      >
        <div style={{
          color: isBusinessView ? "#3b82f6" : "#94a3b8",
          fontSize: "13px",
          fontWeight: "600",
          transition: "color 0.2s ease"
        }}>
          {isBusinessView ? "Business View" : "System View"}
        </div>
        
        <div style={{
          color: isBusinessView ? "#3b82f6" : "#94a3b8",
          display: "flex",
          alignItems: "center",
          transition: "color 0.2s ease"
        }}>
          {isBusinessView ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
        </div>
        
        <div style={{
          fontSize: "11px",
          color: "#64748b",
          fontWeight: "500"
        }}>
          Toggle
        </div>
      </div>

      {/* Zoom Controls */}
      <div style={{
        position: "fixed",
        top: "180px",
        right: "30px",
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}>
        <button
          onClick={handleZoomIn}
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "8px",
            padding: "8px",
            color: "#3b82f6",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
          }}
        >
          <ZoomIn size={16} />
        </button>
        
        <div style={{
          color: "#94a3b8",
          fontSize: "11px",
          textAlign: "center",
          fontWeight: "600",
          padding: "4px 0"
        }}>
          {Math.round(scale * 100)}%
        </div>
        
        <button
          onClick={handleZoomOut}
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "8px",
            padding: "8px",
            color: "#3b82f6",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
          }}
        >
          <ZoomOut size={16} />
        </button>
        
        <button
          onClick={handleReset}
          style={{
            background: "rgba(156, 163, 175, 0.1)",
            border: "1px solid rgba(156, 163, 175, 0.3)",
            borderRadius: "8px",
            padding: "8px",
            color: "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(156, 163, 175, 0.2)";
            e.currentTarget.style.borderColor = "rgba(156, 163, 175, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(156, 163, 175, 0.1)";
            e.currentTarget.style.borderColor = "rgba(156, 163, 175, 0.3)";
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Diagram Content with Transform */}
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          padding: "20px",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <MermaidDiagram 
          chart={isBusinessView ? screenFlowData.businessDiagram : screenFlowData.systemDiagram} 
          id={isBusinessView ? "business-flow" : "system-flow"} 
        />
      </div>
    </div>
  );
}