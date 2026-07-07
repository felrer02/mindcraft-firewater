execute as @e[type=minecraft:marker,tag=fwg.red_glass] at @s if block ~ ~ ~ minecraft:air run setblock ~ ~ ~ minecraft:red_stained_glass replace
execute as @e[type=minecraft:marker,tag=fwg.red_glass] at @s run playsound minecraft:block.glass.place block @a[distance=..16] ~ ~ ~ 0.25 1.1
