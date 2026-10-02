import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';

export interface ProjectItem {
  id: string;
  name: string;
  category: 'portfolio' | 'business' | 'food' | 'health';
  label: string;
  url: string;
  image: string;
  featured?: boolean;
  createdAt?: string;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    name: "Santosh Gharti Magar",
    category: "portfolio",
    label: "PERSONAL WEBSITE",
    url: "https://santosh11318.github.io/Santosh-Gharti-magar/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Santosh-Gharti-magar",
    featured: true
  },
  {
    id: "proj-2",
    name: "Nisha Beauty Salon",
    category: "business",
    label: "BUSINESS / SERVICE",
    url: "https://santosh11318.github.io/Nisha-Beauty-salon/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Nisha-Beauty-salon/",
    featured: true
  },
  {
    id: "proj-3",
    name: "Zippy Momos",
    category: "food",
    label: "RESTAURANT / FOOD",
    url: "https://santosh11318.github.io/Zippy-momos/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Zippy-momos",
    featured: false
  },
  {
    id: "proj-4",
    name: "Arghakhanchi Dental",
    category: "health",
    label: "HEALTHCARE / CLINIC",
    url: "https://santosh11318.github.io/Arghakhanchi-dental-clinic/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Arghakhanchi-dental-clinic/",
    featured: false
  },
  {
    id: "proj-5",
    name: "Sharmila Suryavanshi",
    category: "portfolio",
    label: "PERSONAL PORTFOLIO",
    url: "https://santosh11318.github.io/Sharmilasuryavanshi/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Sharmilasuryavanshi/",
    featured: false
  },
  {
    id: "proj-6",
    name: "Supa Deurali Placement",
    category: "business",
    label: "PLACEMENT SERVICE",
    url: "https://santosh11318.github.io/Supadeurali-placement-service/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Supadeurali-placement-service/",
    featured: false
  },
  {
    id: "proj-7",
    name: "Ajay Thapa Portfolio",
    category: "portfolio",
    label: "DEVELOPER PORTFOLIO",
    url: "https://santosh11318.github.io/Ajaythapa.portfolio/",
    image: "https://image.thum.io/get/width/800/crop/600/https://santosh11318.github.io/Ajaythapa.portfolio/",
    featured: false
  }
];

const PROJECTS_PATH = 'projects';

// Fetch all projects (or return default if empty)
export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const projectsRef = collection(db, PROJECTS_PATH);
    const snapshot = await getDocs(projectsRef);

    if (snapshot.empty) {
      return DEFAULT_PROJECTS;
    }

    const projects: ProjectItem[] = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<ProjectItem, 'id'>)
    }));
    return projects;
  } catch (error) {
    console.debug('Failed to fetch projects, using defaults', error);
    return DEFAULT_PROJECTS;
  }
}

// Add a new project
export async function createProject(data: Omit<ProjectItem, 'id'>): Promise<string> {
  const projectId = `proj-${Date.now()}`;
  const docPath = `${PROJECTS_PATH}/${projectId}`;
  try {
    await setDoc(doc(db, PROJECTS_PATH, projectId), {
      ...data,
      createdAt: new Date().toISOString()
    });
    return projectId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

// Update existing project
export async function updateProject(id: string, data: Partial<ProjectItem>): Promise<void> {
  const docPath = `${PROJECTS_PATH}/${id}`;
  try {
    await updateDoc(doc(db, PROJECTS_PATH, id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  const docPath = `${PROJECTS_PATH}/${id}`;
  try {
    await deleteDoc(doc(db, PROJECTS_PATH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
