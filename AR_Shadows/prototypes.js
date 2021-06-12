class Point2D {
  constructor(x, y) {
    this.x = x,
      this.y = y
  }

  display() {
    fill(255)
    ellipse(this.x, this.y, 5, 5)
  }
}

class Point3D {
  constructor(x, y, z) {
    this.x = x,
    this.y = y,
    this.z = z,
    this.size = 10
  }

  display() {
    fill(255)
    noStroke()
    image(lightpng, this.x, this.y, 120, 120)
    ellipse(this.x, this.y, this.size, this.size)
  }
}

class Vertex2D {
  constructor(x, y) {
    this.x = x,
    this.y = y
  }
}

class Vertex3D {
  constructor(x, y, z) {
    this.x = x,
    this.y = y,
    this.z = z
  }
  
  getProjectionPoint(light) {
    var lx = light.x
    var ly = light.y
    var lz = light.z
    var x = this.x
    var y = this.y
    var z = this.z

    //parameter t
    var t

    // compute the vector difference
    var dx = lx - x
    var dy = ly - y
    var dz = lz - z
    /*
    var xt = x + dx * t
    var yt = y + dy * t
    var zt = z + dz * t = 0
    */
    t = - z / dz
    var xt = x + dx * t
    var yt = y + dy * t
    return new Point2D(xt, yt)
  }
}