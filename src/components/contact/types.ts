export interface ContactInfo {
  icon: string;
  label: string;
  value: string;
}

export interface ContactHero {
  title: string;
  description: string;
  contacts: ContactInfo[];
}
