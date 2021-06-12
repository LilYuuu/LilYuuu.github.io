class Person {
    constructor(x, y, point) {
        this.x = x
        this.y = y
            // target point(building/cube)
        this.target = point
        this.bIdx = 0

        // size of the image
        this.size = 20

        // unit speed per half second
        this.speed = 15

        var time = dist(this.x, this.y, point.x, point.y) / this.speed
            // x, y speed
        this.xSpeed = (point.x - this.x) / time
        this.ySpeed = (point.y - this.y) / time

        // rotation of the artwork
        this.angle = -1 * atan((point.x - this.x) / (point.y - this.y))
        if (point.y >= this.y) {
            this.angle += radians(180)
        }

        // buffer: to create a similar effect as frameRate(2)
        this.buffer = random(0, 60)
        this.state = 0
        this.visited = 0
    }

    // dest: 0 -- light, 1 -- cube
    move(dest) {
        // close enough to the target
        if (dist(this.x, this.y, this.target.x, this.target.y) <= this.size) {
            this.state = 1
        }

        if (this.state == 0) {

            // update speed every 0.5 second
            if (this.buffer % 30 == 0) {
                this.px = this.x
                this.py = this.y
                this.x += this.xSpeed
                this.y += this.ySpeed
            }

            imageMode(CENTER);

            push()
            translate(this.x, this.y);
            rotate(this.angle);


            // left footprint
            if (this.buffer < 30) {
                image(left, -2, 0, this.size, this.size)
                image(right2, 2, this.size * 1.5, this.size, this.size)

                if (dest == 1) {
                    image(lightpng, -0.5, -24, 40, 40)
                    noStroke()
                    fill(255)
                    //ellipse(0.5, -12, 1, 1)
                }
            }

            // right footprint
            else if (this.buffer < 60) {
                image(right, 2, 0, this.size, this.size)
                image(left2, -2, this.size * 1.5, this.size, this.size)

                if (dest == 1) {
                    image(lightpng, 0.5, -24, 40, 40)
                    noStroke()
                    fill(255)
                    //ellipse(0.5, -12, 1, 1)
                }
            }

            pop()
            this.buffer++
                if (this.buffer >= 60) { this.buffer = 0 }
        }
    }

    updateTarget(point) {
        this.target = point
        var time = dist(this.x, this.y, point.x, point.y) / this.speed
            // x, y speed
        this.xSpeed = (point.x - this.x) / time
        this.ySpeed = (point.y - this.y) / time

        // rotation of the artwork
        this.angle = -1 * atan((point.x - this.x) / (point.y - this.y))
        if (point.y >= this.y) {
            this.angle += radians(180)
        }
    }

}