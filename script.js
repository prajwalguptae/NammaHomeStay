const firebaseConfig = {
  apiKey: "AIzaSyD-Z6m9zUUutUw_4OdpJFrIGzSvYTzD5yU",
  authDomain: "namma-homestay-8096e.firebaseapp.com",
  projectId: "namma-homestay-8096e",
  storageBucket: "namma-homestay-8096e.firebasestorage.app",
  messagingSenderId: "497888462316",
  appId: "1:497888462316:web:2325d4139e1d2a9fddecc9",
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    document.body.style.background = "#dff0d8";

    alert("Welcome to Namma HomeStay");
  } catch (error) {
    alert("Invalid Email or Password");
  }
});

document.getElementById("generateBtn")
.addEventListener("click", async () => {

  const dish =
    document.getElementById("dish").value;

  try {

    // OPTIONAL REAL AI ATTEMPT

    const response = await fetch(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCtXbENFviRGuTI0AsNZZKhuFhtJsEfVmU`,

{
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        contents: [{
          parts: [{
            text:
`Generate a short attractive food description for ${dish}`
          }]
        }]
      })
    });

    const data = await response.json();

    console.log(data);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if(text){

      document.getElementById("result")
      .innerText = text;

    }else{

      throw new Error("AI quota issue");
    }

  } catch (error) {

    console.log(error);

    // FALLBACK OUTPUT

    const fallbackText =
`${dish} is a traditional homemade delicacy prepared using fresh local ingredients and authentic village-style flavors for a warm hospitality experience.`;

    document.getElementById("result")
    .innerText = fallbackText;

  }

});

document.getElementById("saveBtn")
.addEventListener("click", async ()=>{

  const dish =
    document.getElementById("dish").value;

  const price =
    document.getElementById("price").value;

  const description =
    document.getElementById("result").innerText;

  try{

    await addDoc(

      collection(db, "menu"),

      {
        dish: dish,
        price: price,
        description: description,
        createdAt: new Date()
      }

    );

    alert("Menu Saved Successfully");

  }catch(error){

    console.log(error);

    alert("Failed To Save Data");
  }

});

document.getElementById("sendInquiryBtn")
.addEventListener("click", async ()=>{

  const name =
    document.getElementById("customerName").value;

  const message =
    document.getElementById("customerMessage").value;

  try{

    await addDoc(

      collection(db, "inquiries"),

      {
        name: name,
        message: message,
        createdAt: new Date()
      }

    );

    alert("Inquiry Sent Successfully");

    document.getElementById("customerName").value = "";

    document.getElementById("customerMessage").value = "";

    displayInquiries();

  }catch(error){

    console.log(error);

    alert("Failed To Send Inquiry");
  }

});

async function displayInquiries(){

  const inquiryList =
    document.getElementById("inquiryList");

  inquiryList.innerHTML = "";

  const querySnapshot =
    await getDocs(collection(db, "inquiries"));

  querySnapshot.forEach((doc)=>{

    const data = doc.data();

    inquiryList.innerHTML += `

      <div class="inquiry-item">

        <strong>${data.name}</strong>

        <p>${data.message}</p>

      </div>

    `;
  });

}

document.getElementById("addPlaceBtn")
.addEventListener("click", async ()=>{

  const placeName =
    document.getElementById("placeName").value;

  const placeDescription =
    document.getElementById("placeDescription").value;

  try{

    await addDoc(

      collection(db, "places"),

      {
        placeName: placeName,
        placeDescription: placeDescription,
        createdAt: new Date()
      }

    );

    alert("Place Added Successfully");

    document.getElementById("placeName").value = "";

    document.getElementById("placeDescription").value = "";

    displayPlaces();

  }catch(error){

    console.log(error);

    alert("Failed To Add Place");
  }

});

async function displayPlaces(){

  const placesList =
    document.getElementById("placesList");

  placesList.innerHTML = "";

  const querySnapshot =
    await getDocs(collection(db, "places"));

  querySnapshot.forEach((doc)=>{

    const data = doc.data();

    placesList.innerHTML += `

      <div class="place-card">

        <h3>${data.placeName}</h3>

        <p>${data.placeDescription}</p>

      </div>

    `;
  });

}

displayInquiries();
displayPlaces();