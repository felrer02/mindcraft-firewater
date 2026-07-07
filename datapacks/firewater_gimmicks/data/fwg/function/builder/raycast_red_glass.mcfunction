scoreboard players add @s fwg 1
execute if block ~ ~ ~ minecraft:red_stained_glass run function fwg:builder/register_red_glass_at_pos
execute unless block ~ ~ ~ minecraft:red_stained_glass if score @s fwg matches ..12 positioned ^ ^ ^0.5 run function fwg:builder/raycast_red_glass
execute unless block ~ ~ ~ minecraft:red_stained_glass if score @s fwg matches 13.. run tellraw @s [{"text":"[FWG] ","color":"gold"},{"text":"Look at a red stained glass block within 6 blocks, then run this function again.","color":"gray"}]
