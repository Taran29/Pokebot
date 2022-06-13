const updateCoins = (rarity, chance) => {
  const baseCoins = {
    'Common': 200,
    'Uncommon': 350,
    'Rare': 600,
    'Super Rare': 2500,
    'Legendary': 10000
  }
  return (baseCoins[rarity.name] + (chance * 100))
}

export default updateCoins