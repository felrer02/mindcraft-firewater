tag @s remove fwg.red_scan_frontier
tag @s add fwg.red_scan_visited
scoreboard players add #scan_total fwg 1
execute store success score #registered fwg run execute unless entity @e[type=minecraft:marker,tag=fwg.red_glass,distance=..0.1] run summon minecraft:marker ~ ~ ~ {Tags:["fwg.red_glass"]}
execute if score #registered fwg matches 1 run scoreboard players add #registered_total fwg 1
function fwg:builder/bfs/add_neighbors
