import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pre-create standard image path list
const FRAME_COUNT = 34;

export default function DisassemblyCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef([]);

  useEffect(() => {
    // 1. Preload images
    let loadedCount = 0;
    const tempImages = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      // Resolve path using Vite's relative URL
      img.src = new URL(`../assets/frames/ezgif-frame-${frameNum}.webp`, import.meta.url).href;
      
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          setImagesLoaded(true);
        }
      };
      tempImages.push(img);
    }
    
    imagesRef.current = tempImages;
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set internal resolution
    canvas.width = 1080;
    canvas.height = 1080;

    const renderFrame = (index) => {
      const img = imagesRef.current[index];
      if (img && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Scale and center the image to fit the canvas nicely
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.95;
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        // Save state for glow filters
        ctx.save();
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        ctx.restore();
      }
    };

    // Draw the first frame
    renderFrame(0);

    // 2. Setup GSAP ScrollTrigger Sequence
    const frameObj = { frame: 0 };
    
    // Pin container for 500vh
    const anim = gsap.to(frameObj, {
      frame: FRAME_COUNT - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        pin: '.disassembly-sticky-wrapper',
          onUpdate: () => {
            renderFrame(Math.round(frameObj.frame));
          }
      }
    });

    // 3. Animate overlay text labels in a single synchronized timeline
    const labelsTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5
      }
    });

    // Set initial state for all labels
    labelsTl.set('.spec-card', { opacity: 0, y: 30, scale: 0.9 });

    // Label 1: Intro
    labelsTl.to('.label-intro', { opacity: 1, y: 0, scale: 1, duration: 3 }, 0);
    labelsTl.to('.label-intro', { opacity: 0, y: -30, scale: 0.9, duration: 3 }, 8);

    // Label 2: Back panel
    labelsTl.to('.label-back', { opacity: 1, y: 0, scale: 1, duration: 3 }, 15);
    labelsTl.to('.label-back', { opacity: 0, y: -30, scale: 0.9, duration: 3 }, 24);

    // Label 3: Battery
    labelsTl.to('.label-battery', { opacity: 1, y: 0, scale: 1, duration: 3 }, 30);
    labelsTl.to('.label-battery', { opacity: 0, y: -30, scale: 0.9, duration: 3 }, 39);

    // Label 4: Camera
    labelsTl.to('.label-camera', { opacity: 1, y: 0, scale: 1, duration: 3 }, 45);
    labelsTl.to('.label-camera', { opacity: 0, y: -30, scale: 0.9, duration: 3 }, 54);

    // Label 5: Logic Board
    labelsTl.to('.label-cpu', { opacity: 1, y: 0, scale: 1, duration: 3 }, 60);
    labelsTl.to('.label-cpu', { opacity: 0, y: -30, scale: 0.9, duration: 3 }, 69);

    // Label 6: Audio Engine
    labelsTl.to('.label-speakers', { opacity: 1, y: 0, scale: 1, duration: 3 }, 75);
    labelsTl.to('.label-speakers', { opacity: 0, y: -30, scale: 0.9, duration: 3 }, 84);

    // Label 7: Reassembly
    labelsTl.to('.label-re-assembly', { opacity: 1, y: 0, scale: 1, duration: 3 }, 90);

    // Clean up
    return () => {
      anim.scrollTrigger.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [imagesLoaded]);

  return (
    <section 
      ref={containerRef} 
      id="teardown"
      style={{
        position: 'relative',
        height: '500vh', /* 500vh scroll height */
        background: '#040718',
        color: '#ffffff'
      }}
    >
      {/* Sticky Canvas Wrapper */}
      <div 
        className="disassembly-sticky-wrapper"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Floating Glowing Grid & Background Particles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, rgba(20, 45, 227, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>

        {/* Ambient Grid Lines (Apple Tech Vibe) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: 'center center',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>

        {/* Loading Spinner */}
        {!imagesLoaded && (
          <div style={{
            position: 'absolute',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            fontFamily: 'var(--font-poppins)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '4px solid rgba(20, 45, 227, 0.2)',
              borderTopColor: '#3b52ff',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '1px' }}>
              PRE-LOADING TELEMETRY DATA: {loadingProgress}%
            </span>
          </div>
        )}

        {/* The Teardown Canvas */}
        <canvas 
          ref={canvasRef}
          style={{
            position: 'relative',
            width: 'min(90vw, 80vh)',
            height: 'min(90vw, 80vh)',
            maxWidth: '900px',
            maxHeight: '900px',
            zIndex: 2,
            opacity: imagesLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            filter: 'drop-shadow(0 20px 50px rgba(20, 45, 227, 0.35))'
          }}
        />

        {/* Floating Spec Labels Overlay (Only one active at a time) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
          bgcolor: 'transparent',
        }}>
          
          {/* Label 1: Intro */}
          <div className="label-intro spec-card" style={{ top: '5%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <span className="spec-badge">EXPLORE HARDWARE</span>
            <h2 className="spec-title">Hardware Architecture</h2>
            <p className="spec-desc">
              <span className="desktop-text">Scroll down to disassemble the device piece-by-piece and explore certified repair standards.</span>
              <span className="mobile-text">Scroll down to disassemble the device and view our repair standards.</span>
            </p>
          </div>

          {/* Label 2: Back Cover */}
          <div className="label-back spec-card" style={{ top: '10%', left: '5%' }}>
            <span className="spec-badge">STEP 01 // BODY</span>
            <h2 className="spec-title">
              <span className="desktop-text">Premium Glass Back</span>
              <span className="mobile-text">Glass Back</span>
            </h2>
            <p className="spec-desc">
              <span className="desktop-text">Thermally fused shatter-resistant rear panel. We replace with exact OEM glass for perfect seal integrity.</span>
              <span className="mobile-text">Shatter-resistant OEM glass. Restores perfect seal integrity.</span>
            </p>
          </div>

          {/* Label 3: Battery */}
          <div className="label-battery spec-card" style={{ bottom: '20%', right: '10%' }}>
            <span className="spec-badge">STEP 02 // POWER</span>
            <h2 className="spec-title">
              <span className="desktop-text">Li-Ion Battery Cell</span>
              <span className="mobile-text">Battery Cell</span>
            </h2>
            <p className="spec-desc">
              <span className="desktop-text">High density 4323 mAh battery. Recalibrated on-board controller chip ensuring optimal charging speed & safety.</span>
              <span className="mobile-text">High density 4323 mAh cell. Recalibrated for safety.</span>
            </p>
          </div>

          {/* Label 4: Camera */}
          <div className="label-camera spec-card" style={{ top: '10%', right: '5%' }}>
            <span className="spec-badge">STEP 03 // OPTICS</span>
            <h2 className="spec-title">
              <span className="desktop-text">Pro Triple Camera</span>
              <span className="mobile-text">Pro Camera</span>
            </h2>
            <p className="spec-desc">
              <span className="desktop-text">Optical Image Stabilization (OIS) & laser autofocus sensor. Clean room environment calibration prevents dust spots.</span>
              <span className="mobile-text">Pro camera with OIS. Calibrated in dust-free room.</span>
            </p>
          </div>

          {/* Label 5: Motherboard */}
          <div className="label-cpu spec-card" style={{ top: '50%', left: '5%' }}>
            <span className="spec-badge">STEP 04 // COMPUTE</span>
            <h2 className="spec-title">
              <span className="desktop-text">A16 Logic Board</span>
              <span className="mobile-text">Logic Board</span>
            </h2>
            <p className="spec-desc">
              <span className="desktop-text">Micro-welded multilayer PCB. Diagnostic inspection tests 18 thermal contact pathways before final enclosure.</span>
              <span className="mobile-text">Micro-welded PCB. Tested for 18 thermal pathways.</span>
            </p>
          </div>

          {/* Label 6: Speakers / Audio */}
          <div className="label-speakers spec-card" style={{ bottom: '10%', left: '40%' }}>
            <span className="spec-badge">STEP 05 // ACOUSTICS</span>
            <h2 className="spec-title">
              <span className="desktop-text">Stereo Audio Engine</span>
              <span className="mobile-text">Audio Engine</span>
            </h2>
            <p className="spec-desc">
              <span className="desktop-text">Dustproof mesh membranes, active sub-woofers, and pressure-balanced vents. Re-certified for IP68 dust-ingress protection.</span>
              <span className="mobile-text">Stereo speakers. Re-certified for IP68 protection.</span>
            </p>
          </div>

          {/* Label 7: Complete Re-assembly */}
          <div className="label-re-assembly spec-card" style={{ bottom: '15%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <span className="spec-badge">STEP 06 // READY</span>
            <h2 className="spec-title">
              <span className="desktop-text">Certified Reassembly</span>
              <span className="mobile-text">Reassembly</span>
            </h2>
            <p className="spec-desc">
              <span className="desktop-text">All parts aligned, torque-calibrated screws driven, and liquid adhesive cure tested. Ready for delivery.</span>
              <span className="mobile-text">Torque-calibrated and liquid adhesive tested. Ready.</span>
            </p>
          </div>

        </div>

      </div>

      {/* Styled custom classes inside the section scope */}
      <style>{`
        .spec-card {
          position: absolute;
          max-width: 320px;
          // background: rgba(4, 7, 24, 0.7)
          // backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px 24px;
          text-align: left;
          opacity: 0;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          transition: border-color 0.3s ease;
        }
        .spec-badge {
          font-family: var(--font-poppins);
          font-size: 11px;
          font-weight: 700;
          color: #60a5fa;
          letter-spacing: 1.5px;
          display: block;
          margin-bottom: 8px;
        }
        .spec-title {
          font-size: 20px;
          color: #ffffff;
          margin-bottom: 10px;
          line-height: 1.2;
          font-weight: 700;
        }
        .spec-desc {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.5;
          margin: 0;
        }
        
        /* Desktop/Mobile text visibility toggle */
        .mobile-text {
          display: none;
        }
        .desktop-text {
          display: inline;
        }

        @media (max-width: 768px) {
          .mobile-text {
            display: inline;
          }
          .desktop-text {
            display: none;
          }

          .spec-card {
            position: absolute !important;
            left: 5% !important;
            right: 5% !important;
            width: 90% !important;
            max-width: none !important;
            bottom: 40px !important;
            top: auto !important;
            padding: 16px 20px !important;
            border-radius: 16px !important;
            background: rgba(4, 7, 24, 0.85) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1px solid rgba(59, 82, 255, 0.3) !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
            text-align: center !important;
          }
          
          /* Override specific offsets to force stack on bottom center */
          .label-intro,
          .label-back,
          .label-camera,
          .label-cpu,
          .label-battery,
          .label-speakers,
          .label-re-assembly {
            top: auto !important;
            bottom: 40px !important;
            left: 5% !important;
            right: 5% !important;
            text-align: center !important;
          }

          .spec-badge {
            font-size: 10px !important;
            margin-bottom: 6px !important;
            letter-spacing: 1.2px !important;
          }
          .spec-title {
            font-size: 16px !important;
            margin-bottom: 6px !important;
            font-weight: 700 !important;
          }
          .spec-desc {
            font-size: 12px !important;
            line-height: 1.4 !important;
          }
        }
      `}</style>
    </section>
  );
}
