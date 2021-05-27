//listen for auth status changes
auth.onAuthStateChanged(user=>{
  //get data
  if (user){
    db.collection('order').get().then(snapshot => {
      setupOrderList(snapshot.docs);
      setupUI(user);
    });
  }else{
    setupOrderList([]);
    setupUI();
  }
});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click',(e) =>{
  e.preventDefault();
  auth.signOut().then();
});

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  //get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  auth.signInWithEmailAndPassword(email,password).then(cred=>{
    // close the login modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });

});