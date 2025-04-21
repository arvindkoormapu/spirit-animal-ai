import React, { useState, useEffect, useMemo } from 'react';
import swirlBg from '../assets/backgrounds/swirl-bg.png';
import greenLeft from '../assets/backgrounds/green5.png';
import logoRight from '../assets/backgrounds/logo-right.png';
import FinalReveal from './FinalReveal';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function useQuizData(t) {
  return useMemo(() => [
    {
      type: 'question',
      id: 1,
      text: t('quiz.q0.text'),
      options: [
        { text: t('quiz.q0.a1'), character: 'boy' },
        { text: t('quiz.q0.a2'), character: 'girl' }
      ]
    },
    {
      type: 'question',
      id: 2,
      text: t('quiz.q1.text'),
      options: [
        { text: t('quiz.q1.a1'), animal: 'elephant' },
        { text: t('quiz.q1.a2'), animal: 'jackal' },
        { text: t('quiz.q1.a3'), animal: 'monkey' },
        { text: t('quiz.q1.a4'), animal: 'duck' }
      ]
    },
    {
      type: 'question',
      id: 3,
      text: t('quiz.q2.text'),
      options: [
        { text: t('quiz.q2.a1'), animal: 'lion' },
        { text: t('quiz.q2.a2'), animal: 'hare' },
        { text: t('quiz.q2.a3'), animal: 'ox' },
        { text: t('quiz.q2.a4'), animal: 'turtle' }
      ]
    },
    {
      type: 'question',
      id: 4,
      text: t('quiz.q3.text'),
      options: [
        { text: t('quiz.q3.a1'), animals: ['elephant', 'turtle'] },
        { text: t('quiz.q3.a2'), animals: ['jackal', 'hare'] },
        { text: t('quiz.q3.a3'), animals: ['duck', 'monkey'] },
        { text: t('quiz.q3.a4'), animals: ['ox', 'lion'] }
      ]
    },
    {
      type: 'loader',
      id: 'loader1',
      text: t('quiz.loader1'),
      duration: 3000
    },
    {
      type: 'question',
      id: 5,
      text: t('quiz.q4.text'),
      options: [
        { text: t('quiz.q4.a1'), theme: 'The story involves discovery, nature, or finding a secret path' },
        { text: t('quiz.q4.a2'), theme: 'The story involves a problem-solving quest, riddles, or puzzles' },
        { text: t('quiz.q4.a3'), theme: 'The story involves teamwork, empathy, or facing fear together' },
        { text: t('quiz.q4.a4'), theme: 'The story involves perseverance, self-belief, or overcoming a personal challenge' },
        { text: t('quiz.q4.a5'), theme: 'The story is whimsical, imaginative, and surreal' }
      ]
    },
    {
      type: 'question',
      id: 6,
      text: t('quiz.q5.text'),
      options: [
        { text: t('quiz.q5.a1'), adaptation: 'indian' },
        { text: t('quiz.q5.a2'), adaptation: 'arabic' },
        { text: t('quiz.q5.a3'), adaptation: 'persian' },
        { text: t('quiz.q5.a4'), adaptation: 'western' }
      ]
    }
  ], [t]);
}

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
    lion: { traits: ['brave', 'loyal', 'protector'], image: '/animals/lion.png' },
    jackal: { traits: ['clever', 'strategic', 'fast_thinker'], image: '/animals/jackal2.png' },
    elephant: { traits: ['wise', 'calm', 'strong_hearted'], image: '/animals/elephant.png' },
    duck: { traits: ['kind', 'peace_maker', 'gentle'], image: '/animals/duck2.png' },
    turtle: { traits: ['patient', 'reflective', 'peaceful'], image: '/animals/turtle.png' },
    hare: { traits: ['fast', 'fun', 'impulsive'], image: '/animals/rabbit.png' },
    ox: { traits: ['steady', 'hardworking', 'dependable'], image: '/animals/ox.png' },
    monkey: { traits: ['playful', 'creative', 'witty'], image: '/animals/monkey.png' }
  };

  return {
    name: randomWinner,
    ...spiritAnimalMap[randomWinner]
  };
}

