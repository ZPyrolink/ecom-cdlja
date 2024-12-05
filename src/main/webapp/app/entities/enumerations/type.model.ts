export enum Type {
  JOGGER = 'Jogging',
  TEESHIRT = 'Tee-Shirt',
  BRA = 'Brassière',
  LEGGING = 'Legging',
  SHORT = 'Short',
  SWEAT = 'Sweat',
}
export default function getClotheTypeLabel(type?: 'JOGGER' | 'TEESHIRT' | 'BRA' | 'LEGGING' | 'SHORT' | 'SWEAT'): string {
  if (type === 'JOGGER') {
    return Type.JOGGER;
  } else if (type === 'TEESHIRT') {
    return Type.TEESHIRT;
  } else if (type === 'BRA') {
    return Type.BRA;
  } else if (type === 'LEGGING') {
    return Type.LEGGING;
  } else if (type === 'SHORT') {
    return Type.SHORT;
  } else if (type === 'SWEAT') {
    return Type.SWEAT;
  }
  return 'Type inconnu';
}
