# Angry Birds
[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]
[![GitHub Release](https://img.shields.io/github/v/release/Jorin-Liesse/Angry_Birds)](https://github.com/Jorin-Liesse/Angry_Birds/releases)
[![GitHub Stars](https://img.shields.io/github/stars/Jorin-Liesse/Angry_Birds)](https://github.com/Jorin-Liesse/Angry_Birds/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Jorin-Liesse/Angry_Birds)](https://github.com/Jorin-Liesse/Angry_Birds/forks)
[![GitHub watchers](https://img.shields.io/github/watchers/Jorin-Liesse/Angry_Birds)](https://github.com/Jorin-Liesse/Angry_Birds/watchers)

<div style="display: flex; flex-direction: row;">
    <a href="https://jorin-liesse.github.io/Angry_Birds/" target="_blank">
        <img src="https://github.com/Jorin-Liesse/Angry_Birds/assets/66786568/37f94966-8b03-49b6-987d-94805330e854" alt="Settings" width="400"/>
    </a>
    <a href="https://jorin-liesse.github.io/Angry_Birds/" target="_blank">
        <img src="https://github.com/Jorin-Liesse/Angry_Birds/assets/66786568/d2e5559e-8c9c-4c18-b4bc-b29a62473069" alt="GamePlay" width="400"/>
    </a>
</div>

## Table of Contents
- [Project Description](#Project-Description)
- [Installation](#Installation)
- [Troubleshooting](#Troubleshooting)
- [Usage](#Usage)
- [Credits](#Credits)
- [License](#License)

## Project Description
**Angry Birds Clone** is a recreation of the classic Angry Birds game. It aims to provide an enjoyable and nostalgic gaming experience for players. The game features simple controls and addictive gameplay.

### Key Features

- **Classic Gameplay**: Catapult birds to knock down structures.
- **Challenging Levels**: Progress through a variety of levels with increasing difficulty and unique challenges.
- **Score Tracking**: Keep track of your highest scores on each level and strive for three-star ratings.

### Technologies Used

- HTML5
- CSS3
- JavaScript

## Installation

### Prerequisites
Before installing and running the application, please ensure that you have the following prerequisites installed on your system:

- Node.js (>= 10.x)
- npm (Node Package Manager)

### Method 1: Running with npm http-server (Windows, macOS, Linux)

1. Open your command line interface.
2. Navigate to the root directory of the repository.
3. Run the following commands:
    ```bash
    npm init -y
    npm install -g http-server
    http-server
    ```
4. If you encounter the error message:
    ```
    http-server : File C:\Users\yourusername\AppData\Roaming\npm\http-server.ps1
    cannot be loaded because running scripts is disabled on this system...
    ```
    You need to adjust the execution policy by running:
    ```bash
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```
5. Run `http-server` again.
6. Open your web browser and navigate to one of the following URLs:
    - [http://192.168.129.85:8080](http://192.168.129.85:8080)
    - [http://127.0.0.1:8080](http://127.0.0.1:8080)

### Method 2: Building from Source (Windows, macOS, Linux)

1. Open your command line interface.
2. Navigate to the root directory of the repository.
3. Run the following commands to install dependencies and build the application:
    ```bash
    npm install
    npm run build-win  # for Windows
    # OR
    npm run build-mac  # for macOS
    # OR
    npm run build-linux  # for Linux
    ```
4. Once the build process is complete, navigate to the `build` folder.
5. In the `build` folder, you will find the application folder containing `Flappy-Bird.exe` (for Windows).
   
## Troubleshooting
If you encounter any issues during installation or running the application, please refer to the following steps:

- Make sure you navigate to the root directory of the repositor.
- For issues related to script execution policies on Windows, refer to [Microsoft's documentation](https://go.microsoft.com/fwlink/?LinkID=135170).
- Make sure you have installed all required dependencies and have the correct version of Node.js and npm.

## Usage

### Playing the Game

To play the game, follow these steps:

1. Launch the game by double-clicking the executable file (`Angry_Birds.exe` for Windows).
2. Once the game is launched, you will be presented with the main menu.
3. Use the following controls to play the game:
   - **Click and Drag**: Adjust the angle and power of your shot.
   - **Release Mouse Button**: Launch the bird from the catapult.
4. Aim the catapult to knock down structures.
5. Complete each level by destroying all structures and earning three-star ratings.

### Controls

- **Click and Drag**: Adjust the angle and power of your shot.
- **Release Mouse Button**: Launch the bird from the catapult.
- **Escape**: To pause the game.

## Credits
### Development

- [Jorin Liesse](https://github.com/Jorin-Liesse) - Sole developer of the project

### Personal Links

- [Portfolio Website](https://jorin-liesse.github.io/Portfolio/) - Visit my portfolio to learn more about my projects and skills.
- [LinkedIn](https://www.linkedin.com/in/jorin-liesse-755774287/) - Connect with me on LinkedIn.

### Inspirations
- Art inspirations from [Kurzgesagt](https://www.youtube.com/@kurzgesagt)
- Coding inspirations from [DaFluffyPotato](https://www.youtube.com/@DaFluffyPotato)

### Testers

- [Sander Daniels](https://www.linkedin.com/in/sander-daniels-429a11293/) - Provided valuable feedback and testing
- [Brian Thys](https://www.linkedin.com/in/brian-thys-4a88492a4/) - Provided valuable feedback and testing

## License
This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg
