scoreboard players add @s fwg 1
execute if block ~ ~ ~ minecraft:red_stained_glass run function fwg:builder/register_red_glass_at_pos
execute unless block ~ ~ ~ minecraft:red_stained_glass if score @s fwg matches ..12 positioned ^ ^ ^0.5 run function fwg:builder/raycast_red_glass
execute unless block ~ ~ ~ minecraft:red_stained_glass if score @s fwg matches 13.. run tellraw @s [{"text":"[FWG] ","color":"gold"},{"text":"6블록 안의 빨간 색유리를 바라보고 다시 실행하세요.","color":"gray"}]
