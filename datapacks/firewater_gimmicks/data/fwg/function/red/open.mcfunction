execute as @e[type=minecraft:marker,tag=fwg.red_glass] at @s if block ~ ~ ~ minecraft:red_stained_glass run setblock ~ ~ ~ minecraft:air replace
execute as @e[type=minecraft:marker,tag=fwg.red_glass] at @s run playsound minecraft:block.glass.break block @a[distance=..16] ~ ~ ~ 0.35 1.2
