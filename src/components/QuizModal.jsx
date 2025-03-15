import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const QuizModal = ({ isOpen, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
    
  const { data: questions = [] } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const res = await axios.get('/questions.json');
      const allQuestions = res.data;
      
      // Separate questions by type
      const multipleChoiceQuestions = allQuestions.filter(q => q.type === 'multiple-choice');
      const textQuestions = allQuestions.filter(q => q.type === 'text');
      
      // Randomly select 5 from each type
      const selectedMultipleChoice = multipleChoiceQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
        
      const selectedText = textQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      console.log(selectedMultipleChoice);
      console.log(selectedText);
        
      // Combine and shuffle the selected questions
      return [...selectedMultipleChoice, ...selectedText]
        .sort(() => Math.random() - 0.5);
    }
  });
  

  const handleAnswer = (selected) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selected === currentQuestion.answer;
    const marks = isCorrect ? currentQuestion.marks : 0;

    setSelectedAnswer(selected);
    setShowFeedback(true);

    setUserAnswers([...userAnswers, { question: currentQuestion.question, selectedAnswer: selected, isCorrect }]);
    setTotalMarks(prevMarks => prevMarks + marks);
  };

  const handleTextAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = textAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
    const marks = isCorrect ? currentQuestion.marks : 0;

    setShowFeedback(true);

    setUserAnswers([...userAnswers, { question: currentQuestion.question, selectedAnswer: textAnswer, isCorrect }]);
    setTotalMarks(prevMarks => prevMarks + marks);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setTextAnswer('');
    
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
    setSelectedAnswer(null);
    setTextAnswer('');
    setShowFeedback(false);
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
                  Question {currentQuestionIndex + 1}/10
                </h2>
                <div className="text-sm font-medium text-gray-500">
                  Marks: {currentQuestion?.marks}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-hair-color h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
                ></div>
              </div>

              <p className="text-lg sm:text-xl font-bold text-hair-color">
                {currentQuestion?.question.split('___').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <input
                        type="text"
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        className="w-24 mx-2 text-center border-b-2 border-hair-color focus:outline-none"
                        disabled={showFeedback}
                      />
                    )}
                  </React.Fragment>
                ))}
              </p>

              {currentQuestion?.type === 'multiple-choice' ? (
                <div className="grid gap-4">
                  {currentQuestion?.options.map((option, index) => {
                    let optionClass = "w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-hair-color hover:bg-hair-color/5 transition-all duration-300 font-medium";
                    
                    if (showFeedback && selectedAnswer === option) {
                      if (option === currentQuestion.answer) {
                        optionClass = "w-full text-left p-4 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 font-medium";
                      } else {
                        optionClass = "w-full text-left p-4 rounded-lg border-2 border-red-500 bg-red-50 text-red-700 font-medium";
                      }
                    } else if (showFeedback && option === currentQuestion.answer) {
                      optionClass = "w-full text-left p-4 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 font-medium";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => !showFeedback && handleAnswer(option)}
                        disabled={showFeedback}
                        className={optionClass}
                      >
                        <span className={`inline-block w-8 h-8 rounded-full ${showFeedback ? 'bg-gray-50' : 'bg-gray-100'} text-hair-color mr-3 text-center leading-8`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {showFeedback && (
                    <div className={`p-4 rounded-lg ${textAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim() ? 'bg-green-50 text-green-700 border-2 border-green-500' : 'bg-red-50 text-red-700 border-2 border-red-500'}`}>
                      {textAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim() ? 'Correct!' : `Incorrect. The correct answer is: ${currentQuestion.answer}`}
                    </div>
                  )}
                  <button
                    onClick={handleTextAnswer}
                    disabled={showFeedback || !textAnswer.trim()}
                    className="w-full text-hair-color p-4 rounded-lg border-2 border-gray-400 hover:border-hair-color hover:bg-hair-color/5 transition-all duration-300 font-medium"
                  >
                    Submit Answer
                  </button>
                </div>
              )}
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
            <div className="mt-6 flex justify-between">
              <button 
                onClick={onClose}
                className="btn btn-outline px-8 py-3 text-hair-color hover:bg-hair-color hover:text-white rounded-full"
              >
                Exit Quiz
              </button>

              {showFeedback && (
                <button
                  onClick={handleNext}
                  className="btn btn-primary px-8 py-3"
                >
                  Next Question
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
