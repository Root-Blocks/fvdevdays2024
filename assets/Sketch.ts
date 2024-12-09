import p5 from "p5";

const sketch = (
  p: p5,
  hash: string,
  tokenId: number,
  width: number,
  height: number
) => {
  const countryColors = ["#002654", "#FFFFFF", "#ED2939"];
  // Art Blocks POAP Collection p.js Script Draft

  let selectedFont: p5.Font;
  let hashValues: any = {};
  let eventTitle =
    "Futureverse Dev Days | Paris, France | XRPL Commons | 5th Nov 2024 | "; // Event title to be drawn on border
  let baseSize: number; // This will be used as a consistent reference for sizing
  let cachedGradient: p5.Color[];
  let cachedTitlePositions: any[] = [];
  let animate = false; // Control if animation should start
  let frameIndex = 0;
  let shadowXShift = 0,
    shadowYShift = 0;
  let frameState = 0; // Declare at the top-level scope

  p.preload = () => {
    selectedFont = p.loadFont("/fonts/RobotoMono-Bold.ttf");
  };

  p.setup = () => {
    baseSize = p.min(width, height);
    p.createCanvas(baseSize, baseSize);

    // Calculate hash values for artwork customization
    computeHashValues();

    // Make random() function reproducible
    p.randomSeed(hashValues.seed);

    // Precompute gradient and title positions
    cachedGradient = computeGradient();
    computeTitlePositions();

    // Draw the initial static artwork
    drawArtwork();
  };

  p.draw = () => {
    p.clear();
    drawArtwork();
    if(animate) frameState = (p.frameCount - frameIndex); // Update frameState here
    drawAnimatedPattern();
    drawBorder();
    drawEventTitleOnBorder();

  };

  // Function to calculate hash values for artwork customization
  function computeHashValues() {
    hashValues.countryColors = countryColors;
    hashValues.colorsForDrawing = hashValues.countryColors;
    hashValues.seed = parseInt(hash.slice(-16), 16) % 1000000;
    hashValues.shape = parseInt(hash.slice(14, 18), 16) % 2;
    hashValues.numDetails = (parseInt(hash.slice(10, 14), 16) % 15) + 5; // Reduced number of details for performance
  }

  function mask() {
    p.ellipseMode(p.RADIUS);
    p.ellipse(baseSize / 2, baseSize / 2, baseSize / 2, baseSize / 2);
  }

  function drawBorder() {
    p.ellipseMode(p.RADIUS);
    p.blendMode(p.BLEND);
    p.noFill();
    p.strokeWeight(baseSize / 10);

    drawBorderShadow();

    // Draw the actual border
    p.stroke(255, 255, 255, 255); // White border
    let sizeOffset = baseSize / 40;
    p.ellipse(
      baseSize / 2,
      baseSize / 2,
      baseSize / 2 - sizeOffset,
      baseSize / 2 - sizeOffset
    );
  }

  function drawBorderShadow() {
    // Draw a shadow for the border
    p.noFill();
    p.stroke(0, 0, 0, 100); // Semi-transparent black shadow
    p.strokeWeight(baseSize / 10);
    let shadowOffset = baseSize / 20;
    p.ellipse(
      baseSize / 2 - shadowXShift,
      baseSize / 2 - shadowYShift,
      baseSize / 2 - shadowOffset,
      baseSize / 2 - shadowOffset
    );
  }

  // Function to draw the POAP artwork
  function drawArtwork() {
    // Create a circular clipping mask to make the artwork look like a round badge
    p.background(0, 0);
    //@ts-ignore
    p.clip(mask);
    drawCachedGradientBackground(); // Use cached gradient background
    p.ellipseMode(p.CENTER);
  }

  function drawEventTitleOnBorder() {
    p.push();
    p.translate(width / 2, height / 2);
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont(selectedFont);
    p.textStyle(p.BOLD);
    p.textSize(baseSize / 15); // Adjust font size for readability
    p.fill(0);
    p.noStroke();
    p.rotate(frameState / 400); // Add this line for rotation
    for (let i = 0; i < cachedTitlePositions.length; i++) {
      let { x, y, angle, char } = cachedTitlePositions[i];
      p.push();
      p.translate(x, y);
      p.rotate(angle + p.HALF_PI);
      p.text(char, 0, 0);
      p.pop();
    }
    p.pop();
  }

  // Function to precompute title positions to reduce draw time calculations
  function computeTitlePositions() {
    let radius = baseSize / 2.1;
    let borderTitle = `#${tokenId} | ${eventTitle}`;
    cachedTitlePositions = [];
    for (let i = 0; i < borderTitle.length; i++) {
      let angle = p.map(i, 0, borderTitle.length, -p.HALF_PI, 1.5 * p.PI); // Start from the top center
      let x = radius * p.cos(angle);
      let y = radius * p.sin(angle);
      cachedTitlePositions.push({ x, y, angle, char: borderTitle[i] });
    }
  }

  // Function to compute and cache gradient
  function computeGradient() {
    const sortedColors = hashValues.countryColors.sort(
      (a: any, b: any) => p.brightness(p.color(a)) - p.brightness(p.color(b))
    );
    let gradientStart = p.color(sortedColors[0]);
    let gradientEnd = p.color(sortedColors[1]);

    // Tune down the brightness for both colors without changing the hue or saturation
    gradientStart = p.lerpColor(gradientStart, p.color(0, 0, 0), 0.2); // Darken by blending with black (20%)
    gradientEnd = p.lerpColor(gradientEnd, p.color(0, 0, 0), 0.2); // Darken by blending with black (20%)

    let gradientArray = [];
    for (let y = 0; y < height; y++) {
      let inter = p.map(y, 0, height, 0, 1);
      let gradientColor = p.lerpColor(gradientStart, gradientEnd, inter);
      gradientArray.push(gradientColor);
    }
    return gradientArray;
  }

  function drawCachedGradientBackground() {
    for (let y = 0; y < height; y++) {
      p.stroke(cachedGradient[y]);
      p.line(0, y, width, y);
    }
  }

  let animationPeriod = 628; // The period at which the animation resets to its original state
  let animationState = 0; // The current state of the animation

  // Adding attendee-specific animated organic details to each artwork
  function drawAnimatedPattern() {
    p.beginShape();
    p.ellipseMode(p.RADIUS);
    p.rectMode(p.RADIUS);
    let period = animationPeriod; // Set the period for the animation to repeat
    let modFrameState = 0;
    if (frameIndex && animate) {
      modFrameState = (p.frameCount - frameIndex) % period;
    } else modFrameState = frameIndex % period;

    if (Math.round((modFrameState / 628) * 100) != animationState) {
      animationState = Math.round((modFrameState / 628) * 100);
      //console.log(`Animation State: ${animationState}%`);
    }

    for (let i = 0; i < hashValues.numDetails; i++) {
      let angle =
      modFrameState * (p.TWO_PI / period) +
        (i * p.TWO_PI) / hashValues.numDetails;
      let radius =
        baseSize / 4 +
        (p.sin(modFrameState * (p.TWO_PI / period) + i) * baseSize) / 20;
      let x = width / 2 + radius * p.cos(angle);
      let y = height / 2 + radius * p.sin(angle);

      let fillColor = p.color(
        hashValues.colorsForDrawing[i % hashValues.colorsForDrawing.length]
      );
      fillColor.setAlpha(100);
      p.fill(fillColor);
      p.noStroke();

      let size =
        baseSize / 4 +
        (p.sin(modFrameState * (p.TWO_PI / period) + i) * baseSize) / 40; // Reduced size for performance

      if (hashValues.shape == 0) p.ellipse(x, y, size, size);
      else {
        p.push();
        p.translate(x, y); // Move to the center of where we want to draw the rectangle
        p.rotate(p.sin(modFrameState * (p.TWO_PI / period))); // Rotate around the new center
        p.rect(0, 0, size, size); // Draw the rectangle at translated origin
        p.pop();
      }
    }
    p.endShape();
  }


  p.mouseClicked = () => {
    if (!animate) {
      animate = true; // Start animation on click
      //frameIndex = p.frameCount; // Reset frameIndex to current frame count
      //console.log("mouse clicked. start animation.");
    } else {
      animate = false;
      //console.log("mouse clicked. stop animation.");
    }
    frameIndex = p.frameCount - frameIndex;
  };

  p.mouseMoved = () => {
    let mouseOffset = 50;

    if (
      p.mouseX > 0 &&
      p.mouseX < baseSize &&
      p.mouseY > 0 &&
      p.mouseY < baseSize
    ) {
      shadowXShift = p.map(
        p.mouseX,
        0,
        baseSize,
        -baseSize / mouseOffset,
        baseSize / mouseOffset
      );
      shadowYShift = p.map(
        p.mouseY,
        0,
        baseSize,
        -baseSize / mouseOffset,
        baseSize / mouseOffset
      );
    } else {
      shadowXShift = 0;
      shadowYShift = 0;
    }
  };

};

export default sketch;
