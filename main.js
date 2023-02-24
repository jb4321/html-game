
/* PLAN
    
*/


//CLASSES

//Noise
function Grad(x, y) {
    this.x = x; this.y = y;
}

Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
}; 
class Noise{
    /*
    * A speed-improved perlin and simplex noise algorithms for 2D.
    *
    * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
    * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
    * Better rank ordering method by Stefan Gustavson in 2012.
    * Converted to Javascript by Joseph Gentle.
    *
    * Version 2012-03-09
    *
    * This code was placed in the public domain by its original author,
    * Stefan Gustavson. You may use it as you see fit, but
    * attribution is appreciated.
    *
    * 2022-04-04
    * Added octaves and some modifications by jb431
    */
    constructor(c_seed = 0)
    {
        this.seed_noise(c_seed)
    }
    // Skewing and unskewing factors for 2, 3, and 4 dimensions
    F2 = 0.5*(Math.sqrt(3)-1)
    G2 = (3-Math.sqrt(3))/6

    grad3 = [new Grad(1,1),new Grad(-1,1),new Grad(1,-1),new Grad(-1,-1)]
    p = [151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

    // To remove the need for index wrapping, double the permutation table length
    perm = new Array(512);
    gradP = new Array(512);

    seed_noise(seed){
        if(seed > 0 && seed < 1) {
            // Scale the seed out
            seed *= 65536;
        }      
        seed = Math.floor(seed);
            if(seed < 256) {
            seed |= seed << 8;
        }
    
        for(var i = 0; i < 256; i++) {
            var v;
            if (i & 1) {
                v = this.p[i] ^ (seed & 255);
            } else {
                v = this.p[i] ^ ((seed>>8) & 255);
            }

            this.perm[i] = this.perm[i + 256] = v;
            this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 4];
        } 
    }
    // 2D Simplex Noise
    simplex2(xin,yin) {
        var n0, n1, n2; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin+yin)*this.F2; // Hairy factor for 2D
        var i = Math.floor(xin+s);
        var j = Math.floor(yin+s);
        var t = (i+j)*this.G2;
        var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
        var y0 = yin-j+t;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1=1; j1=0;
        } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            i1=0; j1=1;
        }
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        var x1 = x0 - i1 + this.G2; // Offsets for middle corner in (x,y) unskewed coords
        var y1 = y0 - j1 + this.G2;
        var x2 = x0 - 1 + 2 * this.G2; // Offsets for last corner in (x,y) unskewed coords
        var y2 = y0 - 1 + 2 * this.G2;

        // Work out the hashed gradient indices of the three simplex corners
        i &= 255;
        j &= 255;
        var gi0 = this.gradP[i+this.perm[j]];
        var gi1 = this.gradP[i+i1+this.perm[j+j1]];
        var gi2 = this.gradP[i+1+this.perm[j+1]];
        // Calculate the contribution from the three corners
        var t0 = 0.5 - x0*x0-y0*y0;
        if(t0<0) {
            n0 = 0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1*x1-y1*y1;
        if(t1<0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot2(x1, y1);
        }
        var t2 = 0.5 - x2*x2-y2*y2;
        if(t2<0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot2(x2, y2);
        }
        
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].

        return 70 * (n0 + n1 + n2);
    }
    // ##### Perlin noise functions
    fade(t) {
        return t*t*t*(t*(t*6-15)+10);
    }
    lerp(a, b, t) {
        return (1-t)*a + t*b;
    }
    // 2D Perlin Noise
    perlin2(x, y) {
        // Find unit grid cell containing point
        var X = Math.floor(x), Y = Math.floor(y);
        // Get relative xy coordinates of point within that cell
        x = x - X; y = y - Y;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255; Y = Y & 255;

        // Calculate noise contributions from each of the four corners
        var n00 = this.gradP[X+this.perm[Y]].dot2(x, y);
        var n01 = this.gradP[X+this.perm[Y+1]].dot2(x, y-1);
        var n10 = this.gradP[X+1+this.perm[Y]].dot2(x-1, y);
        var n11 = this.gradP[X+1+this.perm[Y+1]].dot2(x-1, y-1);

        // Compute the fade curve value for x
        var u = this.fade(x);

        // Interpolate the four results
        return this.lerp(
            this.lerp(n00, n10, u),
            this.lerp(n01, n11, u),
            this.fade(y));
    };
    // 2D octaves perlin or simplex
    octave2(x,y,num_iterations,persistence,scale,is_simplex = false){
        let max_amp = 0
        let amp = 1
        let freq = 1
        let noise_value = 0
        for(let i = 0; i < num_iterations; i++){
            if (is_simplex){
                noise_value += this.simplex2(x * freq, y * freq) * amp
            }
            else{
                noise_value += this.perlin2(x * freq, y * freq) * amp
            }
            
            max_amp += amp
            amp *= persistence
            freq *= 2
        }
        noise_value /= max_amp

        return noise_value
    }
}

