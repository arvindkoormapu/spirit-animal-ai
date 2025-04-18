import React from 'react';
import swirlBg from '../assets/backgrounds/swirl-bg.png';
import greenLeft from '../assets/backgrounds/green5.png';
import logoRight from '../assets/backgrounds/logo-right.png';

export default function FinalReveal({ animal, userName }) {
  if (!animal) return null;

  return (
    <div
      className="min-h-screen w-full h-dvh overflow-hidden bg-cover bg-center relative"
      style={{ backgroundImage: `url(${swirlBg})` }}
    >
      <img
        src={greenLeft}
        alt="decorative plant left"
        className="absolute bottom-[0px] left-[20px] w-[200px] z-10"
      />
      <img
        src={logoRight}
        alt="logo top right"
        className="absolute top-[0px] right-[20px] w-[300px] z-10"
      />

      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="bg-white/90 flex flex-col items-center justify-center px-10 py-12 mx-auto w-[90%] max-w-[1200px] rounded-[20px]">
          <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start w-full mb-6">
              <div className="flex-1 pr-4">
                <p className="font-avenir text-[22px] font-bold text-secondary">
                  Spirit Animal: <span className="italic font-normal">{capitalize(animal.name)}</span>{' '}
                  <span>({animal.traits.join(', ')})</span>
                </p>

                <p className="font-avenir text-[22px] font-bold mt-4 text-secondary">
                  Adaptation: <span className="italic font-normal">Arabic</span>
                </p>

                <p className="mt-4 font-avenir text-[22px] text-secondary">Your story:</p>
              </div>
              <div className="flex-shrink-0">
                <img
                  src={animal.image}
                  alt={animal.name}
                  className="w-[300px] mx-auto"
                />
              </div>
            </div>

            <h2 className="font-flapstick italic text-[30px] text-primary mb-6 text-center">
              Sara and the Mountain of Mirrors
            </h2>

            <p className="font-avenir text-[22px] text-secondary mb-4 px-2 md:px-4">
              In a warm land of golden sands and tall palm trees, Sara stood with her friend Hare at the base of Jabal al-Hikmah—the Mountain of Wisdom. "Race to the top!" Hare shouted, darting ahead impulsively. Sara followed slowly and carefully. Soon, Hare became exhausted beneath the hot sun, stopping halfway. Sara reached him, offering water kindly. "Slow steps and patience," she advised. Understanding his mistake, Hare nodded. Together, steadily, they climbed higher, encouraging each other. At the summit, Hare smiled warmly, realizing patience had helped them conquer the mountain.
            </p>

            <p className="font-avenir font-extrabold italic text-[22px] text-secondary px-2 md:px-4">
              Moral: Quick feet are good—but wise minds go farther.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6 mt-10 px-4">
              <button className="font-avenir bg-primary hover:bg-secondary transition text-white font-bold text-[18px] px-10 py-4 rounded-full w-full md:w-[350px]">
                Print my story
              </button>
              <button className="font-avenir bg-primary hover:bg-secondary transition text-white font-bold text-[18px] px-10 py-4 rounded-full w-full md:w-[350px]">
                Receive by email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
