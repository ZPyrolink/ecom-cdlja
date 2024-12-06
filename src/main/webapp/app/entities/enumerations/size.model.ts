export enum Size {
  XXS = 'XXS',

  XS = 'XS',

  S = 'S',

  M = 'M',

  L = 'L',

  XL = 'XL',

  XXL = 'XXL',

  FOUR = '4 ans',

  SIX = '6 ans',

  EIGHT = '8 ans',

  TEN = '10 ans',

  TWELVE = '12 ans',

  FOURTEEN = '14 ans',
}

export default function getSizeLabel(
  size?: 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'FOUR' | 'SIX' | 'EIGHT' | 'TEN' | 'TWELVE' | 'FOURTEEN',
): string {
  switch (size) {
    case 'XXS':
      return Size.XXS;
    case 'XS':
      return Size.XS;
    case 'S':
      return Size.S;
    case 'M':
      return Size.M;
    case 'L':
      return Size.L;
    case 'XL':
      return Size.XL;
    case 'XXL':
      return Size.XXL;
    case 'FOUR':
      return Size.FOUR;
    case 'SIX':
      return Size.SIX;
    case 'EIGHT':
      return Size.EIGHT;
    case 'TEN':
      return Size.TEN;
    case 'TWELVE':
      return Size.TWELVE;
    case 'FOURTEEN':
      return Size.FOURTEEN;
    default:
      return 'Taille inconnue';
  }
}
