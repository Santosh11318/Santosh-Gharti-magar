import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';

export interface SiteSettings {
  pricing: {
    basicPrice: number;
    professionalPrice: number;
    premiumPrice: number;
    popularTier: 'basic' | 'professional' | 'premium';
  };
  stats: {
    projectsDeployed: number;
    happyClients: number;
    successRate: number;
  };
  contact: {
    whatsapp: string;
    email: string;
    githubUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
    facebookUrl: string;
    availableForWork: boolean;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  pricing: {
    basicPrice: 2999,
    professionalPrice: 5999,
    premiumPrice: 9999,
    popularTier: 'professional'
  },
  stats: {
    projectsDeployed: 50,
    happyClients: 30,
    successRate: 99
  },
  contact: {
    whatsapp: '+91 8799747981',
    email: 'santoshghartimagar918@gmail.com',
    githubUrl: 'https://github.com/santosh11318',
    linkedinUrl: 'https://linkedin.com/in/santosh-gharti-magar',
    instagramUrl: 'https://instagram.com/santosh_gm',
    facebookUrl: 'https://facebook.com/santoshghartimagar',
    availableForWork: true
  }
};

const SETTINGS_PATH = 'site_settings';
const GENERAL_DOC_ID = 'general';

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, SETTINGS_PATH, GENERAL_DOC_ID);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...snap.data()
      } as SiteSettings;
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.debug('Failed to fetch site settings, using defaults', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const docPath = `${SETTINGS_PATH}/${GENERAL_DOC_ID}`;
  try {
    await setDoc(doc(db, SETTINGS_PATH, GENERAL_DOC_ID), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}
