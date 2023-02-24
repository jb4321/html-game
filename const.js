// Constants

/*
    !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ ¡¢£¤¥¦§¨©ª«¬-®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ
    ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬ
    ŭU+016DŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƒơƷǺǻǼǽǾǿȘșȚțɑɸˆˇˉ˘˙˚˛˜˝;΄΅Ά·ΈΉΊΌΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώϐϴЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙ
    КЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџҐґ־אבגדהוזחטיךכלםמןנסעףפץצקרשתװױײ׳״ᴛᴦᴨẀẁẂẃẄẅẟỲỳ‐‒–—―‗‘’‚‛“”„‟†‡•…‧‰′″‵‹›‼‾‿⁀
    ⁄⁔⁴⁵⁶⁷⁸⁹⁺⁻ⁿ₁₂₃₄₅₆₇₈₉₊₋₣₤₧₪€℅ℓ№™Ω℮⅐⅑⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞←↑→↓↔↕↨∂∅∆∈∏∑−∕∙√∞∟∩∫≈≠≡≤≥⊙⌀⌂⌐⌠⌡─│┌┐└┘├┤┬┴┼═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬▀▁▄█▌▐░▒▓■□▪▫▬▲►▼◄◊○●◘◙◦☺☻☼♀
    ♂♠♣♥♦♪♫✓ﬁﬂ�
*/
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
