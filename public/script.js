
async function addUser(event) {
    event.preventDefault();
    const username = document.getElementById("username")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const obj = { username, email, password };

    if (!username || !email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    try {
        const res = await axios.post("http://localhost:3000/api/post", obj);

       
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        
        alert('Signup successful!');
        window.location.href = 'login.html';

    } catch (error) {
        console.error(error);
        alert('Something went wrong during signup.');
    }
}


async function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById("loginemail")?.value;
    const password = document.getElementById("loginpassword")?.value;

    if (!email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    try {
        const res = await axios.post("http://localhost:3000/api/login", { email, password });
        
        localStorage.setItem('token', res.data.token);
        alert(res.data.message);
         

        window.location.href = 'expense.html';
        
       
    } catch (error) {
        console.error(error);

        if (error.response && error.response.data && error.response.data.error) {
            alert(error.response.data.error);
        } else {
            alert('Something went wrong during login.');
        }
    }
}
