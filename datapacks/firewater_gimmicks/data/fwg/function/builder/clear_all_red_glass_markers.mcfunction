execute as @e[type=minecraft:marker,tag=fwg.red_glass] at @s if block ~ ~ ~ minecraft:red_stained_glass run setblock ~ ~ ~ minecraft:air replace
kill @e[type=minecraft:marker,tag=fwg.red_glass]
kill @e[type=minecraft:marker,tag=fwg.red_scan_frontier]
kill @e[type=minecraft:marker,tag=fwg.red_scan_visited]
kill @e[type=minecraft:marker,tag=fwg.scan_red_glass]
scoreboard players set #registered_total fwg 0
scoreboard players set #scan_total fwg 0
scoreboard players set #limit_hit fwg 0
tellraw @s [{"text":"[FWG] ","color":"gold"},{"text":"등록된 위치의 빨간 색유리와 모든 빨간 색유리 마커를 삭제했습니다. 유리 구조물을 다시 만든 뒤 등록하세요.","color":"gray"}]