//Game 
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
class SquareCell {
    constructor(ground_name = "none", game_object_name = "none") {
        this.ground = {
            name : ground_name,
            get info(){
                return ground_info[this.name]
            }
        }
        

        this.game_object = {
            name : game_object_name,
            get info(){
                return game_object_info[this.name]
            }
        }
    }
    getRenderInfo(){
        if(this.isEmpty()){
            return new RenderInfo(this.ground.info,this.ground.info)
        }
        else {
            return new RenderInfo(this.ground.info,this.game_object.info.color,this.game_object.info.sign)
        }
    }
    isBlocking(){
        return this.ground.name == "water" || this.game_object.info.blocking
    }
    isEmpty(){
        return this.game_object.name == "none"
    }
}
class RenderInfo {
    constructor(background_color = "white",color = "black",sign = ",") {
        this.background_color = background_color
        this.color = color
        this.sign = sign
    }
}

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

class Player extends Creature{
    constructor(pos){
        super(pos)
    
        this.inventory = {}
        this.selected_item = ""
        this.max_capacity = 50

        this.max_health = 100
        this.max_hunger = 100

        this.health = 100
        this.hunger = 100
    }
    
    kill(){
        this.inventory = {}
        this.health = 100
        this.hunger = 100
        teleport(new Vector())
    }
    update(){
        if (this.hunger > 0){
            this.hunger -= 0.25
        }
        else{
            //this.health -= 1
            if(this.health <= 0){
                this.kill()
            } 
        }
    }
    
    addItem(item_name,count = 1){
        if(count > 0){
            if(item_name in this.inventory){
                this.inventory[item_name] += count
            }
            else{
                this.inventory[item_name] = count
            }
        } 
        
    }
    removeItem(item_name,count = 1){
        this.inventory[item_name] -= count
        if (this.inventory[item_name] <= 0){
            delete this.inventory[item_name]
        }
    }
    
    feed(item){
        if(this.hunger < this.max_hunger){
            this.hunger += item_info[item].food
            this.removeItem(item)
            renderStats()
        }
    }
}

