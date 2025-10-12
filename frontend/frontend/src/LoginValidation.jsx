function validation(values) {
  let error = {}
  const email_pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
  const password_pattern = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{5,13}$/;

  if(values.email === "") {
    error.email = "Email is required!"
  } else if (!values.email.match(email_pattern)) {
    error.email = "Email is invalid!"
  } else {
    error.email = ""
  }

  if(values.password === "") {
    error.password = "Password is required!"
  } else if (!values.password.match(password_pattern)) {
    error.password = "Password is invalid!"
  } else {
    error.password = ""
  }
  return error;
}

export default validation