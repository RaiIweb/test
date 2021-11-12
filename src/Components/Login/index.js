import React from "react";
import './index.css';

function Login() {

  async function handleSubmit(e) {
    e.preventDefault()
    console.log('form submit')

    console.log(e.target.email.value)
    console.log(e.target.password.value)

    let formValues = {
      email : e.target.email.value,
      password : e.target.password.value
    }

    try {

      let login = await fetch('https://gameback-end.herokuapp.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(formValues)
      })

      let result = await login.json();

      console.log(result)
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div className="loginwrapper">
      <h2>Login Form</h2>

      <form onSubmit={handleSubmit} method="post">
        <div className="imgcontainer">
          <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar" className="avatar" />
        </div>
        <div className="container">
          <label for="uname">
            <b>Username</b>
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            required
          />

          <label for="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            required
          />

          <button type="submit">Login</button>
          <label>
            <input type="checkbox" checked="checked" name="remember" /> Remember
            me
          </label>
        </div>

        <div className="container" style={{ backgroundColor: "#f1f1f1" }}>
          <button type="button" className="cancelbtn">
            Cancel
          </button>
          <span className="psw">
            Forgot <a href="#">password?</a>
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
