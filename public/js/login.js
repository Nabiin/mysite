  
  function displayerror(args) {
    document.querySelector(".warning p").textContent = `*** 🐜Error📢📢${args} ***`;
    document.querySelector("p").style.color = "red";

  } 


const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  //console.log(email, password);
  if (email && password) {
    axios
      .post("/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        window.location.href = '/'
      })
      .catch((error) => {
        console.log(error.response)
        if (error.response.status === 404){
          displayerror(error.response.data);
          console.log(error.response.data)
        }else if(error.response.status === 400){
          displayerror(error.response.data);    
        }
      });
  }
  e.preventDefault();
});
