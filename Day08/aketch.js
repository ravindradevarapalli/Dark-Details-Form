// --- Global Variables ---
let fishies = [];
let numFish = 15;
let nebulaParticles = [];
let numNebulaParticles = 300;
let thoughtParticles = [];

// --- Setup ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100); // Hue, Saturation, Brightness, Alpha
  noStroke();

  // Create initial nebula particles
  for (let i = 0; i < numNebulaParticles; i++) {
    nebulaParticles.push(new NebulaParticle(random(width), random(height)));
  }

  // Create fish
  for (let i = 0; i < numFish; i++) {
    fishies.push(new Fish(random(width), random(height)));
  }
}

// --- Draw Loop ---
function draw() {
  // Semi-transparent background for trails (nebula effect)
  background(240, 50, 5, 15); // Dark blue-ish with low alpha

  let mousePos = createVector(mouseX, mouseY);

  // --- Update and Display Nebula ---
  for (let i = nebulaParticles.length - 1; i >= 0; i--) {
    let p = nebulaParticles[i];
    p.update();
    p.display();
    if (p.isDead()) {
      // Respawn dead particles for continuous effect
      nebulaParticles[i] = new NebulaParticle(random(width), random(height));
      // nebulaParticles.splice(i, 1); // Option: remove instead of respawn
    }
  }
  // Add a few new nebula particles each frame for density
  if (nebulaParticles.length < numNebulaParticles * 1.5) {
    // Keep density reasonable
    for (let k = 0; k < 2; k++) {
      nebulaParticles.push(new NebulaParticle(random(width), random(height)));
    }
  }

  // --- Update and Display Fish ---
  for (let fish of fishies) {
    fish.applyBehaviors(mousePos);
    fish.update();
    fish.edges();
    fish.display();
    fish.think(mousePos); // Let the fish "think" based on mouse proximity
  }

  // --- Update and Display Thought Particles ---
  for (let i = thoughtParticles.length - 1; i >= 0; i--) {
    let tp = thoughtParticles[i];
    tp.update();
    tp.display();
    if (tp.isDead()) {
      thoughtParticles.splice(i, 1); // Remove dead particles
    }
  }

  // Optional: Display interaction hint
  fill(0, 0, 100, 70); // White text
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Move the mouse near the fish...", width / 2, height - 30);
}

// --- Resize Canvas ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Optional: Could redistribute particles/fish on resize
}

