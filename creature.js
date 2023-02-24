// Creature

class Creature {
    constructor(pos, direction = 0) {
        this.pos = pos
        this.direction = direction
        this.name = "deafult"
    }
    moveOneTo(vector) {
        let distance_vector = this.pos.subResult(vector)
        if (distance_vector.isEqualTo(new Vector(0, 0))) {
            return 0
        }
        else {
            if (randomChances(0.5)) {
                if (distance_vector.x > 0) {
                    return 4
                    //return new Vector(-1,0)
                }
                else {
                    return 2
                    //return new Vector(1,0)
                }
            }
            else {
                if (distance_vector.y > 0) {
                    return 1
                    //return new Vector(0,-1)
                }
                else {
                    return 3
                    //return new Vector(0,1)
                }
            }
        }

    }
    rotateTo(new_direction) {
        this.direction = new_direction
    }
    rotateFor(steps) {
        steps = (steps % 4 + 4) % 4
        if (this.direction > 0) {
            this.rotateTo((this.direction - 1 + steps) % 4 + 1)
        }
    }
    move() {
        let new_vector = new Vector(this.pos.x, this.pos.y)
        new_vector = directionVector(this.direction, new_vector)

        let collision = checkCollisions(new_vector)
        if (!collision) {
            this.pos = new_vector
            return true

        }
        this.rotateFor(-2)
        return false
        //True if moved, false if didnt
    }
    teleport(vector) {
        let collision = checkCollisions(vector)
        if (!collision) {
            player.pos = vector
            return true
        }
        return false
        //True if moved, false if didnt
    }
    update() {
        this.rotateTo(this.moveOneTo(player.pos))
        this.move()
    }

}