export enum Gender {
  MAN = 'Homme',

  WOMAN = 'Femme',

  UNISEX = 'Unisex',

  CHILD = 'Enfant',
}

export default function getGenderLabel(gender?: 'MAN' | 'WOMAN' | 'UNISEX' | 'CHILD'): string {
  if (gender === 'MAN') {
    return Gender.MAN;
  } else if (gender === 'WOMAN') {
    return Gender.WOMAN;
  } else if (gender === 'UNISEX') {
    return Gender.UNISEX;
  } else if (gender === 'CHILD') {
    return Gender.CHILD;
  }
  return 'Genre inconnue';
}
