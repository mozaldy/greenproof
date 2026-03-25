import { REWARD_MULTIPLIERS } from '@greenproof/shared'

/**
 * Calculate the actual reward for a validator at a given level.
 * Level 1: 1.0x, Level 2: 1.5x, Level 3: 2.0x
 */
export function calculateReward(
  baseAmount: number,
  validatorLevel: 1 | 2 | 3
): number {
  const multiplier = REWARD_MULTIPLIERS[validatorLevel] ?? 1.0
  return Math.floor(baseAmount * multiplier)
}