// ===================================
// --- NebulaParticle Class ---
// ===================================
class NebulaParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // Slow drift velocity
    this.vel = p5.Vector.random2D().mult(random(0.1, 0.5));
    this.lifespan = random(100, 400);
    this.maxLife = this.lifespan;
    this.size = random(2, 6);
    // Nebula colors (pinks, purples, blues)
    this.hue = random(240, 330);
    this.sat = random(50, 90);
    this.bri = random(60, 100);
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 1.0;
    // Slightly change velocity over time for more organic drift
    this.vel.rotate(random(-0.02, 0.02));
  }

  display() {
    // Fade out as lifespan decreases
    let alpha = map(this.lifespan, 0, this.maxLife, 0, 60); // Low alpha for nebula feel
    fill(this.hue, this.sat, this.bri, alpha);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

// ===================================
// --- ThoughtParticle Class ---
// ===================================
class ThoughtParticle {
  constructor(x, y, fishVel, thoughtColor) {
    this.pos = createVector(x, y);
    // Start with fish's velocity plus an outward burst
    this.vel = fishVel.copy().add(p5.Vector.random2D().mult(random(0.5, 1.5)));
    this.lifespan = random(40, 90);
    this.maxLife = this.lifespan;
    this.size = random(3, 7);
    this.color = thoughtColor; // HSB color array [h, s, b]
  }

  update() {
    this.pos.add(this.vel);
    // Slow down slightly
    this.vel.mult(0.98);
    this.lifespan -= 1.0;
  }

  display() {
    // Fade out
    let alpha = map(this.lifespan, 0, this.maxLife, 0, 90); // Brighter than nebula
    fill(this.color[0], this.color[1], this.color[2], alpha);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

// ===================================
// --- Fish Class ---
// ===================================
class Fish {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector(0, 0);
    this.maxSpeed = 3;
    this.maxForce = 0.15; // Steering force limit
    this.size = random(8, 15);
    // Fish color - bluish/cyan range
    this.hue = random(170, 220);
    this.sat = random(60, 90);
    this.bri = random(70, 100);

    this.perceptionRadius = 150; // How far the fish 'sees' the mouse
    this.alertRadius = 70; // How close the mouse needs to be for 'alert' thoughts
    this.curiousRadius = 150; // Radius for 'curious' thoughts
    this.thoughtCooldown = 0; // Timer to limit thought particle emission
    this.maxThoughtCooldown = 3; // Minimum frames between thoughts
  }

  applyForce(force) {
    this.acc.add(force);
  }

  // --- Steering Behaviors ---
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  // Combine behaviors
  applyBehaviors(mouseTarget) {
    let mouseDist = dist(this.pos.x, this.pos.y, mouseTarget.x, mouseTarget.y);
    let seekForce = createVector(0, 0);

    // Only seek mouse if it's within perception radius
    if (mouseDist < this.perceptionRadius) {
      seekForce = this.seek(mouseTarget);
      // Make force stronger the closer the mouse is (optional)
      let proximityFactor = map(mouseDist, 0, this.perceptionRadius, 1.5, 0.1);
      seekForce.mult(proximityFactor);
    } else {
      // Simple wander tendency when mouse is far
      let wanderAngle =
        noise(this.pos.x * 0.01, this.pos.y * 0.01, frameCount * 0.01) *
        TWO_PI *
        4;
      let wanderForce = p5.Vector.fromAngle(wanderAngle);
      wanderForce.setMag(this.maxForce * 0.1); // Weak wander
      this.applyForce(wanderForce);
    }

    this.applyForce(seekForce);
  }

  // --- Update Physics ---
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    // Reset acceleration each frame
    this.acc.mult(0);

    if (this.thoughtCooldown > 0) {
      this.thoughtCooldown--;
    }
  }

  // --- Boundary Handling ---
  edges() {
    let margin = 50; // Allow going off-screen slightly before wrapping
    if (this.pos.x > width + margin) this.pos.x = -margin;
    if (this.pos.x < -margin) this.pos.x = width + margin;
    if (this.pos.y > height + margin) this.pos.y = -margin;
    if (this.pos.y < -margin) this.pos.y = height + margin;
  }

  // --- Visualize "Thinking" ---
  think(mouseTarget) {
    if (this.thoughtCooldown <= 0) {
      let mouseDist = dist(
        this.pos.x,
        this.pos.y,
        mouseTarget.x,
        mouseTarget.y
      );
      let thoughtColor = null; // [h, s, b]

      if (mouseDist < this.alertRadius) {
        // Alert/Startled: Red/Pink, frequent emission
        thoughtColor = [random(0, 20), 90, 100]; // Red range
        if (random(1) < 0.6) {
          // Higher chance to emit
          this.emitThought(thoughtColor);
          this.thoughtCooldown = this.maxThoughtCooldown;
        }
      } else if (mouseDist < this.curiousRadius) {
        // Curious/Interested: Yellow/Orange, less frequent
        thoughtColor = [random(40, 60), 90, 100]; // Yellow/Orange range
        if (random(1) < 0.3) {
          // Lower chance
          this.emitThought(thoughtColor);
          this.thoughtCooldown = this.maxThoughtCooldown + 2; // Longer cooldown
        }
      }
      // Optional: Could add a third state for 'idle' thoughts (e.g., blue) emitted randomly
      // else if (random(1) < 0.01) { // Very low chance for idle thoughts
      //    thoughtColor = [random(180, 240), 70, 100]; // Blue range
      //    this.emitThought(thoughtColor);
      //     this.thoughtCooldown = this.maxThoughtCooldown + 10;
      // }
    }
  }

  emitThought(color) {
    // Emit 1-3 particles per thought event
    let numParticles = floor(random(1, 4));
    for (let i = 0; i < numParticles; i++) {
      thoughtParticles.push(
        new ThoughtParticle(this.pos.x, this.pos.y, this.vel, color)
      );
    }
  }

  // --- Display Fish ---
  display() {
    let angle = this.vel.heading(); // Direction fish is pointing
    push(); // Isolate transformations
    translate(this.pos.x, this.pos.y);
    rotate(angle);

    // Simple triangle shape for fish
    fill(this.hue, this.sat, this.bri, 90); // Semi-transparent fish
    beginShape();
    vertex(this.size, 0); // Nose
    vertex(-this.size / 2, this.size / 2); // Tail corner 1
    vertex(-this.size / 3, 0); // Tail indent (optional)
    vertex(-this.size / 2, -this.size / 2); // Tail corner 2
    endShape(CLOSE);

    pop(); // Restore previous drawing state
  }
}
