function fwg:red/close
scoreboard players set #red_active fwg 0
scoreboard players set #red_state fwg 0
tellraw @s [{"text":"[FWG] ","color":"gold"},{"text":"Red glass devices restored.","color":"red"}]
