function validation(values) {
  let error = {}

  const name_pattern = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{5,15}$/;
  const email_pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/
  const password_pattern = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{5,13}$/;

  if(values.name === "") {
    error.name = "Name is required!"
  } else if (!values.name.match(name_pattern)) {
    error.name = "Name must be 5-15 characters, include lowercase letter and number!";
  } else {
    error.name = ""
  }

  if(values.email === "") {
    error.email = "Email is required!"
  } else if (!values.email.match(email_pattern)) {
    error.email = "Email must be in format: example@domain.com (.com/.vn...)!"
  } else {
    error.email = ""
  }

  if(values.password === "") {
    error.password = "Password is required!"
  } else if (!values.password.match(password_pattern)) {
    error.password = "Password must be 5-13 characters, include lowercase letter and number!"
  } else {
    error.password = ""
  }
  return error;
}

export default validation