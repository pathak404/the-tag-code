
async function sendMail(postdata = {}) {
    console.log(JSON.stringify(postdata));
    var url = "https://mailtoadmin.000webhostapp.com/";
    var response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify(postdata)
    });
    var data = await response.text();
    console.log(data);
}





let formType = "serviceRequests";
let formID = "requestService-form";
let isContactForm = false;
if (!!document.getElementById('contactUs-form')) {
    isContactForm = true;
    formType = "contactData";
    formID = "contactUs-form";
}
document.getElementById(formID).addEventListener('submit', formSubmit);

const firebaseConfig = {
    apiKey: "AIzaSyDpb1WO4HOreeaTZqcpPjki3cS2QscAbH4",
    authDomain: "tagcode1.firebaseapp.com",
    projectId: "tagcode1",
    storageBucket: "tagcode1.appspot.com",
    messagingSenderId: "629953603740",
    appId: "1:629953603740:web:fe3492e512663ed7886559"
};

var app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const docRef = db.collection(formType);
const myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());

function formSubmit(e) {
    e.preventDefault();
    let name = document.querySelector('input#name').value.trim();
    let email = document.querySelector('input#email').value.trim();
    let phone = document.querySelector('input#phone').value.trim();
    let message = document.querySelector('textarea#message').value.trim();

    if (isContactForm) {
        isContactForm = document.querySelector('input#subject').value.trim();
    }

    if (name == '' || email == '', message == '') {
        mainModal("ERROR", "Please Fill all the input fields");
    } else if (phone.toString().length != 0 && phone.toString().length != 10) {
        mainModal("ERROR", "Please Enter Your 10 Digit Number");
    }
    else {
        saveData(name, email, phone, message);
    }
}

function saveData(name, email, phone, message) {
    if (isContactForm) {
        docRef.add({
            name: name,
            email: email,
            phone: phone,
            subject: isContactForm,
            message: message,
            time: myTimestamp
        })
            .then((docRef) => {
            sendMail({name: name,
            email: email,
            phone: phone,
            subject: isContactForm,
            message: message,
            type: "Contact",
            time: myTimestamp});
                console.log("Document written with ID: ", docRef.id);
                document.getElementById(formID).reset();
                mainModal("Thank You", "Your Form has been successfully submited. We will reply as soon as possible.");

            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                mainModal("ERROR", "Something Went Wrong !");
            });

    }
    else {
        docRef.add({
            name: name,
            email: email,
            phone: phone,
            message: message,
            time: myTimestamp
        })
            .then((docRef) => {
            sendMail({ name: name,
            email: email,
            phone: phone,
            message: message,
              type: "Request",
            time: myTimestamp});
                console.log("Document written with ID: ", docRef.id);
                document.getElementById(formID).reset();
                mainModal("Thank You", "Your Form has been successfully submited. We will reply as soon as possible.");

            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                mainModal("ERROR", "Something Went Wrong !");
            });

    }
}
