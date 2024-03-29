#!/usr/bin/python3
# coding=utf8


js_files = ["noise.js", "misc.js", "map.js", "creature.js", "player.js", "const.js", "renderer.js", "main.js"]
css_files = ["main_style.css"]

if __name__ == "__main__":
    f = open("game.html", "w")

    f.write("<!DOCTYPE html>\n<style>\n\n")
    
    for filename in css_files:
        f1 = open(filename, "r")
        f.write(f1.read() + "\n\n")
        f1.close()

    f.write("</style>\n")

    f.write("""<html>
    <head>
        <meta charset="UTF-8">
        <title class="selected"> One File </title>
        <link rel="icon" href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGRSURBVDhPjZM9LENRGIbv9bfaDbogQSIkUptBdJBIxMDCpkRCm0gMFpvBwKJNNNTGYjCRSspiI5EwiARTEztzyfW8PedcbtXPmzz9vnO+n957z3d8r0rBgdeFmYcxaNUeKsE9LPlTFRsqbEBhI2YTUpWNn7UFyzQqa1GnH4qbMKegYgW2oZ8kX8iHnI2loWBrzBOwyGIW4BlGKbrRfrXI68WcQAtkyUv5bHazuIV3GFAxex34azAO0hGsEnuwTS6hHnr0Ckm72LHF7fhXMAENlkntEWuzT7cLqkmqQQKkfWvXodm4EWlPMcnlJtQgZnzvztpha2vJxVxuTA0C438e6T/kcgM10JBIGiDpzNpacjGXW1KDovG9aWtX4NW4Eb2AYpLLLaqBvqiOcE5HxFd+xI/DIbyBhkd+nNgTOX34s6CavBukDGYR/hokFR+DBilDXto10FgWYAj0j3uQJ+Eaq7hGWfMyA5qLcxghXg6/PEm6TBugWf9Nkcv07eho1InRdR4Eja2kV7qAHIVfrrPnfQDq2nHJefonxAAAAABJRU5ErkJggg==">
    </head>

    <body>
        <header style="text-align: center;"> 1File  </header> <br>
        
        <div class="main">
            <div class="column">
                <div class="column_element">
                    <b>Health: <hp id = "health"  style="color:red">100/100</b></hp><br>
                    <b>Hunger: <hp id = "hunger"  style="color:yellow">100/100</b></hp><br>
                    <b> Pos : <pos id = "pos"><pos> </b>
                </div>
                <div class="column_element" id = "inventory"  > </div>
            </div>
            <div id="game" class="game , unselectable">
                
                <div style="font-size:24px; color: white;max-width : 700px;word-wrap: break-word;"> !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ ¡¢£¤¥¦§¨©ª«¬-®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƒơƷǺǻǼǽǾǿȘșȚțɑɸˆˇˉ˘˙˚˛˜˝;΄΅Ά·ΈΉΊΌΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώϐϴЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџҐґ־אבגדהוזחטיךכלםמןנסעףפץצקרשתװױײ׳״ᴛᴦᴨẀẁẂẃẄẅẟỲỳ‐‒–—―‗‘’‚‛“”„‟†‡•…‧‰′″‵‹›‼‾‿⁀⁄⁔⁴⁵⁶⁷⁸⁹⁺⁻ⁿ₁₂₃₄₅₆₇₈₉₊₋₣₤₧₪€℅ℓ№™Ω℮⅐⅑⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞←↑→↓↔↕↨∂∅∆∈∏∑−∕∙√∞∟∩∫≈≠≡≤≥⊙⌀⌂⌐⌠⌡─│┌┐└┘├┤┬┴┼═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬▀▁▄█▌▐░▒▓■□▪▫▬▲►▼◄◊○●◘◙◦☺☻☼♀♂♠♣♥♦♪♫✓ﬁﬂ�</div>
                </p>
            </div>
            <div class="column" >
                <div class ="column_element" id="crafting" ></div>
            </div>
        </div>
        <button class="buttons" onclick="day = !day;renderGame()">Night</button>
    </body>
</html>

<script>\n\n""")
            
    for filename in js_files:
        f1 = open(filename, "r")
        f.write(f1.read() + "\n\n")
        f1.close()

    f.write("</script>\n")

    f.close()