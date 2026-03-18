# Plan: Populate Data Directory for Tap Titans 2 Optimizer

This plan outlines the steps to gather the latest game data and guides from Reddit and other sources to build a foundation for a build optimizer.

## Objective

Populate the `data/` directory with up-to-date JSON data from Reddit guides and other community resources.

## Key Files & Context

- `data/urls.txt`: Contains the list of URLs to be downloaded.
- `data/getdata.ps1`: PowerShell script to download the JSON versions of the Reddit threads.

## Implementation Steps

### 1. Update `data/urls.txt`

Add the following new and updated URLs to `data/urls.txt`:

- `https://www.reddit.com/r/TapTitans2/comments/14ylq4a/monument_tier_list/` (Transcendence Monuments)
- `https://www.reddit.com/r/TapTitans2/comments/kb9p9p/abyssal_tournament_guide/` (Abyssal Tournaments)
- `https://www.reddit.com/r/TapTitans2/comments/k7p970/top_clan_raid_strategies_and_card_setups_for/` (Raid Cards/Meta)
- `https://www.reddit.com/r/TapTitans2/comments/888la3/pet_guide/` (Pet Guide)
- `https://www.reddit.com/r/TapTitans2/comments/7321z1/artifact_tier_list/` (Standard Artifact Tier List)
- `https://www.reddit.com/r/TapTitans2/comments/732nk1/artifact_tier_list_for_patch_20_will_update_with/` (User suggested)

### 2. Update `data/getdata.ps1`

Modify the script to handle potential redirects and ensure it saves files with descriptive names based on the Reddit thread ID or title.
Actually, the current script is fine for basic needs, but I might want to add a check to avoid re-downloading existing files if they haven't changed (though Reddit JSON changes frequently).

### 3. Execute Data Collection

Run the updated `getdata.ps1` to fetch the new JSON files.

### 4. Extract Spreadsheet Links

Parse the downloaded JSON files to find links to Google Sheets. These often contain the raw data used by calculators.
List these links in a separate file `data/spreadsheet_links.txt`.

## Verification & Testing

- Check that all new JSON files are present in the `data/` directory.
- Verify the content of at least one new JSON file to ensure it's valid.
- Manually check `data/spreadsheet_links.txt` for valid URLs.
