// --- Global Variables ---
let flock = [];
const numBoids = 30;

let hexagonCenter;
let hexagonRadius;
let hexagonAngle = 0;
let rotationSpeed = 0.005; // Radians per frame

// --- Boid Parameters ---
const maxSpeed = 3;
const maxForce = 0.05;
const perceptionRadius = 50; // For alignment/cohesion
const separationRadius = 24; // For separation
const boundaryMargin = 50; // How close to edge before turning
const boundarySteerForce = 0.2; // How strongly to turn from edge

// --- Setup ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1.0); // Use HSB for nice colors

  hexagonCenter = createVector(width / 2, height / 2);
  // Make hexagon radius responsive, leaving some margin
  hexagonRadius = min(width, height) * 0.4;

  // Initialize Boids
  for (let i = 0; i < numBoids; i++) {
    // Start boids near the center initially
    let startRadius = random(hexagonRadius * 0.8);
    let startAngle = random(TWO_PI);
    let x = hexagonCenter.x + cos(startAngle) * startRadius;
    let y = hexagonCenter.y + sin(startAngle) * startRadius;
    flock.push(new Boid(x, y));
  }
}

// --- Draw Loop ---
function draw() {
  background(51); // Dark grey background

  // Update hexagon rotation
  hexagonAngle += rotationSpeed;

  // Draw the rotating hexagon outline
  drawHexagon(hexagonCenter.x, hexagonCenter.y, hexagonRadius, hexagonAngle);

  // Update and display Boids
  for (let boid of flock) {
    boid.flock(flock); // Apply flocking rules
    boid.avoidWalls(); // Steer away from hexagon boundary
    boid.update(); // Update position
    boid.render(); // Draw the boid
  }
}

// --- Helper function to draw a hexagon ---
function drawHexagon(cx, cy, radius, angle) {
  push(); // Isolate transformations
  translate(cx, cy);
  rotate(angle);
  stroke(255); // White outline
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    let vertexAngle = (TWO_PI / 6) * i;
    let vx = cos(vertexAngle) * radius;
    let vy = sin(vertexAngle) * radius;
    vertex(vx, vy);
  }
  endShape(CLOSE);
  pop(); // Restore previous transformation state
}

// --- Boid Class ---
class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(1, maxSpeed));
    this.acceleration = createVector(0, 0);
    this.r = 4.0; // Boid size (half-width for triangle base)
    this.color = color(random(360), 85, 90); // Random hue, high saturation/brightness
  }

  // Add force to acceleration
  applyForce(force) {
    this.acceleration.add(force);
  }

  // --- Flocking Behavior ---
  flock(boids) {
    let sep = this.separate(boids); // Separation
    let ali = this.align(boids); // Alignment
    let coh = this.cohere(boids); // Cohesion

    // Arbitrarily weight these forces
    sep.mult(1.8);
    ali.mult(1.0);
    coh.mult(1.0);

    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  // --- Separation ---
  // Steer to avoid crowding local flockmates
  separate(boids) {
    let steer = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      // If it's a different boid and it's too close
      if (d > 0 && d < separationRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d); // Weight by distance (closer = stronger force)
        steer.add(diff);
        count++;
      }
    }
    // Average the steering vector
    if (count > 0) {
      steer.div(count);
    }

    // If the vector is non-zero, calculate steer force
    if (steer.mag() > 0) {
      steer.setMag(maxSpeed); // Desired velocity
      steer.sub(this.velocity); // Steering = Desired - Velocity
      steer.limit(maxForce);
    }
    return steer;
  }

  // --- Alignment ---
  // Steer towards the average heading of local flockmates
  align(boids) {
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other !== this && d < perceptionRadius) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count); // Average velocity
      sum.setMag(maxSpeed); // Desired velocity
      let steer = p5.Vector.sub(sum, this.velocity); // Steering = Desired - Velocity
      steer.limit(maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  // --- Cohesion ---
  // Steer to move towards the average position of local flockmates
  cohere(boids) {
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other !== this && d < perceptionRadius) {
        sum.add(other.position); // Add position
        count++;
      }
    }
    if (count > 0) {
      sum.div(count); // Average position
      return this.seek(sum); // Steer towards the average position
    } else {
      return createVector(0, 0);
    }
  }

  // --- Seek Target ---
  // Helper function to calculate steering force towards a target vector
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // Vector from position to target
    desired.setMag(maxSpeed); // Scale to maximum speed
    let steer = p5.Vector.sub(desired, this.velocity); // Steering = Desired - Velocity
    steer.limit(maxForce);
    return steer;
  }

  // --- Avoid Walls ---
  // Steer away from the hexagon boundary (approximated as a circle)
  avoidWalls() {
    let d = dist(
      this.position.x,
      this.position.y,
      hexagonCenter.x,
      hexagonCenter.y
    );

    // If the boid is near the edge (distance > radius - margin)
    if (d > hexagonRadius - boundaryMargin) {
      // Calculate a desired velocity pointing towards the center
      let desired = p5.Vector.sub(hexagonCenter, this.position);
      desired.normalize();

      // Scale the desired velocity based on how close to the edge we are
      // (Stronger force the further out it is, capped by boundarySteerForce)
      let scale = map(
        d,
        hexagonRadius - boundaryMargin,
        hexagonRadius,
        0,
        maxSpeed
      );
      desired.mult(scale);

      // Calculate steering force: Steering = Desired - Velocity
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(boundarySteerForce); // Apply a dedicated (potentially stronger) force for boundary avoidance
      this.applyForce(steer);
    }

    // Optional: A small nudge back towards center if *too* close to center?
    // Prevents excessive clumping sometimes, but can look unnatural.
    // if (d < 20) {
    //    let desired = p5.Vector.sub(this.position, hexagonCenter);
    //    desired.setMag(maxSpeed * 0.5);
    //    let steer = p5.Vector.sub(desired, this.velocity);
    //    steer.limit(maxForce * 0.5);
    //    this.applyForce(steer);
    // }
  }

  // --- Update Boid State ---
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(maxSpeed);
    // Update position
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  // --- Render Boid ---
  render() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + PI / 2; // Angle for pointing
    fill(this.color);
    noStroke();
    push(); // Apply transformations locally
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2); // Tip of the triangle
    vertex(-this.r, this.r * 2); // Bottom left
    vertex(this.r, this.r * 2); // Bottom right
    endShape(CLOSE);
    pop(); // Restore previous transformation state
  }
}

// --- Handle Window Resize ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  hexagonCenter = createVector(width / 2, height / 2);
  hexagonRadius = min(width, height) * 0.4;
  // Note: Boids aren't repositioned on resize, they'll just adapt to the new boundary
}
