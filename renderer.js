// Rendering

class RenderInfo {
    constructor(background_color = "white",color = "black",sign = ",") {
        this.background_color = background_color
        this.color = color
        this.sign = sign
    }
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

function render(){
    renderStats()
    renderInventory()
    renderGame()
}
