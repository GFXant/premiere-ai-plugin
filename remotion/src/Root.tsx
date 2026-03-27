import React from 'react';
import {Composition} from 'remotion';
import {GeminiAd} from './GeminiAd';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GeminiAd"
      component={GeminiAd}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
