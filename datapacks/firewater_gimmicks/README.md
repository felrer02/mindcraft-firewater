# Firewater Gimmicks

Mindcraft Fire/Water stage gimmicks as a Minecraft data pack.

## Red Glass Trigger

Behavior:

- If any player stands on `minecraft:red_glazed_terracotta`, registered red glass devices disappear.
- When no player is standing on `minecraft:red_glazed_terracotta`, registered red glass devices are restored.

Setup:

1. Run `/reload`.
2. Place `red_glazed_terracotta` as the trigger pad.
3. Place `red_stained_glass` as the glass device.
4. Look directly at one block in a connected red stained glass cluster and run:

```mcfunction
/function fwg:builder/register_red_glass
```

Registration scans up to 256 face-connected `red_stained_glass` blocks.

Useful commands:

```mcfunction
/function fwg:builder/help
/function fwg:red/reset
/function fwg:builder/clear_red_glass_nearby
/function fwg:builder/clear_all_red_glass_markers
```

`clear_all_red_glass_markers` also removes red stained glass blocks at registered marker positions.
