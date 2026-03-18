import fs from 'fs'

const csv = fs.readFileSync(
	'tt2-master/test/TT2Master.Shared.Tests/Resources/EquipmentSetInfo.csv',
	'utf8',
)
const lines = csv.split('\n').filter(l => l.trim().length > 0)
const headers = lines[0].split(',')

const equipmentSets: Record<string, any> = {}

for (let i = 1; i < lines.length; i++) {
	const currentLine = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
	if (!currentLine) continue

	const entry: any = {}
	headers.forEach((header, index) => {
		let cleanHeader = header.trim()
		let value = currentLine[index]?.replace(/^"|"$/g, '').trim() || ''

		if (!isNaN(Number(value)) && value !== '') {
			entry[cleanHeader] = Number(value)
		} else {
			entry[cleanHeader] = value
		}
	})

	equipmentSets[entry.EquipmentSet] = entry
}

fs.writeFileSync(
	'packages/logic/src/equipment_sets.json',
	JSON.stringify(equipmentSets, null, 2),
)
console.log('Equipment Sets JSON generated successfully')
