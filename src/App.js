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

  const [newUser, setNewUser] = useState(false);

  const [user,setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error:'',
    success:false

  })

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn=()=>{
    firebase.auth().signInWithPopup(googleProvider)
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
        photo:'',
       
      }
      setUser(signedOutUser);
    }).catch(err => {
      console.log(err);
    });
  }


  const handleBlur=(e)=>{
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const isPasswordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && isPasswordHasNumber;
    }
    if(isFieldValid){
      // [...cart,newItem]
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  
  const handleSubmit=(e)=>{
    // console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res => {
    // Signed in 
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    console.log(res);
    udpateUserName(user.name);
    // var user = res.user;
    // ...
  })
  .catch(error => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;

    setUser(newUserInfo);

    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode,errorMessage);
  });
    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    // Signed in
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    console.log(res);
    console.log('Sign in user info',res.user);
    // var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;

    setUser(newUserInfo);

    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode,errorMessage);
  });
    }

    e.preventDefault();
  }

  const udpateUserName = name =>{
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(() => {
      // Update successful
      // ...
      console.log('User name updated successfully');
    }).catch((error) => {
      // An error occurred
      // ...
      console.log(error);
    });  
  }

  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        console.log('fb user after sign in ',user);

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;
        console.log(accessToken);

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        console.log(errorCode,errorMessage,email,credential);

        // ...
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
      <br />
      <br />
      <button onClick={handleFbSignIn}>Sign in with Facebook</button>
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email : {user.email}</p>
          <img style={{width:'50%'}} src={user.photo} alt={user.name} />
        </div>
      }

      <h1>Our own Authentication</h1>
      <form onSubmit={handleSubmit}>
        <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id="" />
        <label htmlFor="newUser">New User Sign up</label>
        <br />

          { newUser && 
            <input type="text" name="name" onBlur={handleBlur} placeholder="Your name" />
          }
          <br />
          <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email Address" required />
          <br />
          <input type="password" onBlur={handleBlur} name="password" id="" placeholder="Your Password" required />
          <br />
          <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {
        user.success && <p style={{color:'green'}}>User {newUser ? 'created' : 'Logged in'} successfully</p>
      }
    </div>
  );
}

export default App;
