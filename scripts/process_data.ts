import {writeFileSync, readFileSync} from 'node:fs'

const skillsContent = readFileSync('data/scripts/skills.js', 'utf8')
const reductionsContent = readFileSync('data/scripts/reductions.js', 'utf8')

// Simple extraction using regex for the objects
function extractObject(content, variableName) {
	const startIdx = content.indexOf(`const ${variableName} = {`)
	if (startIdx === -1) return null

	// Find the matching closing brace
	let depth = 0
	let endIdx = -1
	for (
		let i = startIdx + `const ${variableName} = `.length;
		i < content.length;
		i++
	) {
		if (content[i] === '{') depth++
		if (content[i] === '}') {
			depth--
			if (depth === 0) {
				endIdx = i + 1
				break
			}
		}
	}

	if (endIdx === -1) return null
	const jsonStr = content.substring(
		startIdx + `const ${variableName} = `.length,
		endIdx,
	)

	// The JS files are not strict JSON (keys not quoted, trailing commas, etc.)
	// We'll use eval in a safe sandbox or just use a simple approach since it's trusted local data
	// For this environment, we can use a temporary function to return it.
	return new Function(`return ${jsonStr}`)()
}

const skills = extractObject(skillsContent, 'skillInfo')
const reductions = extractObject(reductionsContent, 'reductions')

writeFileSync('packages/logic/src/skills.json', JSON.stringify(skills, null, 2))
writeFileSync(
	'packages/logic/src/reductions.json',
	JSON.stringify(reductions, null, 2),
)

console.log('Successfully processed skills and reductions into JSON.')
