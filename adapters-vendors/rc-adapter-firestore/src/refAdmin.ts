// const admin = require('firebase-admin');

// const serviceAccount = require('../../admin-sdk.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

// const run = async () => {
//     let cityRef, res, data, snapshot, observer;
//     const docRef = db.collection('users').doc('alovelace');

//     const citiesRef = db.collection('cities');

//     const doc = db.collection('cities').doc('SF');

//     observer = doc.onSnapshot(
//         (docSnapshot) => {
//             console.log(`Received doc snapshot: ${docSnapshot}`);
//             // ...
//         },
//         (err) => {
//             console.log(`Encountered error: ${err}`);
//         }
//     );

//     const query = db.collection('cities').where('state', '==', 'CA');

//     observer = query.onSnapshot(
//         (querySnapshot) => {
//             console.log(
//                 `Received query snapshot of size ${querySnapshot.size}`
//             );
//             // ...
//         },
//         (err) => {
//             console.log(`Encountered error: ${err}`);
//         }
//     );

//     await citiesRef.doc('SF').set({
//         name: 'San Francisco',
//         state: 'CA',
//         country: 'USA',
//         capital: false,
//         population: 860000,
//         regions: ['west_coast', 'norcal'],
//     });
//     await citiesRef.doc('LA').set({
//         name: 'Los Angeles',
//         state: 'CA',
//         country: 'USA',
//         capital: false,
//         population: 3900000,
//         regions: ['west_coast', 'socal'],
//     });
//     await citiesRef.doc('DC').set({
//         name: 'Washington, D.C.',
//         state: null,
//         country: 'USA',
//         capital: true,
//         population: 680000,
//         regions: ['east_coast'],
//     });
//     await citiesRef.doc('TOK').set({
//         name: 'Tokyo',
//         state: null,
//         country: 'Japan',
//         capital: true,
//         population: 9000000,
//         regions: ['kanto', 'honshu'],
//     });
//     await citiesRef.doc('BJ').set({
//         name: 'Beijing',
//         state: null,
//         country: 'China',
//         capital: true,
//         population: 21500000,
//         regions: ['jingjinji', 'hebei'],
//     });

//     await docRef.set({
//         first: 'Ada',
//         last: 'Lovelace',
//         born: 1815,
//     });

//     const aTuringRef = db.collection('users').doc('aturing');

//     await aTuringRef.set({
//         first: 'Alan',
//         middle: 'Mathison',
//         last: 'Turing',
//         born: 1912,
//     });

//     snapshot = await db.collection('users').get();
//     snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//     });

//     data = {
//         name: 'Los Angeles',
//         state: 'CA',
//         country: 'USA',
//     };

//     // Add a new document in collection "cities" with ID 'LA'
//     res = await db.collection('cities').doc('LA').set(data);

//     cityRef = db.collection('cities').doc('LA');

//     res = await cityRef.set(
//         {
//             isFriendly: true,
//         },
//         { merge: true }
//     );

//     data = {
//         stringExample: 'Hello, World!',
//         booleanExample: true,
//         numberExample: 3.14159265,
//         dateExample: admin.firestore.Timestamp.fromDate(
//             new Date('December 10, 1815')
//         ),
//         arrayExample: [5, true, 'hello'],
//         nullExample: null,
//         objectExample: {
//             a: 5,
//             b: true,
//         },
//     };

//     cityRef = db.collection('cities').doc('LA');

//     // Set the 'capital' field of the city
//     res = await cityRef.update({ capital: true });

//     const initialData = {
//         name: 'Frank',
//         age: 12,
//         favorites: {
//             food: 'Pizza',
//             color: 'Blue',
//             subject: 'recess',
//         },
//     };

//     res = await db.collection('users').doc('Frank').set(data);

//     // ...
//     res = await db.collection('users').doc('Frank').update({
//         age: 24,
//         'favorites.color': 'Red',
//     });

//     res = await db.collection('cities').doc('DC').delete();

//     const FieldValue = admin.firestore.FieldValue;

//     // Create a document reference
//     cityRef = db.collection('cities').doc('LA');

//     // Remove the 'capital' field from the document
//     res = await cityRef.update({
//         capital: FieldValue.delete(),
//     });

//     const queryRef = citiesRef.where('state', '==', 'CA');
//     snapshot = await queryRef.get();
//     if (snapshot.empty) {
//         console.log('No matching documents.');
//     }

//     snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//     });

//     // snapshot = await citiesRef
//     //     .where('state', '>=', 'CA')
//     //     .where('state', '<=', 'IN');

//     // if (snapshot.empty) {
//     //     console.log('No matching documents.');
//     // }
//     // snapshot.forEach((doc) => {
//     //     console.log(doc.id, '=>', doc.data());
//     // });

//     snapshot = await citiesRef.where('capital', '==', true).get();
//     snapshot = await queryRef.get();
//     if (snapshot.empty) {
//         console.log('No matching documents.');
//     }

//     snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//     });

//     snapshot = await citiesRef.orderBy('name', 'desc').limit(3).get();
//     snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//     });

//     snapshot = await citiesRef
//         .where('population', '>', 2500000)
//         .orderBy('population')
//         .limit(2)
//         .get();

//     snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//     });

//     snapshot = await db
//         .collection('cities')
//         .orderBy('population')
//         .startAt(1000000)
//         .get();

//     snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//     });

//     const first = db.collection('cities').orderBy('population').limit(3);

//     snapshot = await first.get();
//     snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//     });

//     // Get the last document
//     const last = snapshot.docs[snapshot.docs.length - 1];

//     // Construct a new query starting at this document.
//     // Note: this will not have the desired effect if multiple
//     // cities have the exact same population value.
//     const next = db
//         .collection('cities')
//         .orderBy('population')
//         .startAfter(last.data().population)
//         .limit(3);

//     console.log('next ->', next, initialData, observer, res);
// };

// run();
