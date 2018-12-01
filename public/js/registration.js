const inputUsernameRegistration = document.getElementById('input-username-registration');
const inputPasswordRegistration = document.getElementById('input-password-registration');
const inputPasswordRepeatRegistration = document.getElementById('input-passwordRepeat-registration');
const btnLogin = document.getElementById('btnLogin');
const btnRegistration = document.getElementById('btnRegistration');
const errorRegistration = document.getElementById('error-registration');

btnLogin.addEventListener('click', function () {
    window.location.replace('./login')
});

btnRegistration.addEventListener('click', getRegistration);

function getRegistration() {
    clear();
    const usernameRegistrationValue = inputUsernameRegistration.value;
    const passwordRegistrationValue = inputPasswordRegistration.value;
    const passwordRegistrationRepeatValue = inputPasswordRepeatRegistration.value;
    if (usernameRegistrationValue === '' || passwordRegistrationValue === '' || passwordRegistrationRepeatValue === ''){
        return errorRegistration.innerHTML = 'All fields are required';
    }
    if (passwordRegistrationValue !== passwordRegistrationRepeatValue) {
        return errorRegistration.innerHTML = 'Passwords do not match';
    }
    let user = {
        username: usernameRegistrationValue,
        password: passwordRegistrationValue
    };

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', 'http://localhost:8089/registration', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    let json = JSON.stringify(user);
    xhr.send(json);

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.response.error) {
            return errorRegistration.innerHTML = 'Error: ' +  xhr.response.error.message;
        }
        if (xhr.status !== 200) {
            return errorRegistration.innerHTML = 'Error: ' + (this.status ? this.statusText : 'запрос не удался');
        }
        if (xhr.response.success) {
            window.location.replace('./login');
        }
    };
}

function clear() {
    errorRegistration.innerHTML = '';
}






