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
  if (size === 'XXS') {
    return Size.XXS;
  } else if (size === 'XS') {
    return Size.XS;
  } else if (size === 'S') {
    return Size.S;
  } else if (size === 'M') {
    return Size.M;
  } else if (size === 'L') {
    return Size.L;
  } else if (size === 'XL') {
    return Size.XL;
  } else if (size === 'XXL') {
    return Size.XXL;
  } else if (size === 'FOUR') {
    return Size.FOUR;
  } else if (size === 'SIX') {
    return Size.SIX;
  } else if (size === 'EIGHT') {
    return Size.EIGHT;
  } else if (size === 'TEN') {
    return Size.TEN;
  } else if (size === 'TWELVE') {
    return Size.TWELVE;
  } else if (size === 'FOURTEEN') {
    return Size.FOURTEEN;
  }

  // Par sécurité, renvoie un label par défaut si la taille n'est pas reconnue
  return 'Taille inconnue';
}

export function getSizeLabelFromSize(size: Size): string {
  // Utilisation directe de l'énumération comme clés et valeurs
  const sizeMap: Record<string, string> = {
    [Size.XXS]: Size.XXS,
    [Size.XS]: Size.XS,
    [Size.S]: Size.S,
    [Size.M]: Size.M,
    [Size.L]: Size.L,
    [Size.XL]: Size.XL,
    [Size.XXL]: Size.XXL,
    [Size.FOUR]: Size.FOUR,
    [Size.SIX]: Size.SIX,
    [Size.EIGHT]: Size.EIGHT,
    [Size.TEN]: Size.TEN,
    [Size.TWELVE]: Size.TWELVE,
    [Size.FOURTEEN]: Size.FOURTEEN,
  };

  return sizeMap[size];
}
