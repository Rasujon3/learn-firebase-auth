import './App.css';
import  firebase from 'firebase/app';
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';


// firebase.initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

function App() {

  const [user,setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',

  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn=()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {displayName,photoURL,email} = res.user;
      const signedInUser = {
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signedInUser);
      console.log(displayName,photoURL,email);
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn:false,
        name:'',
        email:'',
        photo:''
      }
      setUser(signedOutUser);
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div style={{textAlign:'center'}}>
      {
        user.isSignedIn ? 
        <button onClick={handleSignOut}>Sign out</button>
        :
        <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email : {user.email}</p>
          <img style={{width:'50%'}} src={user.photo} alt={user.name} />
        </div>
      }
    </div>
  );
}

export default App;
