"use client";

import { useTheme } from "./theme-provider";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export function LandingHero({ onGetStarted }: LandingHeroProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const c = isDark
    ? {
        bg: "#0d0d0d",
        text: "#f0f0f0",
        subtitle: "#888",
        caption: "#444",
        trunk: "#e8e8e8",
        samurai: "#e8e8e8",
        samuraiScabbard: "#b0b0b0",
        flowerCenter: "#f5789a",
      }
    : {
        bg: "#fcfcfc",
        text: "#000",
        subtitle: "#555",
        caption: "#aaa",
        trunk: "#0c0c0c",
        samurai: "#0c0c0c",
        samuraiScabbard: "#1f1f1f",
        flowerCenter: "#000",
      };

  return (
    <>
      <style>{`
        @keyframes sl-fall {
          0%   { top: -10%; opacity: 0; }
          10%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
        @keyframes sl-sway {
          0%   { transform: scale(var(--ps, 1)) translateX(-25px) rotate(0deg); }
          100% { transform: scale(var(--ps, 1)) translateX(25px) rotate(100deg); }
        }
        .sl-leaf { position: absolute; top: -10%; animation: sl-fall linear infinite; }
        .sl-petal {
          width: 14px; height: 14px;
          border-radius: 15px 0 15px 0;
          background: #f5789a;
          --ps: 1;
          animation: sl-sway 3s ease-in-out infinite alternate;
        }
        .sl-leaf:nth-child(1)  { left: 10%; animation-duration: 11s; animation-delay: -2s;  }
        .sl-leaf:nth-child(2)  { left: 20%; animation-duration: 14s; animation-delay: -5s;  }
        .sl-leaf:nth-child(3)  { left: 30%; animation-duration: 10s; animation-delay: -7s;  }
        .sl-leaf:nth-child(4)  { left: 40%; animation-duration: 13s; animation-delay: -1s;  }
        .sl-leaf:nth-child(5)  { left: 50%; animation-duration: 12s; animation-delay: -4s;  }
        .sl-leaf:nth-child(6)  { left: 60%; animation-duration: 15s; animation-delay: -8s;  }
        .sl-leaf:nth-child(7)  { left: 70%; animation-duration: 11s; animation-delay: -3s;  }
        .sl-leaf:nth-child(8)  { left: 80%; animation-duration: 14s; animation-delay: -6s;  }
        .sl-leaf:nth-child(9)  { left: 90%; animation-duration: 12s; animation-delay: -2s;  }
        .sl-leaf:nth-child(10) { left: 85%; animation-duration: 10s; animation-delay: -9s;  }
        .sl-leaf:nth-child(11) { left: 15%; animation-duration: 16s; animation-delay: -1s;  }
        .sl-leaf:nth-child(12) { left: 35%; animation-duration: 12s; animation-delay: -5s;  }
        .sl-leaf:nth-child(13) { left: 55%; animation-duration: 14s; animation-delay: -7s;  }
        .sl-leaf:nth-child(14) { left: 75%; animation-duration: 11s; animation-delay: -4s;  }
        .sl-leaf:nth-child(15) { left: 95%; animation-duration: 13s; animation-delay: -6s;  }
        .sl-leaf:nth-child(even) .sl-petal { --ps: 0.7; opacity: 0.8; animation-duration: 4s; animation-direction: alternate-reverse; }
        .sl-leaf:nth-child(3n)   .sl-petal { --ps: 1.1; animation-duration: 3.5s; }
        .sl-cta {
          background-color: #f5789a;
          color: white;
          padding: 16px 45px;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: background 0.3s, transform 0.2s;
          font-family: inherit;
        }
        .sl-cta:hover { background-color: #e06283; transform: translateY(-2px); }
      `}</style>

      {/* Full-screen container */}
      <div style={{
        backgroundColor: c.bg,
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        color: c.text,
        fontFamily: "'Inter', 'Geist', sans-serif",
      }}>

        {/* Left-aligned hero text */}
        <main style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center",
          paddingLeft: "10%",
          zIndex: 10,
          pointerEvents: "none",
        }}>
          <div style={{ maxWidth: 500, pointerEvents: "auto" }}>
            <h1 style={{
              fontWeight: 300,
              fontSize: "clamp(3rem, 6vw, 4.5rem)",
              letterSpacing: "-2px",
              marginBottom: 20,
              lineHeight: 1.1,
              color: c.text,
            }}>
              Samur<span style={{ color: "#f5789a" }}>.ai</span>
            </h1>
            <p style={{
              fontWeight: 400,
              fontSize: "1.15rem",
              color: c.subtitle,
              marginBottom: 40,
              lineHeight: 1.6,
            }}>
              Turn your syllabus into calendar events in seconds.<br />
              Cut through the clutter.
            </p>
            <button className="sl-cta" onClick={onGetStarted}>
              Get Started
            </button>
            <p style={{ marginTop: 24, fontSize: "0.85rem", color: c.caption }}>
              Make time for what matters.
            </p>
          </div>
        </main>

        {/* Falling cherry blossom petals */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: 5, pointerEvents: "none",
        }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="sl-leaf">
              <div className="sl-petal" />
            </div>
          ))}
        </div>

        {/* Cherry blossom tree — pinned bottom-right */}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: "60%", height: "100vh",
          zIndex: 1, pointerEvents: "none",
        }}>
          <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMaxYMax slice"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <g id="sl-flower">
                <circle cx="0" cy="-14" r="11" fill="#f5789a" />
                <circle cx="-13" cy="-4" r="11" fill="#f5789a" />
                <circle cx="13" cy="-4" r="11" fill="#f5789a" />
                <circle cx="-8" cy="12" r="11" fill="#f5789a" />
                <circle cx="8" cy="12" r="11" fill="#f5789a" />
                <circle cx="0" cy="0" r="4" fill={c.flowerCenter} />
              </g>
              <g id="sl-flower-plain">
                <circle cx="0" cy="-14" r="11" fill="#f5789a" />
                <circle cx="-13" cy="-4" r="11" fill="#f5789a" />
                <circle cx="13" cy="-4" r="11" fill="#f5789a" />
                <circle cx="-8" cy="12" r="11" fill="#f5789a" />
                <circle cx="8" cy="12" r="11" fill="#f5789a" />
              </g>
              <path id="sl-spetal" d="M0,0 C-8,-8 -8,-16 0,-20 C8,-16 8,-8 0,0" fill="#f5789a" />
            </defs>

            {/* Ink-brush trunk and branches */}
            <g fill={c.trunk}>
              <path d="M650,1000 L600,850 L610,800 L560,650 L580,620 L500,500 L520,490 L590,600 L650,780 L680,1000 Z" />
              <path d="M570,640 L500,580 L420,590 L350,500 L370,490 L450,560 L520,550 L585,610 Z" />
              <path d="M430,570 L380,450 L310,400 L320,380 L390,440 L450,550 Z" />
              <path d="M350,500 L280,480 L220,400 L230,380 L300,460 L360,480 Z" />
              <path d="M390,440 L350,350 L370,360 L400,430 Z" />
              <path d="M310,400 L250,320 L270,330 L320,390 Z" />
              <path d="M610,800 L700,720 L750,600 L820,480 L800,470 L730,590 L680,700 L595,760 Z" />
              <path d="M740,600 L820,550 L880,450 L860,440 L800,530 L720,580 Z" />
              <path d="M700,720 L780,680 L840,650 L830,630 L760,660 Z" />
              <path d="M820,550 L880,580 L870,590 L810,560 Z" />
              <path d="M880,450 L950,400 L940,390 L875,440 Z" />
              <path d="M500,500 L450,400 L460,300 L480,310 L470,410 L515,490 Z" />
              <path d="M460,300 L420,220 L440,230 L470,310 Z" />
              <path d="M450,400 L520,320 L510,310 L445,390 Z" />
              <path d="M520,320 L560,250 L580,260 L530,330 Z" />
            </g>

            {/* Left branch flowers */}
            <use href="#sl-flower"       transform="translate(220, 400) scale(1.1) rotate(20)"  />
            <use href="#sl-flower-plain" transform="translate(280, 480) scale(0.9) rotate(-15)" />
            <use href="#sl-flower"       transform="translate(350, 350) scale(1.3) rotate(45)"  />
            <use href="#sl-flower-plain" transform="translate(310, 400) scale(0.8)"             />
            <use href="#sl-flower"       transform="translate(250, 320) scale(1)   rotate(-30)" />
            <use href="#sl-spetal"       transform="translate(180, 380) scale(1.2) rotate(60)"  />
            <use href="#sl-spetal"       transform="translate(200, 440) scale(0.9) rotate(110)" />

            {/* Center & top flowers */}
            <use href="#sl-flower"       transform="translate(420, 220) scale(1.4) rotate(10)"  />
            <use href="#sl-flower-plain" transform="translate(470, 310) scale(1.1) rotate(80)"  />
            <use href="#sl-flower"       transform="translate(560, 250) scale(1.2) rotate(-20)" />
            <use href="#sl-flower-plain" transform="translate(520, 320) scale(0.9)"             />
            <use href="#sl-flower"       transform="translate(450, 400) scale(1.3) rotate(35)"  />
            <use href="#sl-spetal"       transform="translate(380, 250) scale(1.3) rotate(-45)" />
            <use href="#sl-spetal"       transform="translate(500, 200) scale(1.1) rotate(15)"  />

            {/* Right branch flowers */}
            <use href="#sl-flower"       transform="translate(750, 600) scale(1.2) rotate(-10)" />
            <use href="#sl-flower-plain" transform="translate(820, 550) scale(1.3) rotate(40)"  />
            <use href="#sl-flower"       transform="translate(880, 450) scale(1.1) rotate(25)"  />
            <use href="#sl-flower-plain" transform="translate(840, 650) scale(0.8) rotate(-50)" />
            <use href="#sl-flower"       transform="translate(950, 400) scale(1.2) rotate(15)"  />
            <use href="#sl-flower-plain" transform="translate(880, 580) scale(1)"               />
            <use href="#sl-spetal"       transform="translate(920, 500) scale(1.2) rotate(80)"  />
            <use href="#sl-spetal"       transform="translate(790, 680) scale(0.9) rotate(30)"  />

            {/* Mid trunk / scattered */}
            <use href="#sl-flower-plain" transform="translate(580, 620) scale(0.8) rotate(10)"  />
            <use href="#sl-spetal"       transform="translate(680, 500) scale(1.5) rotate(-20)" />
            <use href="#sl-spetal"       transform="translate(450, 620) scale(1.1) rotate(45)"  />

            {/* Samurai silhouette — ink-brush style, standing left of trunk */}
            <g fill={c.samurai} transform="translate(478, 1000)">
              {/* Sandals */}
              <rect x="-16" y="-11" width="13" height="11" rx="2" />
              <rect x="3"   y="-11" width="13" height="11" rx="2" />
              {/* Hakama — wide flared pants */}
              <path d="M-16,-11 L-23,-70 L0,-70 Z" />
              <path d="M16,-11 L23,-70 L0,-70 Z" />
              {/* Do — chest armor */}
              <rect x="-19" y="-136" width="38" height="68" rx="3" />
              {/* Left osode — shoulder guard */}
              <path d="M-19,-132 L-40,-120 L-38,-100 L-19,-112 Z" />
              {/* Right osode — shoulder guard */}
              <path d="M19,-132 L40,-120 L38,-100 L19,-112 Z" />
              {/* Left kote — forearm */}
              <rect x="-42" y="-120" width="13" height="50" rx="5" />
              {/* Right kote — raised to hold katana */}
              <path d="M27,-120 L32,-76 L41,-79 L36,-120 Z" />
              {/* Neck */}
              <rect x="-5" y="-150" width="10" height="16" />
              {/* Head */}
              <ellipse cx="0" cy="-166" rx="17" ry="19" />
              {/* Kabuto — helmet dome */}
              <path d="M-17,-164 C-23,-202 23,-202 17,-164 Z" />
              {/* Shikoro — neck guard flares */}
              <path d="M-17,-168 L-30,-153 L-25,-144 L-14,-161 Z" />
              <path d="M17,-168 L30,-153 L25,-144 L14,-161 Z" />
              {/* Maedate — crescent moon crest */}
              <path d="M-2,-202 C-10,-220 2,-230 8,-218 C2,-215 -3,-207 -2,-202 Z" />
              {/* Katana blade */}
              <path d="M39,-80 L80,-218 L83,-216 L42,-78 Z" />
              {/* Tsuba — hand guard */}
              <ellipse cx="40" cy="-79" rx="7" ry="4.5" transform="rotate(-65 40 -79)" />
              {/* Saya — scabbard at left hip */}
              <path d="M-22,-105 L-50,-58 L-46,-55 L-18,-102 Z" fill={c.samuraiScabbard} />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
