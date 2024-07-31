'use client';

import React, { useEffect } from 'react';

const generateRandomKeyframes = (name: string) => {
  const randomPosition = () => `${Math.random() * 100}vw`;
  const randomOffset = () => `${Math.random() * 100}vh`;

  const startEndPosition = `${randomPosition()}, ${randomOffset()}`;
  const midPosition1 = `${randomPosition()}, ${randomOffset()}`;
  const midPosition2 = `${randomPosition()}, ${randomOffset()}`;
  const midPosition3 = `${randomPosition()}, ${randomOffset()}`;

  return `
    @keyframes ${name} {
      0% { transform: translate(${startEndPosition}); }
      25% { transform: translate(${midPosition1}); }
      50% { transform: translate(${midPosition2}); }
      75% { transform: translate(${midPosition3}); }
      100% { transform: translate(${startEndPosition}); }
    }
  `;
};

const Blob: React.FC<{
  className: string;
  animationName: string;
  duration: string;
  initialPosition: string;
}> = ({ className, animationName, duration, initialPosition }) => {
  return (
    <div
      className={`blob ${className}`}
      style={{
        animation: `${animationName} ${duration} infinite ease-in-out`,
        transform: `translate(${initialPosition})`,
      }}
    ></div>
  );
};

const Blobs: React.FC = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      ${generateRandomKeyframes('animateBlob1')}
      ${generateRandomKeyframes('animateBlob2')}
      ${generateRandomKeyframes('animateBlob3')}
      ${generateRandomKeyframes('animateBlob4')}
      ${generateRandomKeyframes('animateBlob5')}
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const randomPosition = () =>
    `${Math.random() * 100}vw, ${Math.random() * 100}vh`;

  return (
    <div className="absolute w-full border overflow-hidden -z-10">
      <Blob
        className="bg-[#FFA07A] w-[500px] h-[500px] blur-3xl scale-75 md:scale-100 mix-blend-multiply"
        animationName="animateBlob1"
        duration="12s"
        initialPosition={randomPosition()}
      />
      <Blob
        className="bg-[#98FB98] w-[500px] h-[500px] blur-3xl scale-75 md:scale-100 mix-blend-color"
        animationName="animateBlob2"
        duration="15s"
        initialPosition={randomPosition()}
      />
      <Blob
        className="bg-[#87CEFA] w-[500px] h-[500px] blur-3xl scale-75 md:scale-100 mix-blend-color"
        animationName="animateBlob3"
        duration="18s"
        initialPosition={randomPosition()}
      />
      <Blob
        className="bg-[#FFD700] w-[500px] h-[500px] blur-3xl scale-75 md:scale-100 mix-blend-color"
        animationName="animateBlob4"
        duration="21s"
        initialPosition={randomPosition()}
      />
      <Blob
        className="bg-[#BA55D3] w-[500px] h-[500px] blur-3xl scale-75 md:scale-100 mix-blend-color"
        animationName="animateBlob5"
        duration="24s"
        initialPosition={randomPosition()}
      />
      <Blob
        className="bg-[#40E0D0] w-[500px] h-[500px] blur-3xl scale-75 md:scale-100 mix-blend-color"
        animationName="animateBlob6"
        duration="27s"
        initialPosition={randomPosition()}
      />
      <Blob
        className="bg-[#FF6347] w-[500px] h-[500px] blur-3xl scale-75 md:scale-100 mix-blend-color"
        animationName="animateBlob7"
        duration="30s"
        initialPosition={randomPosition()}
      />
    </div>
  );
};

export default Blobs;
