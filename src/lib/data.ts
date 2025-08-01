
import type { Patient, MedicalRecord, User } from './types';
import { db } from './firebase';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';


const patients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    dateOfBirth: '1985-04-12',
    gender: 'Male',
    contact: '+1-202-555-0185',
    address: '123 Wellness Ave, Healthville, USA',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '2',
    name: 'Jane Smith',
    dateOfBirth: '1992-08-23',
    gender: 'Female',
    contact: '+1-202-555-0191',
    address: '456 Cure St, Mediton, USA',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    dateOfBirth: '1978-11-02',
    gender: 'Male',
    contact: '+1-202-555-0143',
    address: '789 Remedy Rd, Sickbay, USA',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '4',
    name: 'Emily Williams',
    dateOfBirth: '2001-07-15',
    gender: 'Female',
    contact: '+1-202-555-0167',
    address: '101 Healer Ln, Recovery City, USA',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
];

const medicalRecords: MedicalRecord[] = [
  {
    patientId: '1',
    medicalHistory: 'History of hypertension, managed with Lisinopril. Non-smoker. No known allergies.',
    currentStatus: 'Presents with a persistent cough and mild fever. Blood pressure is within the normal range. Oxygen saturation at 98%.',
    diagnoses: [
      { id: 'd1', date: '2023-10-15', code: 'J02.9', description: 'Acute pharyngitis, unspecified', physician: 'Dr. Adams' },
      { id: 'd2', date: '2022-05-20', code: 'I10', description: 'Essential (primary) hypertension', physician: 'Dr. House' },
    ],
    treatments: [
      { id: 't1', date: '2023-10-15', procedure: 'Prescribed Amoxicillin', medication: 'Amoxicillin', dosage: '500mg, 3 times a day', physician: 'Dr. Adams' },
      { id: 't2', date: '2022-05-20', procedure: 'Prescribed Lisinopril', medication: 'Lisinopril', dosage: '10mg, once a day', physician: 'Dr. House' },
    ],
    documents: [
      { id: 'doc1', date: '2023-10-14', type: 'Lab Result', title: 'Blood Panel', url: '#' },
      { id: 'doc2', date: '2023-01-11', type: 'Imaging Report', title: 'Chest X-Ray', url: '#' },
    ],
  },
   {
    patientId: '2',
    medicalHistory: 'Seasonal allergies, managed with Loratadine. History of a fractured left arm in 2015. All vaccinations are up to date.',
    currentStatus: 'Routine check-up. Reports feeling well. No acute complaints. Vital signs are stable.',
    diagnoses: [
      { id: 'd3', date: '2023-04-01', code: 'T78.40XA', description: 'Allergy, unspecified, initial encounter', physician: 'Dr. Grey' },
    ],
    treatments: [
       { id: 't3', date: '2023-04-01', procedure: 'Prescribed Loratadine', medication: 'Loratadine', dosage: '10mg, as needed', physician: 'Dr. Grey' },
    ],
    documents: [
       { id: 'doc3', date: '2023-04-01', type: 'Consultation Note', title: 'Annual Physical Exam', url: '#' },
    ],
  },
  {
    patientId: '3',
    medicalHistory: 'Type 2 Diabetes, managed with Metformin and diet. History of high cholesterol.',
    currentStatus: 'Follow-up for diabetes management. Recent A1c is 6.8%. Reports good adherence to medication and diet.',
    diagnoses: [
        { id: 'd4', date: '2020-01-10', code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', physician: 'Dr. Wilson' },
        { id: 'd5', date: '2020-01-10', code: 'E78.5', description: 'Hyperlipidemia, unspecified', physician: 'Dr. Wilson' },
    ],
    treatments: [
        { id: 't4', date: '2020-01-10', procedure: 'Prescribed Metformin', medication: 'Metformin', dosage: '1000mg, twice a day', physician: 'Dr. Wilson' },
    ],
    documents: [
        { id: 'doc4', date: '2023-11-20', type: 'Lab Result', title: 'A1c and Lipid Panel', url: '#' },
    ],
  },
  {
    patientId: '4',
    medicalHistory: 'No significant medical history. Generally healthy.',
    currentStatus: 'Presents with symptoms of a common cold: runny nose, sneezing, and sore throat. No fever.',
    diagnoses: [
      { id: 'd6', date: '2024-02-10', code: 'J00', description: 'Acute nasopharyngitis [common cold]', physician: 'Dr. Carter' },
    ],
    treatments: [
      { id: 't5', date: '2024-02-10', procedure: 'Recommended rest and hydration', physician: 'Dr. Carter' },
    ],
    documents: [],
  }
];


export function getPatients(): Patient[] {
  return patients;
}

export function getPatientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export function getMedicalRecordByPatientId(patientId: string): MedicalRecord | undefined {
  return medicalRecords.find((r) => r.patientId === patientId);
}

export function addPatient(patientData: Omit<Patient, 'id' | 'avatarUrl'>): Patient {
    const newId = (Math.max(...patients.map(p => parseInt(p.id))) + 1).toString();
    const newPatient: Patient = {
        id: newId,
        ...patientData,
        avatarUrl: `https://placehold.co/100x100.png`,
    };
    patients.unshift(newPatient); // Add to the beginning of the list

    // Also create a blank medical record for the new patient
    const newMedicalRecord: MedicalRecord = {
        patientId: newId,
        medicalHistory: 'No significant medical history.',
        currentStatus: 'Newly registered patient.',
        diagnoses: [],
        treatments: [],
        documents: [],
    };
    medicalRecords.unshift(newMedicalRecord);

    return newPatient;
}

export async function getUsers(): Promise<User[]> {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(query(usersCollection));
    const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as User));
    return usersList;
}

export async function addUser(userData: Omit<User, 'id'>): Promise<User> {
    const usersCollection = collection(db, 'users');
    const docRef = await addDoc(usersCollection, userData);
    return {
        id: docRef.id,
        ...userData
    };
}
