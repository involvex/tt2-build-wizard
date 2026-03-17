import raidCardsData from './raid_cards.json';

export interface RaidCardInfo {
  CardID: string;
  Name: string;
  Category: string;
  Type: string;
  Tier: number;
  MaxLevel: number;
  Color: string;
  [key: string]: any;
}

export interface DeckSuggestion {
  cards: string[];
  totalPower: number;
  name: string;
  description: string;
}

export class RaidOptimizerEngine {
  private cards: Record<string, RaidCardInfo>;

  constructor() {
    this.cards = raidCardsData as Record<string, RaidCardInfo>;
  }

  public getCardBonus(cardId: string, level: number, bonusType: 'A' | 'B'): number {
    const card = this.cards[cardId];
    if (!card || level <= 0) return 0;
    
    const key = `${bonusType}${level}`;
    return card[key] || 0;
  }

  public getCardPower(cardId: string, level: number): number {
    const card = this.cards[cardId];
    if (!card || level <= 0) return 0;

    // Basic power calculation based on primary bonus
    const bonusA = this.getCardBonus(cardId, level, 'A');
    const bonusB = this.getCardBonus(cardId, level, 'B');

    return bonusA + (bonusB * 0.5); // Simplified weighting
  }

  public suggestDecks(playerCardLevels: Record<string, number>): DeckSuggestion[] {
    const sortedCards = Object.keys(playerCardLevels)
      .filter(id => this.cards[id])
      .sort((a, b) => {
        const powerA = this.getCardPower(a, playerCardLevels[a]);
        const powerB = this.getCardPower(b, playerCardLevels[b]);
        return powerB - powerA;
      });

    // Strategy 1: Top 3 Burst/Affliction + 1 Support (simplified to just top 3 for now)
    const topDecks: DeckSuggestion[] = [];

    if (sortedCards.length >= 3) {
      topDecks.push({
        name: 'Powerhouse Deck',
        description: 'Your 3 highest level cards for maximum raw damage.',
        cards: sortedCards.slice(0, 3),
        totalPower: sortedCards.slice(0, 3).reduce((sum, id) => sum + this.getCardPower(id, playerCardLevels[id]), 0)
      });
    }

    // Strategy 2: Specific categories if available
    const afflictions = sortedCards.filter(id => this.cards[id].Category === 'Affliction');
    if (afflictions.length >= 3) {
      topDecks.push({
        name: 'Affliction Specialist',
        description: 'Focus on stacking over-time damage.',
        cards: afflictions.slice(0, 3),
        totalPower: afflictions.slice(0, 3).reduce((sum, id) => sum + this.getCardPower(id, playerCardLevels[id]), 0)
      });
    }

    const bursts = sortedCards.filter(id => this.cards[id].Category === 'Burst');
    if (bursts.length >= 3) {
      topDecks.push({
        name: 'Burst Specialist',
        description: 'Maximum immediate impact damage.',
        cards: bursts.slice(0, 3),
        totalPower: bursts.slice(0, 3).reduce((sum, id) => sum + this.getCardPower(id, playerCardLevels[id]), 0)
      });
    }

    return topDecks;
  }
}
