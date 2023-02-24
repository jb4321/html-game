// Map

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