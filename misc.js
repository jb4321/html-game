// Misc

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    checkBound() {
        return this.x < 0 || this.x >= size || this.y < 0 || this.y >= size
    }
    toString() {
        return `${this.x},${this.y}`
    }
    direction() {
        return new Vector(Math.sign(this.x), Math.sign(this.y))
    }
    distanceTo(vector) {
        return Math.sqrt(Math.pow(Math.abs(this.x - vector.x), 2) + Math.pow(Math.abs(this.y - vector.y), 2))
    }
    sumResult(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y)
    }
    subResult(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y)
    }
    isEqualTo(vector) {
        if (this.x == vector.x && this.y == vector.y) {
            return true
        }
        return false
    }
}

function directionVector(direction_num, vector) {
    let new_vector = vector
    // 0 Vector(0,0)
    // 1 Vector(0,-1) "UP"
    // 2 Vector(1,0) "RIGHT"
    // 3 Vector(0,1) "DOWN"
    // 4 Vector(-1,0) "LEFT"
    if (direction_num == 1) { new_vector.y -= 1; }
    if (direction_num == 2) { new_vector.x += 1; }
    if (direction_num == 3) { new_vector.y += 1; }
    if (direction_num == 4) { new_vector.x -= 1; }
    return new_vector
}

function mapCellFromVector(vector){
    let chunk_string = posToChunk(vector).toString()
    
    if (chunk_string in map){
        local_pos_vector = toLocalPos(vector)
        return map[chunk_string][local_pos_vector.x][local_pos_vector.y]
    }
    else {
        return "none"
    }
    
}

function fixVectorBounds(vector) {
    new_vector = [vector.x,vector.y]
    for(let i = 0; i < 2; i++) {
        if(new_vector[i] < 0){new_vector[i] = (new_vector[i] % size) + size }
        if(new_vector[i] >= size) {new_vector[i] = new_vector[i] % size }
    }
    return new Vector(new_vector[0],new_vector[1])
}

function posToChunk(vector){
    return new Vector(Math.floor(vector.x / 16),Math.floor(vector.y / 16))
}

function toLocalPos(vector){
    new_vector = new Vector(vector.x % 16, vector.y % 16)
    if(vector.x < 0){
        new_vector.x = (new_vector.x + 16) % 16
    }
    if(vector.y < 0){
        new_vector.y = (new_vector.y + 16) % 16
    }
    return new_vector
}
