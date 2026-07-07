scoreboard players set #registered_total fwg 0
scoreboard players set #scan_total fwg 0
scoreboard players set #limit_hit fwg 0
kill @e[type=minecraft:marker,tag=fwg.red_scan_frontier]
kill @e[type=minecraft:marker,tag=fwg.red_scan_visited]
kill @e[type=minecraft:marker,tag=fwg.scan_red_glass]
execute align xyz positioned ~0.5 ~0.5 ~0.5 if block ~ ~ ~ minecraft:red_stained_glass run summon minecraft:marker ~ ~ ~ {Tags:["fwg.red_scan_frontier"]}
execute align xyz positioned ~0.5 ~0.5 ~0.5 run function fwg:builder/bfs/loop
kill @e[type=minecraft:marker,tag=fwg.red_scan_frontier]
kill @e[type=minecraft:marker,tag=fwg.red_scan_visited]
execute if score #registered_total fwg matches 1.. run tellraw @s [{"text":"[FWG] ","color":"gold"},{"text":"연결된 빨간 색유리 ","color":"gray"},{"score":{"name":"#registered_total","objective":"fwg"},"color":"red"},{"text":"개를 등록했습니다.","color":"gray"}]
execute unless score #registered_total fwg matches 1.. run tellraw @s [{"text":"[FWG] ","color":"gold"},{"text":"새로 등록된 빨간 색유리가 없습니다. 이미 등록된 연결 덩어리일 수 있습니다.","color":"gray"}]
execute if score #limit_hit fwg matches 1 run tellraw @s [{"text":"[FWG] ","color":"gold"},{"text":"안전 제한 때문에 256개까지만 스캔했습니다. 더 큰 구조물은 나눠서 등록하세요.","color":"yellow"}]
