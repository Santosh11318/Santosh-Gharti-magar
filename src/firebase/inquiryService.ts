import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';

export interface ClientInquiry {
  id: string;
  name: string;
  phone: string;
  business?: string;
  plan?: string;
  budget?: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

const INQUIRIES_PATH = 'inquiries';

// Submit new inquiry from Contact form
export async function submitInquiry(data: {
  name: string;
  phone: string;
  business?: string;
  plan?: string;
  budget?: string;
  message?: string;
}): Promise<string> {
  const inquiryId = `inq-${Date.now()}`;
  const now = new Date().toISOString();

  const newInquiry: ClientInquiry = {
    id: inquiryId,
    name: data.name.trim(),
    phone: data.phone.trim(),
    business: data.business?.trim() || '',
    plan: data.plan || 'Professional (₹5,999)',
    budget: data.budget || '< ₹5k',
    message: data.message?.trim() || '',
    status: 'new',
    createdAt: now,
  };

  const docPath = `${INQUIRIES_PATH}/${inquiryId}`;
  try {
    await setDoc(doc(db, INQUIRIES_PATH, inquiryId), newInquiry);
    return inquiryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, docPath);
  }
}

// Fetch all inquiries for admin
export async function fetchAllInquiries(): Promise<ClientInquiry[]> {
  try {
    const inquiriesRef = collection(db, INQUIRIES_PATH);
    const q = query(inquiriesRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const inquiries: ClientInquiry[] = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<ClientInquiry, 'id'>)
    }));
    return inquiries;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, INQUIRIES_PATH);
  }
}

// Update status of an inquiry (e.g. marked as contacted or closed)
export async function updateInquiryStatus(id: string, status: ClientInquiry['status']): Promise<void> {
  const docPath = `${INQUIRIES_PATH}/${id}`;
  try {
    await updateDoc(doc(db, INQUIRIES_PATH, id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

// Delete an inquiry
export async function deleteInquiry(id: string): Promise<void> {
  const docPath = `${INQUIRIES_PATH}/${id}`;
  try {
    await deleteDoc(doc(db, INQUIRIES_PATH, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
