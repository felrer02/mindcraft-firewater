execute store success score #registered fwg run execute align xyz positioned ~0.5 ~0.5 ~0.5 unless entity @e[type=minecraft:marker,tag=fwg.red_glass,distance=..0.1] run summon minecraft:marker ~ ~ ~ {Tags:["fwg.red_glass"]}
execute if score #registered fwg matches 1 run tellraw @s [{"text":"[FWG] ","color":"gold"},{"text":"Registered red stained glass device.","color":"red"}]
execute unless score #registered fwg matches 1 run tellraw @s [{"text":"[FWG] ","color":"gold"},{"text":"That red stained glass is already registered.","color":"gray"}]
