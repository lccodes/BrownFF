//Logs the user into NFL.comm
document.addEventListener('DOMContentLoaded', function () {
	//Fetch usrname
	alert("Test");
	document.getElementById("registration-username").value = "GLAMORADMIN";
	//Fetch pssword
	document.getElementById("registration-password").value = "wepraytojack"
	//Forget me
	$("[type=checkbox]").checked =false;
	//Submit
	document.getElementsByClassName("button button-royal-blue")[0].click();
});