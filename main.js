/* PLAN
    
*/


//CLASSES

//Game 


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
