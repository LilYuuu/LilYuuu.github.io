// AR

var world;
var hiroMarker;

// images
var left
var right
var lightpng

var light
var buildings = []
var boids = []
var boids2 = [];
var people = []
var living_trees = []
var degrading_trees = [];

// graphics for the birds
let birdGraphics_left = [];
let birdGraphics_right = [];
let currentArtwork;

// changing targets for the birds
let idx = 0;
let idx2 = 3;
let target, target2;

var dragging = -2
var startPos

// sounds
var sound_birds;


function preload() {
    // images of footprint
    left = loadImage("images/left.png")
    right = loadImage("images/right.png")
    left2 = loadImage("images/_left.png")
    right2 = loadImage("images/_right.png")
    lightpng = loadImage("images/light.png")

    // images of birds
    for (let i = 1; i <= 5; i++) {
        let filename = "bird" + nf(i, 2) + ".png";
        birdGraphics_left.push(loadImage("images/" + filename));
        let filename2 = "_bird" + nf(i, 2) + ".png";
        birdGraphics_right.push(loadImage("images/" + filename2));
    }

    // sound of birds
    sound_birds = loadSound("sounds/birds.wav");

}

function setup() {
    // createCanvas(displayWidth, displayHeight)
    // create our world (this also creates a p5 canvas for us)

    world = new World('ARScene');
    console.log(displayWidth, displayHeight, width, height)

    //resizeCanvas(displayWidth, displayHeight);
    resizeCanvas(displayWidth, displayWidth * 3 / 4);
    console.log(displayWidth, displayHeight, width, height)
    // grab a reference to our two markers that we set up on the HTML side (connect to it using its 'id')
    hiroMarker = world.getMarker('hiro');


    noStroke()

    sound_birds.loop();

    // light
    light = new Point3D(displayWidth / 2, displayHeight / 2, 300)

    // boids
    for (var i = 0; i < 7; i++) {
        boids.push(new Boid(width / 2, height / 2));
        boids2.push(new Boid(width / 3, height / 3));
    }

    // buildings
    /*
    for (let i = 1; i < 4; i++) {
        var c = new Cube(new Point3D( displayWidth / 2 + 80 * i, displayHeight / 2 - 90, 20))
        buildings.push(c)
    }
    */
    buildings.push(new Cube(new Point3D(displayWidth / 2, displayHeight / 2 - 90, 20)))
    buildings.push(new Cube(new Point3D(displayWidth / 2, displayHeight / 2 + 90, 20)))
    buildings.push(new Cube(new Point3D(displayWidth / 2 - 90, displayHeight / 2, 20)))
    buildings.push(new Cube(new Point3D(displayWidth / 2 + 90, displayHeight / 2, 20)))
    buildings.push(new Cube(new Point3D(displayWidth / 2 - 90, displayHeight / 2 - 90, 20)))
    buildings.push(new Cube(new Point3D(displayWidth / 2 - 90, displayHeight / 2 + 90, 20)))
    buildings.push(new Cube(new Point3D(displayWidth / 2 + 90, displayHeight / 2 - 90, 20)))
    buildings.push(new Cube(new Point3D(displayWidth / 2 + 90, displayHeight / 2 + 90, 20)))

    // people
    for (var i = 0; i < buildings.length; i++) {
        var p = new Person(random(displayWidth / 4, displayWidth * 3 / 4), random(displayHeight / 4, displayHeight * 3 / 4), light)
        people.push(p)
        // var idx = int(random(0, buildings.length))
        p.bIdx = i
    }

    // trees
    for (var i = 0; i < 7; i++) {
        // trees.push(new Tree(random(displayWidth / 4, displayWidth * 3 / 4), random(displayHeight / 4, displayHeight * 3 / 4)))
        let a = random(360);
        let r = random(150, 200);
        let pos_X = cos(radians(a)) * r + light.x;
        let pos_Y = sin(radians(a)) * r + light.y;
        living_trees.push(new Tree(pos_X, pos_Y));
    }

    target = living_trees[0];
    target2 = living_trees[3];

}

