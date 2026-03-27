import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const bgGradient =
  'radial-gradient(circle at 20% 20%, #6e9bff 0%, #22245e 45%, #100a2d 100%)';

const sceneTransition = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

const iconGlyphs = ['📄', '</>', '🎨', '🧠', '🧩', '✦', '📊', '⚙️'];

const FloatingIcons: React.FC<{frame: number}> = ({frame}) => {
  const appear = spring({frame, fps: 30, config: {damping: 15}});

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
      }}
    >
      {iconGlyphs.map((icon, i) => {
        const messyX = [280, 460, 620, 980, 1180, 1380, 1540, 780][i];
        const messyY = [300, 590, 210, 650, 430, 280, 560, 430][i];
        const gridX = 640 + (i % 4) * 170;
        const gridY = 280 + Math.floor(i / 4) * 170;

        const x = interpolate(appear, [0, 1], [messyX, gridX]);
        const y = interpolate(appear, [0, 1], [messyY, gridY]);

        return (
          <div
            key={icon}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 112,
              height: 112,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff',
              fontSize: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(120,157,255,0.4)',
              backdropFilter: 'blur(6px)',
              transform: `rotate(${interpolate(appear, [0, 1], [22 - i * 5, 0])}deg)`,
            }}
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
};

const GeminiBurst: React.FC<{frame: number}> = ({frame}) => {
  const pulse = 1 + Math.sin(frame / 5) * 0.05;

  return (
    <div
      style={{
        width: 360,
        height: 360,
        borderRadius: '50%',
        background:
          'conic-gradient(from 0deg, #7bc2ff, #756bff, #8f5cff, #9be7ff, #7bc2ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${pulse})`,
        boxShadow: '0 0 80px rgba(146,176,255,0.9), 0 0 180px rgba(117,107,255,0.5)',
      }}
    >
      <div
        style={{
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: '#11153f',
          display: 'grid',
          placeItems: 'center',
          color: '#f0f8ff',
          fontSize: 104,
          fontWeight: 700,
          textShadow: '0 0 30px rgba(255,255,255,0.45)',
        }}
      >
        ✦
      </div>
    </div>
  );
};

const SplitActionCards: React.FC<{frame: number}> = ({frame}) => {
  const cardW = 500;
  const cardH = 280;
  const reveal = spring({frame: frame - 180, fps: 30, config: {damping: 14}});

  const cards = [
    {
      title: 'Email Draft',
      text: 'Subject: Launch Plan\nHi team, here is a polished launch draft...',
      accent: '#8cc9ff',
    },
    {
      title: 'Code Output',
      text: 'function optimizePrompt(input) {\n  return input.trim();\n}',
      accent: '#8d7eff',
    },
    {
      title: 'Image Concept',
      text: 'Generating: neon city + cinematic dusk lighting...',
      accent: '#b38aff',
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: 150,
        right: 150,
        top: 220,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {cards.map((card, i) => (
        <div
          key={card.title}
          style={{
            width: cardW,
            height: cardH,
            borderRadius: 28,
            padding: 28,
            background: 'rgba(255,255,255,0.08)',
            border: `1px solid ${card.accent}`,
            boxShadow: `0 0 36px ${card.accent}55`,
            opacity: interpolate(reveal, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(reveal, [0, 1], [80 - i * 20, 0])}px)`,
            color: '#fff',
          }}
        >
          <div style={{fontSize: 32, fontWeight: 700, marginBottom: 16}}>{card.title}</div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              opacity: 0.85,
              whiteSpace: 'pre-line',
            }}
          >
            {card.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export const GeminiAd: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const s1 = sceneTransition(frame, 0, 80);
  const s2 = sceneTransition(frame, 90, 150);
  const s3 = sceneTransition(frame, 180, 240);

  const smfScale = interpolate(s1, [0, 1], [0.6, 1]);
  const smfOpacity = interpolate(frame, [10, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoZoom = interpolate(s2, [0, 1], [1.4, 1]);
  const scene2Opacity = interpolate(frame, [84, 96], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const outroText = ['Write.', 'Code.', 'Create.', 'Try Gemini Today!'];
  const outroIndex = Math.min(
    outroText.length - 1,
    Math.floor(Math.max(0, frame - 190) / (fps * 0.5)),
  );

  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        fontFamily: 'Inter, Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [0, 6], [0, 1]),
          background:
            'radial-gradient(circle at 80% 30%, rgba(168,150,255,0.35), transparent 50%)',
        }}
      />

      {frame < 95 && <FloatingIcons frame={frame} />}

      <div
        style={{
          position: 'absolute',
          bottom: 110,
          width: '100%',
          textAlign: 'center',
          fontSize: 98,
          letterSpacing: 1,
          fontWeight: 900,
          color: '#ffffff',
          opacity: smfOpacity * (frame < 95 ? 1 : 0),
          transform: `scale(${smfScale})`,
          textShadow: '0 0 32px rgba(183,200,255,0.8)',
        }}
      >
        Smarter. Faster. Better.
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          opacity: scene2Opacity,
          transform: `scale(${logoZoom})`,
        }}
      >
        <div style={{display: 'grid', placeItems: 'center', marginTop: -120}}>
          <GeminiBurst frame={frame} />
          <div
            style={{
              marginTop: 52,
              fontSize: 64,
              fontWeight: 800,
              color: '#fff',
              textShadow: '0 0 24px rgba(169,180,255,0.65)',
            }}
          >
            Google Gemini. The Ultimate AI.
          </div>
        </div>
      </div>

      {frame >= 180 && <SplitActionCards frame={frame} />}

      <div
        style={{
          position: 'absolute',
          bottom: 180,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1260,
          height: 108,
          borderRadius: 55,
          border: '1px solid rgba(255,255,255,0.5)',
          background: 'rgba(16,22,64,0.62)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 44,
          color: '#dce8ff',
          fontSize: 38,
          opacity: interpolate(frame, [220, 258], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          boxShadow: '0 0 40px rgba(144,175,255,0.35)',
        }}
      >
        Try Gemini today...
      </div>

      <div
        style={{
          position: 'absolute',
          top: 68,
          width: '100%',
          textAlign: 'center',
          fontSize: 88,
          fontWeight: 900,
          color: '#fff',
          letterSpacing: 0.4,
          opacity: s3,
          textShadow: '0 0 24px rgba(168,175,255,0.7)',
        }}
      >
        {outroText[outroIndex]}
      </div>
    </AbsoluteFill>
  );
};
