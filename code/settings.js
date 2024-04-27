export class Settings {
  static pathStartLayout = "assets/layout/start.json";
  static pathOptionsLayout = "assets/layout/options.json";
  static pathGameLayout = "assets/layout/game.json";
  static pathBackgroundLayout = "assets/layout/background.json";
  static pathCreditsLayout = "assets/layout/credits.json";
  static pathInGameLayout = "assets/layout/inGame.json";
  static pathInGameMenuLayout = "assets/layout/inGameMenu.json";
  static pathGameoverLayout = "assets/layout/gameOver.json";
  static pathFPSCounterLayout = "assets/layout/FPSCounter.json";
  static pathGrayFilterLayout = "assets/layout/grayFilter.json";
  static pathGraphicsLayout = "assets/layout/graphics.json";
  static pathSoundLayout = "assets/layout/sound.json";
  static pathControllsLayout = "assets/layout/controlls.json";
  static pathLevelSelectorLayout = "assets/layout/levelSelector.json";

  static pathLevels = "assets/layout/levels.json";

  static pathScanlines = "assets/graphics/textures/scanlines.jpg";
  static pathNoise = "assets/graphics/textures/noise.jpg";
  static pathVignette = "assets/graphics/textures/vignette.jpg";

  static zIndex = {
    background: 0,
    game: 1,
    inGame: 2,
    grayFilter: 3,
    credits: 4,
    start: 4,
    gameOver: 4,
    options: 4,
    levelSelector: 4,
    FPSCounter: 4
  };

  static gravity = 0.03;

  static pathPlayer = "assets/graphics/game/player.png";
  static playerAnimationInfo = {rows: 1, columns: 1, startFrame: 0, endFrame: 0, frameRate: 1};
  static playerSize = {x: 0.0690, y: 0.1255};
  static playerJumpForce = -0.0007;
  static playerRotationSmoothness = 0.1;
  static playerRotationMultiplier = 500;
  static playerRecenterForce = 0.00001;

  static distanceIncrement = 0.05;
  static pathSlingshotNet = "assets/graphics/game/slingshotNet.png";
  static pathSlingshotpool = "assets/graphics/game/slingshotPool.png";
  static slingshotPoleRange = 0.175;
  static returnNetSpeed = 0.01;
  static slingshotPosition = { x: 0.220, y: 0.525 };
  static slingshotSize = { x: 0.089, y: 0.259 };
  static slingshotNetSize = { x: 0.0445, y: 0.1295 };
  static elasticWidth = 0.02;
  static elastic1position = { x: 0.2903, y: 0.5528 };
  static elastic2position = { x: 0.2356, y: 0.5528 };
  static slingshotAnimationInfo = {rows: 1, columns: 1, startFrame: 0, endFrame: 0, frameRate: 1};

  static pathBoxOpen = "assets/graphics/game/openBox.png";
  static pathBoxClosed = "assets/graphics/game/closeBox.png";
  static boxAnimationInfo = {rows: 1, columns: 1, startFrame: 0, endFrame: 0, frameRate: 1};
  static boxSize = { x: 0.054, y: 0.096 };

  static boxSound = "assets/audio/Game/boxBreaking.wav"

  static groundPosition = {x: 0.075, y: 0.775};
  static groundSize = {x: 0.845, y: 0.125};

  static amountOfLevels = 5;

  static previewPositions = [
    { x: 0.212, y: 0.283 },
    { x: 0.406, y: 0.283 },
    { x: 0.600, y: 0.283 }
  ];

  static previewLeftOut = { x: 0.098, y: 0.283 };
  static previewRightOut = { x: 0.714, y: 0.283 };

  static previewSize = { x: 0.188, y: 0.434 };

  static soundTrack = "assets/audio/UI/soundtrack.mp3";
}
