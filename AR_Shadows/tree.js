class Tree {
    constructor(x, y) {
        this.x = x
        this.y = y

        this.originalLen = 3
        this.len = 3
        this.minLen = 10
        this.angle = PI / 4

        this.projectionAngle = 0

        this.done = false;

        this.originalThickness = 2;
        this.thickness = 2;
        // this.minThickness = 2;
    }

    branch(len, thickness) {
        stroke(70)
            // strokeWeight(2);
        strokeWeight(thickness);

        line(0, 0, 0, -len)

        translate(0, -len)

        len *= 2 / 3;
        thickness = map(len, 1, 60, 2, 4);

        if (len > this.minLen) {
            push();
            rotate(this.angle + noise(len) * 0.02 - 0.01);
            // this.branch(len + random(-0.3, 0.3));
            this.branch(len + random(-0.3, 0.3), thickness + random(-0.3, 0.3));
            pop();

            push();
            rotate(-this.angle + noise(len) * 0.02 - 0.01);
            // this.branch(len + random(-0.3, 0.3));
            this.branch(len + random(-0.3, 0.3), thickness + random(-0.3, 0.3));
            pop();

            push();
            rotate(this.angle / 2 + noise(len) * 0.02 - 0.01);
            // this.branch(len + random(0, 0.5));
            this.branch(len + random(-0.3, 0.3), thickness + random(-0.3, 0.3));
            pop();

        }
    }

    degrade() {
        push()
        translate(this.x, this.y)

        // rotate the whole tree based on light direction
        rotate(this.projectionAngle)

        this.branch(this.len, this.thickness);

        if (this.originalLen >= 3) {

            // growing speed of the tree
            this.originalLen -= 0.1;
            this.originalThickness -= 0.02;
        }

        // if (this.originalThickness >= 2) {
        //     this.originalThickness -= 0.1;
        // }
        pop()
    }

    display() {
        push()
        translate(this.x, this.y)

        // rotate the whole tree based on light direction
        rotate(this.projectionAngle)

        this.branch(this.len, this.thickness);

        if (this.originalLen <= 60) {

            // growing speed of the tree
            this.originalLen += 0.1;
            this.originalThickness += 0.02;
        }
        pop()
    }

    update(light) {
        var dis = dist(this.x, this.y, light.x, light.y)
        var scale = dis / 200 + 0.5

        // the further the light, the longer the projection
        this.len = this.originalLen * scale
        this.minLen = 10 * scale

        this.thickness = this.originalThickness;

        // recursion angle smaller 
        this.angle = PI / 4 / scale

        // calculate the angle the whole tree need to rotate
        this.projectionAngle = -atan2(light.x - this.x, light.y - this.y)
    }
}