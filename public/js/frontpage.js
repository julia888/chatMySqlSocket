const btnLogin = document.getElementById('btnLogin');
const btnRegistration = document.getElementById('btnRegistration');

btnLogin.addEventListener('click', ()=>{
   window.location.replace('./login.html')
});
btnRegistration.addEventListener('click', ()=>{
    window.location.replace('./registration.html')
});
