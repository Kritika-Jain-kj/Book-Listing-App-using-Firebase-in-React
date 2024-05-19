import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { createContext, useContext, useEffect, useState } from 'react'

const FirebaseContext = createContext(null)

const firebaseConfig = {
  apiKey: 'AIzaSyAp5wpm5BVL3BvbzuUihZKvYX-DP7e7h7w',
  authDomain: 'bookify-ee4f7.firebaseapp.com',
  projectId: 'bookify-ee4f7',
  storageBucket: 'bookify-ee4f7.appspot.com',
  messagingSenderId: '58044644597',
  appId: '1:58044644597:web:7d31537a85789379ebd9bc',
}

export const useFirebase = () => useContext(FirebaseContext)

const firebaseApp = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

const googleProvider = new GoogleAuthProvider()

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) setUser(user)
      else setUser(null)
    })
  }, [])
  const signupUserWithEmailAndPassword = (email, password) =>
    createUserWithEmailAndPassword(firebaseAuth, email, password)

  const signinUserWithEmailAndPass = (email, password) =>
    signInWithEmailAndPassword(firebaseAuth, email, password)

  const signinwithGoogle = () => signInWithPopup(firebaseAuth, googleProvider)

  const handleCreateNewListing = async (name, isbn, price, cover) => {
    const imageRef = ref(storage, `uploads/images/${Date.now()}-${cover.name}`)
    const uploadResult = await uploadBytes(imageRef, cover)
    return await addDoc(collection(firestore, 'books'), {
      name,
      isbn,
      price,
      imageURL: uploadResult.ref.fullPath,
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    })
  }

  const listAllBooks = () => {
    return getDocs(collection(firestore, 'books'))
  }

  const getImageURL = (path) => {
    return getDownloadURL(ref(storage, path))
  }

  const getBookById = async (id) => {
    const docRef = doc(firestore, 'books', id)
    const result = await getDoc(docRef)
    return result
  }

  const placeOrder = async (bookId, qty) => {
    const collectionRef = collection(firestore, 'books', bookId, 'orders')
    const result = await addDoc(collectionRef, {
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      qty: Number(qty),
    })
    return result
  }

  const fetchMyBooks = async (userId) => {
    const collectionRef = collection(firestore, 'books')
    const q = query(collectionRef, where('userID', '==', userId))
    const result = await getDocs(q)
    return result
  }

  const getOrders = async (bookId) => {
    const collectionRef = collection(firestore, 'books', bookId, 'orders')
    const result = await getDocs(collectionRef)
    return result
  }

  const isLoggedIn = user ? true : false

  return (
    <FirebaseContext.Provider
      value={{
        signinwithGoogle,
        signupUserWithEmailAndPassword,
        signinUserWithEmailAndPass,
        handleCreateNewListing,
        listAllBooks,
        isLoggedIn,
        getImageURL,
        placeOrder,
        getBookById,
        fetchMyBooks,
        user,
        getOrders,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  )
}
