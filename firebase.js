// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBl4lMSw26ay5sbyBMJ90U-Xh8WqesoRHQ',
  authDomain: 'gamificationv0-60af3.firebaseapp.com',
  projectId: 'gamificationv0-60af3',
  storageBucket: 'gamificationv0-60af3.appspot.com',
  messagingSenderId: '381931041254',
  appId: '1:381931041254:web:9bfc0b6b2775e02baca627',
  measurementId: 'G-PVD3CZ6769'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
