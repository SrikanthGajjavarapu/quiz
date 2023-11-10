// (node server.js) using this command we can start the server it can give the port  http://localhost:3000/. This port gives the quiz application.
"use strict";

// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    
    // Retrieved DOM elements needed for the quiz
    const questionText = document.getElementById('question-text');
    const optionsList = document.getElementById('options-list');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const resultContainer = document.getElementById('result');
    const finalScoreElement = document.getElementById('final-score');

    // Global variables to track the quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let startTime;
    let endTime;
    let quizData; // Defined quizData at the global scope

    // Function to loaded quiz data from the JSON file
    function loadQuizData() {
        return fetch('quiz_questions.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load quiz data');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error loading quiz data:', error);
            });
    }

    // Function to display a question
    function showQuestion() {
        // Check if there are more questions to display
        if (currentQuestionIndex < quizData.length) {
            const currentQuestion = quizData[currentQuestionIndex];

            // Display the question text
            questionText.textContent = currentQuestion.question;

            // Create HTML elements for each answer option
            optionsList.innerHTML = '';
            currentQuestion.options.forEach((option, index) => {
                const listItem = document.createElement('li');
                const optionButton = document.createElement('button');
                optionButton.className = 'option-button';
                optionButton.textContent = option;
                optionButton.addEventListener('click', () => submitAnswer(option));
                listItem.appendChild(optionButton);
                optionsList.appendChild(listItem);
            });

            // Start the timer for the current question
            startTimer();
        } else {
            // If there are no more questions, show the final result
            showResult();
        }
    }

    // Function to submit an answer
    function submitAnswer(selectedAnswer) {
        // Stop the timer
        clearInterval(timer);

        const currentQuestion = quizData[currentQuestionIndex];
        
        // Check if the selected answer is correct and update the score
        if (selectedAnswer === currentQuestion.answer) {
            score++;
        }

        // Move to the next question
        currentQuestionIndex++;
        
        // Check if there are more questions to display
        if (currentQuestionIndex < quizData.length) {
            showQuestion(quizData);
        } else {
            // If there are no more questions, show the final result
            showResult();
        }
    }

    // Function to start the timer for each question
    function startTimer() {
        startTime = Date.now();
        let timeLeft = 60; // Time limit per question in seconds
        updateTimerDisplay(timeLeft); // Initial display

        // Update the timer every second
        timer = setInterval(function () {
            timeLeft--;
            updateTimerDisplay(timeLeft);

            // Automatically submit the answer when time is up
            if (timeLeft === 0) {
                clearInterval(timer);
                submitAnswer(null);
            }
        }, 1000);
    }

    // Function to update the timer display
    function updateTimerDisplay(timeLeft) {
        // Display "Time Left:" along with the timer value
        timerElement.textContent = `Time Left: ${timeLeft} seconds`;
    }


    // Function to display the final result
    function showResult() {
        // Clear the question and options
        questionText.textContent = '';
        optionsList.innerHTML = '';

        // Display the result container and final score
        resultContainer.style.display = 'block';
        finalScoreElement.textContent = score;
        timerElement.style.display = 'none';
    }

    // Load quiz data and start the quiz
    loadQuizData().then(data => {
        // Assigned the loaded data to quizData
        quizData = data;
        
        // Started the quiz by showing the first question
        showQuestion();
    });
});
