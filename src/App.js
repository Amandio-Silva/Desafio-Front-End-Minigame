import React, { useState, useEffect } from 'react';
import SequenceDisplay from './components/SequenceDisplay';
import Feedback from './components/Feedback';
import Button from './components/Button';
import Ranking from './components/Ranking';
import ProgressBar from './components/ProgressBar'; 
import Modal from './components/Modal';
import './styles.css';
import { motion } from 'framer-motion';

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
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      setIsModalVisible(false);
      console.log("Generated sequence:", newSequence); // Para debug
    }
  }, [isStarted]);

  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isGameOver) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      setFeedback('Tempo esgotado!');
      setModalMessage('Tente novamente!');
      setIsModalVisible(true);
    }
  }, [timeLeft, isStarted, isGameOver]);

  const handleKeyPress = (event) => {
    if (isGameOver || !isStarted) return;

    const key = event.key.toUpperCase();
    console.log("Key pressed:", key); // Para debug
    console.log("Expected key:", sequence[currentIndex]); // Para debug

    if (key === sequence[currentIndex]) {
      setCurrentIndex(currentIndex + 1);
      setFeedback('Correto!');
      if (currentIndex + 1 === sequence.length) {
        setIsGameOver(true);
        setFeedback('Você venceu!');
        updateRanking(nick, timeLeft);
        setModalMessage('Você venceu!');
        setIsModalVisible(true);
      }
    } else {
      setIsGameOver(true);
      setFeedback('Errado! Jogo terminado.');
      setModalMessage('Tente novamente!');
      setIsModalVisible(true);
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
    setIsModalVisible(false);
    console.log("Generated sequence:", newSequence); // Para debug
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
          <ProgressBar timeLeft={timeLeft} totalTime={30} />  {/* Adiciona a barra de progresso */}
          <Feedback feedback={feedback} />
          {isGameOver && <Button onClick={resetGame}>Reiniciar</Button>}
        </motion.div>
      )}
      <Ranking ranking={ranking} />
      {isModalVisible && <Modal message={modalMessage} onClose={() => setIsModalVisible(false)} />}
    </div>
  );
};

export default App;