function draw() {
    resizeCanvas(displayWidth, displayWidth * 3 / 4);
    background(150, 200)

    if (hiroMarker.isVisible() == true) {
        // get the position of this marker
        var hiroPosition = hiroMarker.getScreenPosition();
        // console.log(hiroPosition)
        light.x = width - hiroPosition.x * 1440 / 800;
        light.y = hiroPosition.y * 1440 / 800;
    }
    console.log(keyCode)


    // light
    light.display()
    if (keyIsDown(76) || keyIsDown(108)) {
        light.z -= 5
        light.size -= 1
    }
    if (keyIsDown(85) || keyIsDown(117)) {
        light.z += 5
        light.size += 1
    }
    light.size = constrain(light.size, 1, 30)

    // projection
    for (let i = 0; i < buildings.length; i++) {
        var c = buildings[i]
        c.updateVertex()
        c.displayProjection(light)
        // c.displayWindow(light)
    }

    // footprint
    for (let i = 0; i < people.length; i++) {
        var p = people[i]

        if (p.visited != 1) {
            p.updateTarget(light)
            p.move(0)
        } else {
            p.updateTarget(buildings[p.bIdx].center)
            p.move(1)
        }

        if (p.state == 1) {
            if (p.visited == 0) {
                p.visited = 1
            } else {
                buildings[p.bIdx].displayWindow(light)
            }
            p.state = 0
        }
    }

    // trees
    for (var i = 0; i < living_trees.length; i++) {
        var t = living_trees[i];
        t.update(light);
        if (dist(t.x, t.y, light.x, light.y) > 300) {
            //console.log(dist(t.x, t.y, light.x, light.y));

            t.done = true;
        }
        if (t.done && t.originalLen >= 40) {
            degrading_trees.push(t);
            // if (t.originalLen <= 3) {
            living_trees.splice(i, 1);
            // }
            // t.degrade();
        } else {
            t.display();
        }
    }

    if (living_trees.length < 7) {
        let a = random(360);
        let r = random(150, 200);
        let pos_X = cos(radians(a)) * r + light.x;
        let pos_Y = sin(radians(a)) * r + light.y;
        living_trees.push(new Tree(pos_X, pos_Y));
    }

    for (let i = 0; i < degrading_trees.length; i++) {
        let t = degrading_trees[i];
        if (t.originalLen <= 3) {
            degrading_trees.splice(i, 1);
        }
        t.update(light);
        t.degrade();

    }

    // building
    for (let i = 0; i < buildings.length; i++) {
        var c = buildings[i]
        c.display()

        // if mouse is over the cube
        if (dist(mouseX, mouseY, c.center.x, c.center.y) < c.w / 2) {
            // press mouse to spin the cube
            if (mouseIsPressed) {
                //c.a += PI / 180
                c.a += radians(1)
                // update angle
                if (c.a >= radians(360)) {
                    c.a = 0
                }
            }
        }
    }

    // boids
    if (frameCount % 1000 == 0) {
        idx++;
        idx2++;

        if (idx >= living_trees.length) {
            idx = 0;
        }
        if (idx2 >= living_trees.length) {
            idx2 = 0;
        }
        target = living_trees[idx];
        target2 = living_trees[idx2];
    }

    for (var i = 0; i < boids.length; i++) {
        var b = boids[i];
        b.flock(boids, target);
        b.update();
        b.checkEdges();
        b.display();
    }

    for (var i = 0; i < boids2.length; i++) {
        var b2 = boids2[i];
        b2.flock(boids2, target2);
        b2.update();
        b2.checkEdges();
        b2.display();
    }

}

function mouseDragged() {
    // drag one cube at a time
    // keep track of which cube is being dragged
    // if dragging is -2, no cube or light has been selected
    if (dragging == -2) {
        for (let i = 0; i < buildings.length; i++) {
            var c = buildings[i]
            if (dist(mouseX, mouseY, c.center.x, c.center.y) < c.w / 2) {
                dragging = i
                startPos = [c.center.x, c.center.y]
            }
        }
        if (dist(mouseX, mouseY, light.x, light.y) < 20) {
            dragging = -1
        }
    } else if (dragging == -1) {
        // drag and move light
        light.x = mouseX
        light.y = mouseY
    } else {
        var c = buildings[dragging]
        // drag and move building
        c.center.x = mouseX
        c.center.y = mouseY
    }
}

function mouseReleased() {
    if (dragging >= 0) {
        // if the building is moved too far away from the person
        // the person needs to get light again
        if (dist(startPos[0], startPos[1], mouseX, mouseY) >= 250) {
            people[dragging].visited = 0
        }
    }
    dragging = -2
}