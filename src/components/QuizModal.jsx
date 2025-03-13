import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const QuizModal = ({ isOpen, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
    
  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const res = await axios.get('/questions.json');
      return res.data;
    }
  });

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;
    const marks = isCorrect ? currentQuestion.marks : 0;

    setUserAnswers([...userAnswers, { question: currentQuestion.question, selectedAnswer, isCorrect }]);
    setTotalMarks(prevMarks => prevMarks + marks);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setUserAnswers([]);
    setTotalMarks(0);
    onClose();
  };

  const getFeedback = () => {
    const percentage = (totalMarks / questions.reduce((acc, q) => acc + q.marks, 0)) * 100;
    if (percentage >= 80) return "Excellent! You're a quiz master!";
    if (percentage >= 60) return "Good job! Keep learning!";
    return "Keep practicing! You can do better!";
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all">
        <div className="p-6 sm:p-8">
          {!showResults ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-hair-color">
                  Question {currentQuestionIndex + 1}/{questions.length}
                </h2>
                <div className="text-sm font-medium text-gray-500">
                  Marks: {currentQuestion?.marks}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-hair-color h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              <p className="text-lg sm:text-xl font-bold text-hair-color">
                {currentQuestion?.question}
              </p>

              <div className="grid gap-4">
                {currentQuestion?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-hair-color hover:bg-hair-color/5 transition-all duration-300 font-medium"
                  >
                    <span className="inline-block w-8 h-8 rounded-full bg-gray-100 text-hair-color mr-3 text-center leading-8">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-hair-color mb-4">Quiz Complete!</h2>
              <div className="p-6 rounded-lg bg-hair-color">
                <p className="text-2xl font-bold text-white mb-2">
                  Your Score: {totalMarks}
                </p>
                <p className="text-lg text-white">
                  {getFeedback()}
                </p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={resetQuiz}
                  className="btn btn-primary w-full sm:w-auto px-8 py-3"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          {!showResults && (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={onClose}
                className="btn btn-outline text-hair-color hover:bg-hair-color hover:text-white"
              >
                Exit Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
