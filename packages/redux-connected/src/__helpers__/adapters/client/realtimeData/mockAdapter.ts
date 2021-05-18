import {
    RealtimeData,
    RealtimeDataAdapter,
} from '../../../../adapters/client/realtimeData/adapterRealtimeData';

const config = {
    apiKey: 'AIzaSyAxvKA0fK61RJJh5-enKu7BN3Ie63q--Vc',
    authDomain: 'onew-fecbb.firebaseapp.com',
    databaseURL: 'https://onew-fecbb.firebaseio.com',
    projectId: 'onew-fecbb',
    storageBucket: 'onew-fecbb.appspot.com',
    messagingSenderId: '950138465044',
    appId: '1:950138465044:web:cd85ecea702b190c26b001',
};

export const realtimeDataDb = new RealtimeData(config);

export const mockAdapter = new RealtimeDataAdapter({
    db: realtimeDataDb,
});
