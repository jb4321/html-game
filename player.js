// Player

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
