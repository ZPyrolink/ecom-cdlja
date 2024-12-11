export enum Type {
  JOGGER = 'Jogging',
  TEESHIRT = 'Tee-Shirt',
  BRA = 'Brassière',
  LEGGING = 'Legging',
  SHORT = 'Short',
  SWEAT = 'Pull',
}
export default function getClotheTypeLabel(type?: 'JOGGER' | 'TEESHIRT' | 'BRA' | 'LEGGING' | 'SHORT' | 'SWEAT'): string {
  switch (type) {
    case 'JOGGER':
      return Type.JOGGER;
    case 'TEESHIRT':
      return Type.TEESHIRT;
    case 'BRA':
      return Type.BRA;
    case 'LEGGING':
      return Type.LEGGING;
    case 'SHORT':
      return Type.SHORT;
    case 'SWEAT':
      return Type.SWEAT;
    default:
      return 'Type inconnu';
  }
}
