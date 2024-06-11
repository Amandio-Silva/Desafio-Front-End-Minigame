import React, { useState, useEffect } from 'react';
import SequenceDisplay from './components/SequenceDisplay';
import Timer from './components/Timer';
import Feedback from './components/Feedback';
import Button from './components/Button';
import Ranking from './components/Ranking';
import './styles.css';
import { motion } from 'framer-motion';  // Certifique-se de que framer-motion está instalado

const generateRandomSequence = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let sequence = '';
  for (let i = 0; i < length; i++) {
    sequence += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sequence;
};

const App = () => {
  const [sequence, setSequence] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [nick, setNick] = useState('');
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const storedRanking = JSON.parse(localStorage.getItem('ranking')) || [];
    setRanking(storedRanking);
  }, []);

  useEffect(() => {
    if (isStarted) {
      const newSequence = generateRandomSequence(5);
      setSequence(newSequence);
      setCurrentIndex(0);
      setTimeLeft(30);
      setIsGameOver(false);
      setFeedback('');
      console.log(newSequence); // Para debug, remove depois de testar
    }
  }, [isStarted]);

  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isGameOver) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      setFeedback('Tempo esgotado!');
    }
  }, [timeLeft, isStarted, isGameOver]);

  const handleKeyPress = (event) => {
    if (isGameOver || !isStarted) return;

    const key = event.key.toUpperCase();
    if (key === sequence[currentIndex]) {
      setCurrentIndex(currentIndex + 1);
      setFeedback('Correto!');
      if (currentIndex + 1 === sequence.length) {
        setIsGameOver(true);
        setFeedback('Você venceu!');
        updateRanking(nick, timeLeft);
      }
    } else {
      setIsGameOver(true);
      setFeedback('Errado! Jogo terminado.');
    }
  };

  useEffect(() => {
    if (isStarted && !isGameOver) {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [currentIndex, isStarted, isGameOver]);

  const updateRanking = (nick, score) => {
    const newRanking = [...ranking, { nick, score }];
    newRanking.sort((a, b) => a.score - b.score);  // Ordena pelo menor tempo primeiro
    if (newRanking.length > 10) newRanking.pop();
    setRanking(newRanking);
    localStorage.setItem('ranking', JSON.stringify(newRanking));
  };

  const resetGame = () => {
    const newSequence = generateRandomSequence(5);
    setSequence(newSequence);
    setCurrentIndex(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setFeedback('');
    console.log(newSequence); // Para debug, remove depois de testar
  };

  return (
    <div className="App">
      {!isStarted ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="start-screen">
          <h1>MINI-GAME</h1>
          <input 
            type="text" 
            placeholder="Digite seu nick" 
            value={nick}
            onChange={(e) => setNick(e.target.value)} 
          />
          <Button onClick={() => setIsStarted(true)}>Iniciar</Button>
        </motion.div>
      ) : (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="game-screen">
          <h2>Pressione as teclas na sequência:</h2>
          <SequenceDisplay sequence={sequence} currentIndex={currentIndex} />
          <Timer timeLeft={timeLeft} />
          <Feedback feedback={feedback} />
          {isGameOver && <Button onClick={resetGame}>Reiniciar</Button>}
        </motion.div>
      )}
      <Ranking ranking={ranking} />
    </div>
  );
};

export default App;
