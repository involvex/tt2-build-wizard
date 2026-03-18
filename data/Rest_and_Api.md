# TapTitans 2 Api / Rest

## Rest

https://tt2-docs.gamehivegames.com/rest/

Server: 

https:/tt2-public.gamehivegames.com/ 

default (need API_TOKEN)

/raid/subscribe R
/raid/unsubscribe
/raid/clan_data
/player/da±a

## Schemas

player_data_properties
Enum:
[ max_stage, player_code, country_code, crafting_shards_spent, raid_wildcard_count, additive_relic_multiplier, relics_received, relics_spent, summon_level, name, total_tournaments, undisputed_count, titan_points, total_raid_player_xp, player_raid_level, total_card_level, equipment_set_count, total_pet_levels, total_skill_points, total_helper_weapons, total_clan_scrolls, challenge_tournaments_participation, challenge_tournaments_undisputed_count, current_world_id, clan_code, clan_name, role, weekly_ticket_count, titan_cards, raid_research_tree, raid_research_bonuses, loyalty_level, daily_raid_tickets, previous_rank, artifacts, seasonal_relics_received, seasonal_relics_spent, seasonal_relic_multiplier, seasonal_artifacts, cards, pets, badge_count, hero_weapon, clan_scroll, skill_tree, equipment_set ]

clan_data_properties
Enum:
[ max_stage, player_code, country_code, raid_wildcard_count, name, total_raid_player_xp, player_raid_level, summon_level, total_card_level, role, weekly_ticket_count, titan_cards, raid_research_tree, raid_research_bonuses, loyalty_level, daily_raid_tickets, previous_rank, cards, equipment_set ]

## Socket

https://tt2-docs.gamehivegames.com/socket

Servers (HTTP API key)

tt2-public.gamehivegames.com/api

/raid
/player

Messages
connected
disconnect
error
connect_error
unsub_clan
start_attack
attack
start
sub_start
end
retire
cycle_reset
sub_cycle
target
join
leave
kick
morale
clan_sync

Schemas
payloads
any uid: payloads
objects
any uid: objects
titan_part_enum
string uid: titan_part_enum
Allowed values: "ArmorLegUpperRight""ArmorHandLeft""ArmorHandRight""ArmorLegUpperLeft""ArmorChestUpper""ArmorArmUpperRight""ArmorArmUpperLeft""ArmorHead""BodyLegUpperRight""BodyHandLeft""BodyHandRight""BodyLegUpperLeft""BodyChestUpper""BodyArmUpperRight""BodyArmUpperLeft""BodyHead""SkeletonLegUpperRight""SkeletonHandLeft""SkeletonHandRight""SkeletonLegUpperLeft""SkeletonChestUpper""SkeletonArmUpperRight""SkeletonArmUpperLeft""SkeletonHead"
card_bonuses_enum
string uid: card_bonuses_enum
Allowed values: "TeamTacticsClanMoraleBoost""MirrorForceBoost"
card_enum
string uid: card_enum
Allowed values: "MoonBeam""Fragmentize""SkullBash""RazorWind""WhipOfLightning""BurstCount""Purify""LimbBurst""FlakShot""Haymaker""ChainLightning""MirrorForce""CelestialStatic""BurningAttack""PoisonAttack""DecayingAttack""Fuse""Shadow""PlagueAttack""Disease""Swarm""RuinousRust""PowerBubble""RuneAttack""ExecutionersAxe""CrushingVoid""MentalFocus""ImpactAttack""InnerTruth""FinisherAttack""SuperheatMetal""BurstBoost""LimbSupport""TotemFairySkill""TeamTactics""SpinalTap"
enemy_id
string uid: enemy_id
Allowed values: "Enemy1""Enemy2""Enemy3""Enemy4""Enemy5""Enemy6""Enemy7""Enemy8"
enemy_name_enum
string uid: enemy_name_enum
Allowed values: "Lojak""Takedar""Jukk""Sterl""Mohaca""Terro""Klonk""Priker"
target_state_enum
string uid: target_state_enum
0 = No target, 1 = Crossed, 2 = Checked.

Allowed values: 012
target_state_part
string uid: target_state_part
Allowed values: "Head""ChestUpper""ArmUpperRight""ArmUpperLeft""LegUpperRight""LegUpperLeft""HandRight""HandLeft"

