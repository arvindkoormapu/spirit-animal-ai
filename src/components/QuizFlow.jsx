import React, { useState, useEffect } from 'react';
import quizData from './quizData.json';
import swirlBg from '../assets/backgrounds/swirl-bg.png';
import greenLeft from '../assets/backgrounds/green5.png';
import logoRight from '../assets/backgrounds/logo-right.png';
import FinalReveal from './FinalReveal';

function getFinalAnimal(answers) {
  const countMap = {};

  answers.forEach(({ answer }) => {
    if (answer.animal) {
      countMap[answer.animal] = (countMap[answer.animal] || 0) + 1;
    } else if (answer.animals) {
      answer.animals.forEach((animal) => {
        countMap[animal] = (countMap[animal] || 0) + 1;
      });
    }
  });

  const maxCount = Math.max(...Object.values(countMap));

  const topAnimals = Object.entries(countMap).filter(([_, count]) => count === maxCount);

  const randomWinner = topAnimals[Math.floor(Math.random() * topAnimals.length)][0];

  const spiritAnimalMap = {
    lion: {
      traits: ['Brave', 'Loyal', 'Protector'],
      image: '/animals/lion.png'
    },
    jackal: {
      traits: ['Clever', 'Strategic', 'Fast-thinker'],
      image: '/animals/jackal2.png'
    },
    elephant: {
      traits: ['Wise', 'Calm', 'Strong-hearted'],
      image: '/animals/elephant.png'
    },
    duck: {
      traits: ['Kind', 'Peace-maker', 'Gentle'],
      image: '/animals/duck2.png'
    },
    turtle: {
      traits: ['Patient', 'Reflective', 'Peaceful'],
      image: '/animals/turtle.png'
    },
    hare: {
      traits: ['Fast', 'Fun', 'Impulsive'],
      image: '/animals/rabbit.png'
    },
    ox: {
      traits: ['Steady', 'Hardworking', 'Dependable'],
      image: '/animals/ox.png'
    },
    monkey: {
      traits: ['Playful', 'Creative', 'Witty'],
      image: '/animals/monkey.png'
    },
  };

  return {
    name: randomWinner,
    ...spiritAnimalMap[randomWinner]
  };
}

export default function QuizFlow({ userName }) {
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalAnimal, setFinalAnimal] = useState(null);
  const [storyReady, setStoryReady] = useState(false);

  const currentQuestion = quizData[currentIndex];

  const handleAnswerClick = (option) => {
    if (currentQuestion.type === 'question') {
      setAnswers([...answers, { question: currentQuestion.text, answer: option }]);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentQuestion?.type === 'loader') {
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, currentQuestion.duration || 2000);
      return () => clearTimeout(timeout);
    }

    if (!currentQuestion && !finalAnimal) {
      const result = getFinalAnimal(answers);
      setIsGenerating(true);

      setTimeout(() => {
        setFinalAnimal(result);
        setTimeout(() => {
          setStoryReady(true);
          setIsGenerating(false);
        }, 2000);
      }, 1500);
    }
  }, [currentQuestion]);

  if (isGenerating || (!storyReady && finalAnimal)) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center text-center px-6"
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
        <div className="text-[32px] font-avenir text-secondary animate-pulse max-w-xl">
          Let’s reveal your spirit animal and go on an AI-generated adventure made just for you!
        </div>
      </div>
    );
  }

  if (finalAnimal && storyReady) {
    return <FinalReveal animal={finalAnimal} userName={userName} />;
  }

  if (!currentQuestion) return null;

  if (currentQuestion.type === 'loader') {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center text-center px-6"
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
        <div className="text-[32px] font-avenir text-secondary animate-pulse max-w-xl">
          {currentQuestion.text}
        </div>
      </div>
    );
  }

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
        <div className="bg-white/90 flex flex-col items-center justify-center h-[80vh] min-h-80 px-6 mx-auto w-[90%] max-w-[1200px] rounded-[20px] py-12">
          <h2 className="font-flapstick text-secondary text-[32px] md:text-4xl text-center mb-10">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
            {currentQuestion.options.slice(0, 4).map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerClick(option)}
                className="bg-primary text-white text-center px-6 py-5 rounded-[30px] w-80 text-[22px] font-avenir hover:bg-secondary transition"
              >
                {option.text}
              </button>
            ))}

            {currentQuestion.options.length === 5 && (
              <button
                onClick={() => handleAnswerClick(currentQuestion.options[4])}
                className="col-span-2 bg-primary text-white text-center px-6 py-5 rounded-[30px] w-80 text-[22px] font-avenir hover:bg-secondary transition"
              >
                {currentQuestion.options[4].text}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
