export type LegalBullet = string | LegalNestedBullet;

export type LegalNestedBullet = {
  text: string;
  nested?: string[];
};

export type LegalLink = {
  text: string;
  url: string;
};

export type LegalContact = {
  prefix?: string;
  email: string;
};

export type LegalSectionData = {
  heading: string;
  paragraphs?: string[];
  bullets?: LegalBullet[];
  contact?: LegalContact;
  links?: LegalLink[];
};

export type LegalContent = {
  title: string;
  lastUpdated: string;
  sections: LegalSectionData[];
};

export type LegalScreenProps = {
  title: string;
  lastUpdated: string;
  sections: LegalSectionData[];
};
