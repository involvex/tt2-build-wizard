import fs from 'fs';

const csv = fs.readFileSync('tt2-master/test/TT2Master.Shared.Tests/Resources/RaidSkillInfo.csv', 'utf8');
const lines = csv.split('\n').filter(l => l.trim().length > 0);
const headers = lines[0].split(',');

const raidCards: Record<string, any> = {};

for (let i = 1; i < lines.length; i++) {
  // Handle commas inside quotes
  const currentLine = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  if (!currentLine) continue;

  const entry: any = {};
  headers.forEach((header, index) => {
    let cleanHeader = header.trim();
    let value = currentLine[index]?.replace(/^"|"$/g, '').trim() || '';
    
    // Parse numbers
    if (!isNaN(Number(value)) && value !== '') {
      entry[cleanHeader] = Number(value);
    } else {
      entry[cleanHeader] = value;
    }
  });

  raidCards[entry.CardID] = entry;
}

fs.writeFileSync('packages/logic/src/raid_cards.json', JSON.stringify(raidCards, null, 2));
console.log('Raid Cards JSON generated successfully');
