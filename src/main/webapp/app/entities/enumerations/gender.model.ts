export enum Gender {
  MAN = 'Homme',

  WOMAN = 'Femme',

  UNISEX = 'Unisex',

  CHILD = 'Enfant',
}

export default function getGenderLabel(gender?: 'MAN' | 'WOMAN' | 'UNISEX' | 'CHILD'): string {
  switch (gender) {
    case 'MAN':
      return Gender.MAN;
    case 'WOMAN':
      return Gender.WOMAN;
    case 'UNISEX':
      return Gender.UNISEX;
    case 'CHILD':
      return Gender.CHILD;
    default:
      return 'Genre inconnue';
  }
}