/*
    !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ ¡¢£¤¥¦§¨©ª«¬-®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ
    ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬ
    ŭU+016DŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƒơƷǺǻǼǽǾǿȘșȚțɑɸˆˇˉ˘˙˚˛˜˝;΄΅Ά·ΈΉΊΌΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώϐϴЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙ
    КЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџҐґ־אבגדהוזחטיךכלםמןנסעףפץצקרשתװױײ׳״ᴛᴦᴨẀẁẂẃẄẅẟỲỳ‐‒–—―‗‘’‚‛“”„‟†‡•…‧‰′″‵‹›‼‾‿⁀
    ⁄⁔⁴⁵⁶⁷⁸⁹⁺⁻ⁿ₁₂₃₄₅₆₇₈₉₊₋₣₤₧₪€℅ℓ№™Ω℮⅐⅑⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞←↑→↓↔↕↨∂∅∆∈∏∑−∕∙√∞∟∩∫≈≠≡≤≥⊙⌀⌂⌐⌠⌡─│┌┐└┘├┤┬┴┼═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬▀▁▄█▌▐░▒▓■□▪▫▬▲►▼◄◊○●◘◙◦☺☻☼♀
    ♂♠♣♥♦♪♫✓ﬁﬂ�
*/
//CONSTANT DECLARATIONS
const world_border_camera_effect = false
const biomes = {
    forest : [0.1],
    plains: [-0.4],
    rocky_desert : [-1]
}
const ground_info = {
    none : "#3d332c",
    barrens : "palegoldenrod",
    
    plains : "lawngreen",
    forest_path : "#73523f",
    forest : "#447733",
    water : "#0f5e9c",
    shallow_water : "#2389da",
    beach : "#e1bf92",
    rocky_desert: "darkgray"
}
const game_object_info = {
    none : {
        blocking:false
    },
    tree : {
        color:"brown",
        sign:"T",
        blocking:true,
        tool : "axe"
    },
    tall_grass : {
        color:"#8dbf39",
        sign:"▒",
        blocking:false
    },
    sticks : {
        color : "#6a4a3a",
        sign: "§"
    },
    rock : {
        color : "lightgray",
        sign : "Ώ",
        blocking : true,
        tool : "pickaxe"
    },
    stone : {
        color : "lightgray",
        sign : "•",
        blocking : false
    }
    
}
const item_info = {
    berries :{
        type : "food",
        food : 2
    },
    cut_grass : {
        type : "material"
    },
    flint_axe : {
        type : "tool",
        tool_type : "axe"   
    },
    flint_pickaxe : {
        type : "tool",
        tool_type : "pickaxe"
    }

}
const loot_tables = {
    sticks :{
        //"twigs" : {
        //    min: 1,
        //    max: 3
        //},
        stick: {
            min:0,
            max:1
        }
    },
    tall_grass : {
        cut_grass : {
            min:1,
            max:2
        }
    },
    tree : {
        log : {
            min:1,
            max:1
        }
    }
}
const crafting_recipes = {
    grass_rope : {
        count : 1,
        input : {cut_grass : 3}
    },
    flint_axe : {
        count : 1,
        input : {grass_rope : 2, stick : 1, stone : 1}
    },
    flint_pickaxe : {
        count : 1,
        input : {grass_rope : 2, stick : 1, stone : 2}
    }
}
const creature_info = {
    deafult: {
        sign: "C",
        color: "red"
    }
}
const size = 10

//INITIAL SCRIPT

let seed = 1
let rng = mulberry32(seed)
let map_noise = [new Noise(seed),new Noise(seed+1)]

let render_radius = 15
let player = new Player(new Vector())
let map = {}
let to_generate = {}
let updating_creatures = []

let turn = 0
let world_border = false

let day = true
let move_interval = 50 //time between moving
let can_move = true
let fly = false


start()
//FUNCTIONS

function start(){
    document.addEventListener('keydown', inputHandler);
    rng = mulberry32(seed)
    generateMap(seed)
    render()
}

function inputHandler(event) {
    let direction_number = 0
    switch (event.key) {
        case "ArrowUp":
            direction_number = 1
            break
        case "ArrowRight":
            direction_number = 2
            break
        case "ArrowDown":
            direction_number = 3
            break
        case "ArrowLeft":
            direction_number = 4
            break
            
        case " ":
            nextTurn()
            break
    }
    if (can_move) {
        
        if (direction_number > 0) {
            player.rotateTo(direction_number)
            collision = player.move()
            if (collision) {
                nextTurn()
            }
            can_move = false
            setTimeout(() => { can_move = true }, move_interval)
        }
    }
}


//Graphic


//Random

