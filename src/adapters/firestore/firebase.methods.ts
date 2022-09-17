import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    getDoc,
    deleteDoc,
    doc,
    addDoc,
    writeBatch,
    Firestore,
    query,
    where,
} from 'firebase/firestore/lite';
export type { FirebaseApp } from 'firebase/app';

export type {
    Firestore,
    QueryConstraint,
    Query,
} from 'firebase/firestore/lite';

export const firebase = {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    getDoc,
    deleteDoc,
    doc,
    addDoc,
    writeBatch,
    query,
    where,
};
