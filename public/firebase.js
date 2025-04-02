import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  
  import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCE-03Vw-lsxF_VckXqdp_g9VDUAbFs8fo",
    authDomain: "videocall-79125.firebaseapp.com",
    projectId: "videocall-79125",
    storageBucket: "videocall-79125.firebasestorage.app",
    messagingSenderId: "980954137800",
    appId: "1:980954137800:web:59a016f9964badcdcd11fd",
    measurementId: "G-8YBSSWHM2J"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
 


const auth = getAuth();

const submit1=document.getElementById('submit1');

submit1.addEventListener("click", function(event){
    event.preventDefault();
    const email=document.getElementById('email1').value;
    const password=document.getElementById('password1').value;

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
  
        window.location.replace("/signup");
  
    const user = userCredential.user;
 

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

  });

});

const submit2=document.getElementById('submit2');
submit2.addEventListener('click', function(event){
    event.preventDefault();
    const email=document.getElementById('email2').value;
    const password=document.getElementById('password2').value;
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        window.location.replace("/signedin");
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    
    });