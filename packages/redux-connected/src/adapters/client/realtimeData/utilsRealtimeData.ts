export const deleteCollection = async (db: any, collectionPath: string) => {
    const ref = db.ref('onew-fecbb');
    const collectionRef = ref.child(collectionPath);
    return collectionRef.delete();
};
