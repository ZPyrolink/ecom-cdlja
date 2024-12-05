export enum Color {
  GREEN = 'Vert',

  BLACK = 'Noir',

  BLUE = 'Bleu',

  RED = 'Rouge',

  PINK = 'Rose',

  BEIGE = 'Beige',

  WHITE = 'Blanc',

  ORANGE = 'Orange',

  BROWN = 'Marron',

  GRAY = 'Gris',

  YELLOW = 'Jaune',

  PURPLE = 'Violet',
}

export default function getColorLabel(
  color?: 'GREEN' | 'BLACK' | 'BLUE' | 'RED' | 'PINK' | 'BEIGE' | 'WHITE' | 'ORANGE' | 'BROWN' | 'GRAY' | 'YELLOW' | 'PURPLE',
): string {
  if (color === 'GREEN') {
    return Color.GREEN;
  } else if (color === 'BLACK') {
    return Color.BLACK;
  } else if (color === 'BLUE') {
    return Color.BLUE;
  } else if (color === 'RED') {
    return Color.RED;
  } else if (color === 'PINK') {
    return Color.PINK;
  } else if (color === 'BEIGE') {
    return Color.BEIGE;
  } else if (color === 'WHITE') {
    return Color.WHITE;
  } else if (color === 'ORANGE') {
    return Color.ORANGE;
  } else if (color === 'BROWN') {
    return Color.BROWN;
  } else if (color === 'GRAY') {
    return Color.GRAY;
  } else if (color === 'YELLOW') {
    return Color.YELLOW;
  } else if (color === 'PURPLE') {
    return Color.PURPLE;
  }

  // Par sécurité, renvoie un label par défaut si la couleur n'est pas reconnue
  return 'Couleur inconnue';
}
