scoreboard players set #red_active fwg 0
execute as @a at @s if block ~ ~-0.1 ~ minecraft:red_glazed_terracotta run scoreboard players set #red_active fwg 1
execute if score #red_active fwg matches 1 unless score #red_state fwg matches 1 run function fwg:red/open
execute unless score #red_active fwg matches 1 if score #red_state fwg matches 1 run function fwg:red/close
scoreboard players operation #red_state fwg = #red_active fwg
