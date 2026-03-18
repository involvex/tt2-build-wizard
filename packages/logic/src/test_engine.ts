import {OptimizerEngine} from './optimizer'

const engine = new OptimizerEngine()

console.log('Optimizing for Shadow Clone / Fairy with 100 SP...')
const result = engine.optimize(100, 'Shadow Clone', 'Fairy')

console.log('Optimization Result (First 10 steps):')
result.slice(0, 10).forEach((step, i) => {
	console.log(`${i + 1}: Upgrade ${step.skillId} to level ${step.level}`)
})

console.log(`Total upgrades: ${result.length}`)
