# SpeedTyping_Tally
## Description
This github repository is a live speedtyping web application that allows users to test and improve their typing speed and accuracy in real-time using WebSockets.
WebSockets provide a real-time, bidirectional communication channel between the client (user's web browser) and the server, making them an excellent choice for implementing live features like speed tests
## Features
### 1. Real-time Updates:
Experience instant feedback on your typing performance without the need for page refreshes.
### 2. WPM Calculation:
The server accurately calculates your words per minute (WPM) as you type.
### 3. Accuracy Tracking: 
The application tracks your accuracy by comparing your typed text against the provided text.
### 4. Leaderboard:
Compete against others and view the top performers on the dynamic leaderboard.
### 5. Multiplayer Support:
Engage in real-time typing competitions with other users.
### 6. Practice mode
You can practice in solo mode to improve your typing skills.
### 7. Dynamic Text Generation: 
Each time the page refreshes the text is generated dynamically. Users in the same room get the same text to type to ensure fair competition.
### 8. Error Highlighting:
Identify and correct mistakes with highlighted incorrect characters.
### 9. Multilevels tests:
The application provides you four different levels to test your skills: Cakewalk, Easy, Medium and Hard
## Installation
### 1. Clone the repository
    git clone https://github.com/adarshgit2003/SpeedTyping_Tally.git
### 2. Navigate to the project directory and install dependencies
    git install
### 3. Start the server.
    npm run dev
### 4. Open the web application in your browser: http://localhost:3000.
## Technologies Used
* Node.js: Server-side JavaScript runtime environment.
* Express.js: Web application framework for Node.js.
* WebSocket: Real-time bidirectional communication between client and server.
* HTML/CSS/BootStrap: User interface and styling.
