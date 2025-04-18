import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import QuizFlow from './components/QuizFlow';

export default function App() {
  const [userName, setUserName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <>
      {!hasStarted ? (
        <WelcomePage
          name={userName}
          setName={setUserName}
          onStart={() => setHasStarted(true)}
        />
      ) : (
        <QuizFlow userName={userName} />
      )}
    </>
  );
}
