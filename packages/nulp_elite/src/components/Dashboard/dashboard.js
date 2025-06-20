import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import Header from "../header";
import Footer from "../Footer";

const SupersetDashboard = () => {
  const { t } = useTranslation();
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef(null);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState("100vh");

  // URL to load in iframe
  const iframeUrl = "http://localhost:8088/superset/welcome/";

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIframeLoading(false);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeLoading(false);
    setIframeError(true);
  };

  // Handle window resize to adjust iframe height
  useEffect(() => {
    const resizeIframe = () => {
      const headerH = headerRef.current?.offsetHeight || 0;
      const footerH = footerRef.current?.offsetHeight || 0;
      setIframeHeight(`calc(100vh - ${headerH + footerH}px)`);
    };
    resizeIframe();
    window.addEventListener("resize", resizeIframe);
    return () => window.removeEventListener("resize", resizeIframe);
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div ref={headerRef}>
        <Header />
      </div>
      <Box sx={{ flex: 1, position: "relative" }}>
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          title="Dashboard"
          style={{
            width: "100%",
            height: iframeHeight,
            border: "none",
            display: iframeLoading || iframeError ? "none" : "block",
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          allow="fullscreen"
        />
      </Box>
      <div ref={footerRef}>
        <Footer />
      </div>
    </Box>
  );
};

export default SupersetDashboard;
