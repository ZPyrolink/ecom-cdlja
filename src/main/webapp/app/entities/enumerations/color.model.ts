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
  switch (color) {
    case 'GREEN':
      return Color.GREEN;
    case 'BLACK':
      return Color.BLACK;
    case 'BLUE':
      return Color.BLUE;
    case 'RED':
      return Color.RED;
    case 'PINK':
      return Color.PINK;
    case 'BEIGE':
      return Color.BEIGE;
    case 'WHITE':
      return Color.WHITE;
    case 'ORANGE':
      return Color.ORANGE;
    case 'BROWN':
      return Color.BROWN;
    case 'GRAY':
      return Color.GRAY;
    case 'YELLOW':
      return Color.YELLOW;
    case 'PURPLE':
      return Color.PURPLE;
    default:
      return 'Couleur inconnue';
  }
}
