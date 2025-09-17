'use client';

import { useState, useEffect, useCallback } from 'react';
import { Constant, Mistake, Performance } from '@/types';
import { storage } from '@/constants/data';

interface TrainingProps {
  constant: Constant;
  onBack: () => void;
}

export default function Training({ constant, onBack }: TrainingProps) {
  const [startPosition, setStartPosition] = useState(1);
  const [digitsToPractice, setDigitsToPractice] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [performance, setPerformance] = useState<Partial<Performance> | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Training state
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [typedDigits, setTypedDigits] = useState<{digit: string, isCorrect: boolean, isSkipped?: boolean}[]>([]);
  const [allDisplayedDigits, setAllDisplayedDigits] = useState<{digit: string, isCorrect: boolean, isSkipped?: boolean}[]>([]);

  const startTraining = () => {
    setIsTraining(true);
    setCurrentIndex(startPosition - 1);
    setCorrectCount(0);
    setMistakeCount(0);
    setSkipCount(0);
    setStartTime(new Date());
    setTypedDigits([]);
    setAllDisplayedDigits([]);
  };

  const endTraining = useCallback(() => {
    if (!startTime) return;
    
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / 3600000);
    const minutes = Math.floor((durationMs % 3600000) / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const accuracyRate = correctCount / (correctCount + mistakeCount) * 100;
    
    const performanceData: Performance = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString(),
      constant: constant.name,
      duration,
      startPosition,
      correctDigits: correctCount,
      mistakes: mistakeCount,
      accuracyRate: parseFloat(accuracyRate.toFixed(2)),
      skipped: skipCount
    };
    
    storage.addPerformance(constant.name, performanceData);
    setPerformance(performanceData);
    setIsTraining(false);
  }, [startTime, correctCount, mistakeCount, skipCount, constant.name, startPosition]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isTraining) return;
    
    const currentDigit = constant.digits[currentIndex];
    
    if (e.key === 'Escape') {
      endTraining();
    } else if (e.key === 'ArrowRight') {
      // Skip digit
      setSkipCount(prev => prev + 1);
      setCurrentIndex(prev => prev + 1);
      const newDigit = {digit: currentDigit, isCorrect: false, isSkipped: true};
      setAllDisplayedDigits(prev => [...prev, newDigit]);
      setTypedDigits(prev => [...prev, newDigit]);
    } else if (e.key >= '0' && e.key <= '9') {
      if (e.key === currentDigit) {
        // Correct digit
        setCorrectCount(prev => prev + 1);
        setCurrentIndex(prev => prev + 1);
        const newDigit = {digit: e.key, isCorrect: true};
        setAllDisplayedDigits(prev => [...prev, newDigit]);
        setTypedDigits(prev => [...prev, newDigit]);
      } else {
        // Incorrect digit
        const mistake: Mistake = {
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          time: new Date().toLocaleTimeString(),
          constant: constant.name,
          position: currentIndex + 1,
          expected: currentDigit,
          received: e.key
        };
        
        storage.addMistake(constant.name, mistake);
        setMistakeCount(prev => prev + 1);
        const newDigit = {digit: e.key, isCorrect: false};
        setAllDisplayedDigits(prev => [...prev, newDigit]);
        setTypedDigits(prev => [...prev, newDigit]);
      }
    } else if (e.key === 'Backspace') {
      // Allow backspace to delete last typed digit
      if (typedDigits.length > 0) {
        const lastDigit = typedDigits[typedDigits.length - 1];
        setTypedDigits(prev => prev.slice(0, -1));
        
        if (lastDigit.isSkipped) {
          setSkipCount(prev => prev - 1);
          setCurrentIndex(prev => prev - 1);
        } else if (lastDigit.isCorrect) {
          setCorrectCount(prev => prev - 1);
          setCurrentIndex(prev => prev - 1);
        } else {
          setMistakeCount(prev => prev - 1);
        }
      }
    }
    // Ignore other keys
  }, [isTraining, currentIndex, constant, endTraining, typedDigits]);

  useEffect(() => {
    if (isTraining) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isTraining, handleKeyPress]);

  useEffect(() => {
    if (isTraining && currentIndex >= startPosition - 1 + digitsToPractice) {
      endTraining();
    }
  }, [isTraining, currentIndex, startPosition, digitsToPractice, endTraining]);

  // Split digits into lines for better display
  const renderDigitLines = () => {
    const digitsPerLine = 50;
    const lines = [];
    
    for (let i = 0; i < allDisplayedDigits.length; i += digitsPerLine) {
      const lineDigits = allDisplayedDigits.slice(i, i + digitsPerLine);
      lines.push(
        <div key={i} className="mb-2">
          {lineDigits.map((item, index) => (
            <span 
              key={i + index} 
              className={
                item.isSkipped ? 'underline text-gray-600' : 
                item.isCorrect ? 'text-green-600' : 'text-red-600'
              }
            >
              {item.digit}
            </span>
          ))}
        </div>
      );
    }
    
    return lines;
  };

  if (performance) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Training Results</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-800">Duration</p>
            <p className="font-medium text-gray-800">{performance.duration}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-800">Accuracy</p>
            <p className="font-medium text-gray-800">{performance.accuracyRate}%</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-800">Correct Digits</p>
            <p className="font-medium text-gray-800">{performance.correctDigits}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-800">Mistakes</p>
            <p className="font-medium text-gray-800">{performance.mistakes}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Back to Constants
          </button>
          <button
            onClick={() => {
              setPerformance(null);
              setIsTraining(false);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  if (isTraining) {
    const progress = ((currentIndex - (startPosition - 1)) / digitsToPractice) * 100;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Practicing: {constant.name}</h2>
          <button
            onClick={endTraining}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
          >
            End Session
          </button>
        </div>
        
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-800 mt-1">
            <span>Position: {currentIndex + 1}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-2xl font-bold mb-2 text-gray-800 overflow-x-auto">
            {renderDigitLines()}
            <span className="inline-block w-4 h-1 bg-gray-800 align-middle ml-1"></span>
          </div>
          <p className="text-gray-700">Type the next digit from memory</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-medium mb-2 text-gray-800">Instructions</h3>
          <ul className="text-sm list-disc list-inside text-gray-700 space-y-1">
            <li>Type the digit from memory</li>
            <li>Press → (right arrow) to skip this digit</li>
            <li>Press Backspace to delete last digit</li>
            <li>Press ESC to end the session</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Practice Settings: {constant.name}</h2>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Constants
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Position
          </label>
          <input
            type="number"
            min="1"
            max={constant.digits.length}
            value={startPosition}
            onChange={(e) => setStartPosition(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
          />
          <p className="text-xs text-gray-600 mt-1">
            Maximum: {constant.digits.length}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Digits to Practice
          </label>
          <input
            type="number"
            min="1"
            max={constant.digits.length - startPosition + 1}
            value={digitsToPractice}
            onChange={(e) => setDigitsToPractice(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
          />
          <p className="text-xs text-gray-600 mt-1">
            Maximum: {constant.digits.length - startPosition + 1}
          </p>
        </div>
      </div>
      
      <button
        onClick={startTraining}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-medium"
      >
        Start Practice Session
      </button>
    </div>
  );
}