const inputUsernameLogin = document.getElementById('input-username-login');
const inputPasswordLogin = document.getElementById('input-password-login');
const btnLogin = document.getElementById('btnLogin');
const btnRegistration = document.getElementById('btnRegistration');
const errorLogin = document.getElementById('error-login');

btnRegistration.addEventListener('click', function () {
    window.location.replace('./registration')
});

btnLogin.addEventListener('click', getLogin);

function getLogin() {
    clear();
    const usernameLoginValue = inputUsernameLogin.value;
    const passwordLoginValue = inputPasswordLogin.value;
    if (usernameLoginValue === '' || passwordLoginValue === ''){
        return errorLogin.innerHTML = 'All fields are required';
    }
    let user = {
        username: usernameLoginValue,
        password: passwordLoginValue
    };

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', 'http://localhost:8089/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    let json = JSON.stringify(user);
    xhr.send(json);

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.response.error) {
            return errorLogin.innerHTML = 'Error: ' +  xhr.response.error.message;
        }
        if (xhr.response.errorNull) {
            return errorLogin.innerHTML = 'Error: ' +  xhr.response.errorNull.message;
        }
        if (xhr.status !== 200) {
            errorLogin.innerHTML = 'Error: ' + (this.status ? this.statusText : 'request failed');
        }
        if (xhr.response.success){
            localStorage.setItem('user', user.username);
            window.location.replace('./chat')
        }
    };
}

function clear() {
    errorLogin.innerHTML = '';
}









