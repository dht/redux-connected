export const deleteCollection = async (db: any, collectionPath: string) => {
    const collectionRef = db.collection(collectionPath);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, collectionRef, resolve).catch(reject);
    });
};

const deleteQueryBatch = async (db: any, query: any, resolve: any) => {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
};
