import { useEffect, useRef, useState } from 'react';
import { 
  Wrench, 
  Zap, 
  ShieldCheck, 
  Smile
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS_DATA = [
  {
    title: 'Devices Repaired',
    value: '500+',
    numericVal: 5000,
    suffix: '+',
    icon: <Wrench size={24} />
  },
  // {
  //   title: 'Years Experience',
  //   value: '10+',
  //   numericVal: 10,
  //   suffix: '+',
  //   icon: <History size={24} />
  // },
  {
    title: 'Express Repairs',
    value: '24hr',
    numericVal: 24,
    suffix: 'hr',
    icon: <Zap size={24} />
  },
  {
    title: 'Genuine Spare Parts',
    value: '100%',
    numericVal: 100,
    suffix: '%',
    icon: <ShieldCheck size={24} />
  },
  {
    title: 'Customer Satisfaction',
    value: '98%',
    numericVal: 98,
    suffix: '%',
    icon: <Smile size={24} />
  },
  // {
  //   title: 'Expert Technicians',
  //   value: '15+',
  //   numericVal: 15,
  //   suffix: '+',
  //   icon: <Users size={24} />
  // }
];

function StatCard({ stat }) {
  const [currentVal, setCurrentVal] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const obj = { val: 0 };
    
    const trigger = gsap.to(obj, {
      val: stat.numericVal,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        setCurrentVal(Math.floor(obj.val));
      }
    });

    return () => {
      trigger.scrollTrigger?.kill();
    };
  }, [stat.numericVal]);

  return (
    <div 
      ref={cardRef}
      className="neumorphic-card stat-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '15px',
        padding: '30px'
      }}
    >
      {/* Icon frame */}
      <div style={{
        color: 'var(--accent)',
        background: 'var(--bg-main)',
        width: '54px',
        height: '54px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--neu-inset)'
      }}>
        {stat.icon}
      </div>

      {/* Numeric value */}
      <div 
        className="stat-value"
        style={{
          fontFamily: 'var(--font-poppins)',
          fontSize: '32px',
          fontWeight: 800,
          color: 'var(--text-main)',
          background: 'linear-gradient(135deg, var(--accent) 0%, #00d2ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2'
        }}
      >
        {currentVal}{stat.suffix}
      </div>

      {/* Label Title */}
      <span style={{
        fontFamily: 'var(--font-poppins)',
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--text-muted)'
      }}>
        {stat.title}
      </span>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="section" style={{ background: 'var(--bg-main)' }}>
      {/* Title */}
      <h2 className="section-title">Why Choose Smart Fix?</h2>
      <p className="section-subtitle">
        We strive for technical perfection and customer delight. Our stats represent years of dedication to our craft.
      </p>

      {/* Stats Grid */}
      <div 
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '30px',
          width: '100%'
        }}
      >
        {STATS_DATA.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
            padding: 10px 0 !important;
            width: 100% !important;
          }
          
          .stat-card {
            padding: 20px 10px !important;
            border-radius: 20px !important;
            gap: 10px !important;
          }

          .stat-card div:first-child {
            width: 44px !important;
            height: 44px !important;
            border-radius: 12px !important;
          }
          .stat-card div:first-child svg {
            width: 20px !important;
            height: 20px !important;
          }

          .stat-value {
            font-size: 24px !important;
          }

          .stat-card span {
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
