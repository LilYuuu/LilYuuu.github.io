class Cube {
    constructor(center) {
        this.center = center
        this.w = 70
        this.a = 0
    }

    display() {
        fill(255)
        noStroke()
        rectMode(CENTER)
        push()
        translate(this.center.x, this.center.y)
        rotate(this.a)
        rect(0, 0, this.w, this.w)
        pop()
    }

    updateVertex() {
        var r = this.w * Math.sqrt(2) / 2

        // update each vertex's coordinate based on rotation angle 
        this.vtxul = new Vertex2D(this.center.x + r * Math.sin(PI * 5 / 4 - this.a), this.center.y + r * Math.cos(PI * 5 / 4 - this.a))
        this.vtxdl = new Vertex2D(this.center.x + r * Math.sin(PI * 7 / 4 - this.a), this.center.y + r * Math.cos(PI * 7 / 4 - this.a))
        this.vtxdr = new Vertex2D(this.center.x + r * Math.sin(PI / 4 - this.a), this.center.y + r * Math.cos(PI / 4 - this.a))
        this.vtxur = new Vertex2D(this.center.x + r * Math.sin(PI * 3 / 4 - this.a), this.center.y + r * Math.cos(PI * 3 / 4 - this.a))

        // match the four corners (up left, down left, etc.)
        if (this.a >= radians(45)) {
            for (var i = 0; i < this.a / radians(45) - 1; i += 2) {

                var temp = this.vtxul
                this.vtxul = this.vtxdl
                this.vtxdl = this.vtxdr
                this.vtxdr = this.vtxur
                this.vtxur = temp
            }
        }

    }

    /*getProjectionPoint(vtx1, vtx2) {
      // vtx1, vtx2: two adjacent vertices
      var p = []
      p.push(vtx1)
      p.push(vtx2)

      // two corresponding projection points
      var vtx3D1 = new Vertex3D(vtx1.x, vtx1.y, this.center.z + this.w / 2)
      var vtx3D2 = new Vertex3D(vtx2.x, vtx2.y, this.center.z + this.w / 2)
      p.push(vtx3D2.getProjectionPoint(light))
      p.push(vtx3D1.getProjectionPoint(light))

      return p
    }*/

    displayProjection() {

        var allvtx = [this.vtxul, this.vtxdl, this.vtxdr, this.vtxur]
        var vtxProjection = []

        for (let i = 0; i < 4; i++) {
            var vtx3D = new Vertex3D(allvtx[i].x, allvtx[i].y, this.center.z + this.w / 2)
            vtxProjection.push(vtx3D.getProjectionPoint(light))
        }

        fill(50, 150)
        noStroke()
        beginShape()
        for (var i = 0; i < 4; i++) {
            vertex(vtxProjection[i].x, vtxProjection[i].y)
        }
        endShape()

        // display the projection on each side (four sides in total)
        for (let i = 0; i < 4; i++) {
            var p = []
            if (i == 3) {
                p.push(allvtx[3])
                p.push(allvtx[0])
                p.push(vtxProjection[0])
                p.push(vtxProjection[3])
            } else {
                p.push(allvtx[i])
                p.push(allvtx[i + 1])
                p.push(vtxProjection[i + 1])
                p.push(vtxProjection[i])
            }

            // draw the quadrilateral
            // projection
            beginShape()
            for (var j = 0; j < 4; j++) {
                vertex(p[j].x, p[j].y)
            }
            endShape()
        }
    }

    addWindow(vtx1, vtx2) {
        var window_vtx3D = []

        var x1 = vtx1.x / 5 + vtx2.x * 4 / 5
        var x2 = vtx1.x * 4 / 5 + vtx2.x / 5
        var y1 = vtx1.y / 5 + vtx2.y * 4 / 5
        var y2 = vtx1.y * 4 / 5 + vtx2.y / 5

        // one window's four vertices
        window_vtx3D.push(new Vertex3D(x1, y1, this.center.z))
        window_vtx3D.push(new Vertex3D(x1, y1, this.center.z + this.w / 3))
        window_vtx3D.push(new Vertex3D(x2, y2, this.center.z + this.w / 3))
        window_vtx3D.push(new Vertex3D(x2, y2, this.center.z))

        return window_vtx3D
    }

    getWindowProjection(vtx1, vtx2) {
        var window_vtx3D = this.addWindow(vtx1, vtx2)
        var w = []
        for (let i = 0; i < 4; i++) {
            w.push(window_vtx3D[i].getProjectionPoint(light))
        }
        return w
    }

    addFrameProjection(w) {
        var x = []
        var y = []

        for (let i = 0; i < 4; i++) {
            x.push(w[i].x)
            y.push(w[i].y)
        }

        push();
        stroke(50, 150)
        strokeWeight(2)
        line((x[0] + x[1]) / 2, (y[0] + y[1]) / 2, (x[2] + x[3]) / 2, (y[2] + y[3]) / 2)
        line((x[1] + x[2]) / 2, (y[1] + y[2]) / 2, (x[3] + x[0]) / 2, (y[3] + y[0]) / 2)
        pop();
    }

    closestVertex(light) {
        var allvtx = [this.vtxul, this.vtxdl, this.vtxdr, this.vtxur]
        var cv = 0
        var cd = dist(this.vtxul.x, this.vtxul.y, light.x, light.y)
        for (var i = 1; i < 4; i++) {
            if (dist(allvtx[i].x, allvtx[i].y, light.x, light.y) <= cd) {
                cd = dist(allvtx[i].x, allvtx[i].y, light.x, light.y)
                cv = i
            }
        }
        return cv
    }

    findAngle(p1, p2, p3) {
        var angle = atan2(p3.y - p1.y, p3.x - p1.x) - atan2(p2.y - p1.y, p2.x - p1.x)
        if (angle < 0) {
            angle += radians(360)
        }
        return angle
    }

    displayWindow(light) {
        var allvtx = [this.vtxul, this.vtxdl, this.vtxdr, this.vtxur]
        var windows = []
        for (let i = 0; i < 4; i++) {
            if (i == 3) {
                var w = this.getWindowProjection(allvtx[3], allvtx[0])
            } else {
                var w = this.getWindowProjection(allvtx[i], allvtx[i + 1])
            }
            windows.push(w)
        }

        // compare the position of the light with respect to the cube
        // the light is outside of the cube
        if (dist(this.center.x, this.center.y, light.x, light.y) > this.w * Math.sqrt(2) / 2) {
            // find the closest vertex with respect to the light
            var cv = this.closestVertex(light)
                // two adjacent vertices
            var v1 = cv - 1
            var v2 = cv + 1
            if (cv == 0) { v1 = 3 }
            if (cv == 3) { v2 = 0 }

            // compute the angles between the light, the closest vertex, and its two adjacent vertices
            var angle1 = this.findAngle(allvtx[cv], light, allvtx[v1])
            var angle2 = this.findAngle(allvtx[cv], allvtx[v2], light)

            // if both are less tha 180 degree, then only two sides of windows need to be displayed      
            if (angle1 < radians(180) && angle2 < radians(180)) {
                if (cv == 0) {
                    windows.splice(3, 1)
                    windows.splice(0, 1)
                } else {
                    windows.splice(cv - 1, 2)
                }
            }
            // if one of the angles is greater than 180 degree, then need to display three sides
            else {
                if (angle1 >= radians(180)) {
                    windows.splice(cv, 1)
                } else {
                    if (cv == 0) {
                        windows.splice(3, 1)
                    } else {
                        windows.splice(cv - 1, 1)
                    }
                }
            }
        }

        // display the windows
        for (let i = 0; i < windows.length; i++) {
            var w = windows[i]
            fill(255, 200)
            noStroke()
            beginShape()
            for (var j = 0; j < 4; j++) {
                vertex(w[j].x, w[j].y)
            }
            endShape()
            this.addFrameProjection(w)
        }
    }

}