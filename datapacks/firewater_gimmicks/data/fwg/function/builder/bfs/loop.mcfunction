execute if score #scan_total fwg matches ..255 if entity @e[type=minecraft:marker,tag=fwg.red_scan_frontier] run function fwg:builder/bfs/process_one
execute if score #scan_total fwg matches ..255 if entity @e[type=minecraft:marker,tag=fwg.red_scan_frontier] run function fwg:builder/bfs/loop
execute if score #scan_total fwg matches 256.. if entity @e[type=minecraft:marker,tag=fwg.red_scan_frontier] run scoreboard players set #limit_hit fwg 1