function generateStoryPrompt({ name, character, animal, theme, adaptation, language }) {
  return `
  Write a moral story for a child named ${name}.
  The main character is a ${character.toLowerCase()} named ${name}.
  Their spirit animal is a ${capitalize(animal.name)} (${animal.traits.join(', ')}).
  The story should follow a ${adaptation} cultural style and center around the chosen adventure: ${theme}.

  Do not name the animal as ${name}, and do not refer to the animal with the child’s name.
  The animal can be present as a guide, friend, or inspiration.

  ${language.toLowerCase().includes('Formal Emrati Arabic')
      ? 'When referring to the spirit animal in Emrati Arabic, always use the phrase "الحيوان الرمزي".'
      : ''
    }

  The story, including title, body, and moral, must be in ${language}.
  The title must include the child’s name (${name}).

  Please return ONLY valid JSON using this format:
  {
    "title": "Title of the story in ${language} (must include ${name})",
    "story": "A story of 150 words written in ${language}.",
    "moral": "A 1-line moral in ${language}"
  }

  Do not include any explanations, markdown, or extra formatting.
  Return only a valid JSON object as plain text.
  Make sure the story is at least 150 words long. Do not stop early.
  `.trim();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function generateStory({ name, character, animal, theme, adaptation, language }) {

  const prompt = generateStoryPrompt({ name, character, animal, theme, adaptation, language });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 800,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const json = JSON.parse(content);
    return json;
  } catch (error) {
    console.error('OpenAI API Error:', error.response || error);
    return null;
  }
}

export default function QuizFlow({ userName }) {
  const { t, i18n } = useTranslation();
  const quizData = useQuizData(t);

  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalAnimal, setFinalAnimal] = useState(null);
  const [storyReady, setStoryReady] = useState(false);
  const [storyData, setStoryData] = useState(null);

  const currentQuestion = quizData[currentIndex];

  const handleAnswerClick = (option) => {
    setAnswers([...answers, { question: currentQuestion.text, answer: option }]);
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
      const theme = answers.find(a => a.answer.theme)?.answer.theme;
      const character = answers.find(a => a.answer.character)?.answer.character;
      const adaptation = answers.find(a => a.answer.adaptation)?.answer.adaptation;

      setIsGenerating(true);

      const language = i18n.language === 'ar' ? 'Formal Emrati Arabic' : 'English';

      generateStory({ name: userName, character, animal: result, theme, adaptation, language }).then((storyResponse) => {
        setFinalAnimal(result);
        setStoryData(storyResponse);
        setStoryReady(true);
        setIsGenerating(false);
      });
    }
  }, [currentQuestion]);

  if (isGenerating || (!storyReady && finalAnimal)) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center text-center px-6"
        style={{ backgroundImage: `url(${swirlBg})` }}
      >
        <img src={greenLeft} alt="decorative plant left" className="absolute bottom-[0px] left-[20px] w-[200px] z-10" />
        <img src={logoRight} alt="logo top right" className="absolute top-[0px] right-[20px] w-[300px] z-10" />
        <div className="text-[50px] font-avenir text-secondary animate-zoom-grow max-w-xl">
          {t('quiz.loader2')}
        </div>
      </div>
    );
  }

  if (finalAnimal && storyReady && storyData) {
    const adaptation = answers.find(a => a.answer.adaptation)?.answer.adaptation;
    return <FinalReveal animal={finalAnimal} adaptation={adaptation} title={storyData.title} story={storyData.story} moral={storyData.moral} />;
  }

  if (!currentQuestion) return null;

  if (currentQuestion.type === 'loader') {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center text-center px-6"
        style={{ backgroundImage: `url(${swirlBg})` }}
      >
        <img src={greenLeft} alt="decorative plant left" className="absolute bottom-[0px] left-[20px] w-[200px] z-10" />
        <img src={logoRight} alt="logo top right" className="absolute top-[0px] right-[20px] w-[300px] z-10" />
        <div className="text-[50px] font-avenir text-secondary animate-zoom-grow max-w-xl">
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
      <img src={greenLeft} alt="decorative plant left" className="absolute bottom-[0px] left-[20px] w-[200px] z-10" />
      <img src={logoRight} alt="logo top right" className="absolute top-[0px] right-[20px] w-[300px] z-10" />

      <div className="absolute top-[162px] right-[210px] z-50 bg-white rounded-full flex overflow-hidden border border-primary text-sm font-bold">
        <button
          onClick={() => i18n.changeLanguage('en')}
          className={`font-avenir px-4 py-2 ${i18n.language === 'en' ? 'bg-primary text-white' : 'text-primary'}`}
        >
          EN
        </button>
        <button
          onClick={() => i18n.changeLanguage('ar')}
          className={`font-avenir px-4 py-2 ${i18n.language === 'ar' ? 'bg-primary text-white' : 'text-primary'}`}
        >
          عربى
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="bg-white/100 flex flex-col items-center justify-center h-[80vh] min-h-80 px-6 mx-auto w-[90%] max-w-[1200px] rounded-[20px] py-12">
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