function mulberry32(a) {
    return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function randomChances(num) {
    return rng() <= num
}


//World Generation

function generateMap(gen_seed) {
    map = {}
    map_noise = [new Noise(gen_seed),new Noise(gen_seed+1)]
}
function generateChunk(chunk_num){
    let chunk = []
    for(let i = 0; i < 16;i++){
        column = []
        for(let j = 0; j < 16;j++){
            column[j] = generateCell(new Vector(chunk_num.x*16+i,chunk_num.y*16 + j))
            //generateCell(new Vector(chunk.x*16+i,chunk.y*16 + j))
        }
        chunk[i] = column
    }
    map[chunk_num.toString()] = chunk
}
function generateCell(vector) {
    let noise_values = []
    let noise_scale = 0.02
    map_noise.forEach(element => {
        noise_values.push(element.octave2(vector.x*noise_scale,vector.y*noise_scale,2,0.5,noise_scale))
    });

    biome = biomeDecider(noise_values[0])
    floor = biome
    let new_cell = new SquareCell()
    let game_object = "none"
    switch(biome){
        case "plains":
            if(randomChances(0.1)){
                game_object = "tall_grass"
            }
            break
        case "forest":
            if(randomChances(0.15)){
                game_object = "tree"
            }
            else if(randomChances(0.1)){
                game_object = "sticks"
            }
            break
        case "rocky_desert":
            if(randomChances(0.1)){
                game_object = "rock"
            }
            if(randomChances(0.1)){
                game_object = "stone"
            }
    }
    new_cell = new SquareCell(floor,game_object)
    if(vector.toString() in to_generate && game_object == "none"){
        new_cell.game_object.name = to_generate[vector.toString()]
    }
    return new_cell
}
function biomeDecider(noise_value){
    for(let key in biomes){
        if (biomes[key] <= noise_value){
            return key
        }
    }
}
function generatePatch(pos,size = 3,game_object){
    cen_pos = new Vector((size-1)/2,(size-1)/2)
    for(i = 0; i <= size;i++){
        for(j = 0; j <= size;j++){
            loc_pos = new Vector(i,j)
            if (cen_pos.distanceTo(loc_pos) <= 1){
                gen_pos = pos.sumResult(loc_pos)
                cell = mapCellFromVector(gen_pos)
                if(cell == "none"){
                    to_generate[gen_pos.toString()] = game_object
                }
                else{
                    cell.game_object.name = game_object
                }
                
            }            
        }
    }
}

//Vectors
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

//Inventory
function selectItem(item){
    if (item_info[item].type == "food"){
        player.feed(item)
    }
    else{
        player.selected_item = item
    }
    
    renderInventory()
}

//Crafting
function craftItem(recipe_name){
    if (checkRecipe(recipe_name,player.inventory)){
        for(let item in crafting_recipes[recipe_name].input){
            player.removeItem(item,crafting_recipes[recipe_name].input[item])
        }
        player.addItem(recipe_name,crafting_recipes[recipe_name].count)
        renderInventory()
    }
    
}
function checkRecipe(recipe_name){
    let loop_broken = false
    let input = crafting_recipes[recipe_name].input
    for (let item in input) {
        if (input[item] > player.inventory[item] || !(item in player.inventory) ){
            loop_broken = true
            break
        } 
    }
    return !loop_broken
}
function possibleCrafting(){
    let recipe_list = []
    for(let recipe in crafting_recipes){
        if (checkRecipe(recipe,player.inventory)){
            recipe_list.push(recipe)
        }
    }
    return recipe_list
}

//Loot table
function LootTable(loot_name){
    loot = loot_tables[loot_name]
    for(item in loot){
        player.addItem(item,getRandomInt(loot[item].min,loot[item].max+1))
    }
}

//Action
function mapInteraction(x, y) {
    var vector = new Vector(x, y)
    createCreature(vector)
}
function createCreature(vector) {
    let new_creature = new Creature(vector, 2)
    let collision = checkCollisions(vector)
    if (!collision) {
        updating_creatures.push(new_creature)
    }
}
function checkCollisions(vector) {
    let cell = mapCellFromVector(vector)
    if (cell == "none") {
        return true
    }
    if (cell.isBlocking() && !fly) {
        return true
    }
    for (let creature_index in updating_creatures) {
        if (updating_creatures[creature_index].pos.isEqualTo(vector)) {
            return true
        }
    }
    if (player.pos.isEqualTo(vector)) {
        return true
    }
    return false
    // True if you collided, False if you didn't.
}

function destroyObject(vector){
    let cell = mapCellFromVector(vector)
    if(cell != "none"){
        if(!cell.isEmpty() && (cell.game_object.info.tool in player.inventory || cell.game_object.info.tool == null )){
            if(cell.game_object.name in loot_tables){
                LootTable(cell.game_object.name)
            }
            else{
                player.addItem(cell.game_object.name)
            }
            cell.game_object.name = "none"
        }
    }
}
function placeObject(vector){
    let game_object = player.selected_item
    
    if(game_object in player.inventory && game_object in game_object_info){
        
        let cell = mapCellFromVector(vector)
        if(cell != "none"){
            if(cell.isEmpty() && !cell.isBlocking() ){
                player.removeItem(game_object)
                cell.game_object.name = game_object
                nextTurn()
            }
        }

    }
    
}

//NEXT TURN 
function nextTurn(){
    player.update()
    for (let creature_index in updating_creatures) {
        let creature = updating_creatures[creature_index]
        creature.update()
    }
    turn += 1
    render()
}

//Rendering
function render(){
    renderStats()
    renderInventory()
    renderGame()
}

function renderStats(){
    document.getElementById("health").innerHTML = `${Math.round(player.health)}/${player.max_health}`
    document.getElementById("hunger").innerHTML = `${Math.round(player.hunger)}/${player.max_hunger}`
    document.getElementById("pos").innerHTML = player.pos.toString()
}
function renderInventory(){
    let text = ""
    for (let item in player.inventory){
        let color
        if(item == player.selected_item){
            color = "lime"
        }
        else{
            color = "black"
        }
        text += `<label style="color:${color}" onclick="selectItem('${item}')"><b>${item}</b> x ${player.inventory[item]}</label> <br>`
    }
    document.getElementById("inventory").innerHTML = text
    let crafting_list = possibleCrafting()
    text = ""
    for(let i in crafting_list){
        let recipe = crafting_list[i]
        text += `<label onclick="craftItem('${recipe}')"><b>${recipe}</b> x ${crafting_recipes[recipe].count}</label> <br>`
    }
    document.getElementById("crafting").innerHTML = text
}
function renderGame() {
    let text = ""
    let render_grid =  document.getElementById("game")
    for(let i = -render_radius; i <= render_radius; i++){
        let row = ""
        for(let j = -render_radius; j <= render_radius; j++){
            let render_pos = new Vector(j+player.pos.x,i+player.pos.y)
            let cell =  mapCellFromVector(render_pos)
            let render_info
            if (cell=="none"){
                if(world_border){
                    render_info = new RenderInfo("black","black","e")
                }
                else{
                    generateChunk(posToChunk(render_pos))
                    render_info = mapCellFromVector(render_pos).getRenderInfo()
                }
            }
            else{
                render_info = cell.getRenderInfo()
            }
            
            if (player.pos.isEqualTo(render_pos)) {
                render_info.color = "orange"
                render_info.sign = "☺"
            }
            for (let creature_index in updating_creatures) {
                if (updating_creatures[creature_index].pos.isEqualTo(render_pos)) {
                    render_info.color = "red"
                    render_info.sign = "C"
                }
            }
            
            let background
            if (day){
                background = `background-color:${render_info.background_color};`
            }
            else {
                background = ""
            }

            let command = `mapInteraction(${render_pos.x},${render_pos.y})`
            row += `<label onclick= "${command}" style="${background}color:${render_info.color}" >${render_info.sign}</label>`
        }
        text += row + "<br>"
    }
    document.getElementById("game").innerHTML = text
}

