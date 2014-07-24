document.addEventListener('DOMContentLoaded', function () {
	firstInvite = document.getElementsByClassName("Grid-u Btn Btn-primary Btn-short yfa-rapid-beacon yfa-rapid-module-invite-to-league  yfa-overlay-trigger");
	if(firstInvite.length != 0){
		firstInvite[0].innerHTML = "";
		firstInvite[0].className = "goodbye";
	}

	secondInvite = document.getElementsByClassName("Btn  Btn Btn-save small yfa-rapid-beacon yfa-rapid-module-invite-to-league-next-steps  yfa-overlay-trigger Btn-primary");
	if(secondInvite.length != 0){
		secondInvite[0].innerHTML = "";
		secondInvite[0].className = "";
	}
	//Nix the button
	document.getElementsByClassName("Btn-primary Btn-primary-save My-med  yfa-rapid-beacon yfa-rapid-module-invite-to-league-email")[0].disabled = true;
	document.getElementsByClassName("Btn-primary Btn-primary-save My-med  yfa-rapid-beacon yfa-rapid-module-invite-to-league-email")[0].value = "Sorry, blocked!";
	document.getElementsByClassName("Btn-primary Btn-primary-save My-med  yfa-rapid-beacon yfa-rapid-module-invite-to-league-email")[0].id = "nope";
	document.getElementsByClassName("Fz-lg")[1].innerHTML = "Nice try!";
	//No Invite URL
	document.getElementById("inviteurl").value = "Nope."
	//No twitter or FB
	document.getElementsByClassName("Btn Bg-twitter small yfa-rapid-beacon yfa-rapid-module-invite-to-league-twitter F-icon Fz-sm No-bdr P-lg")[0].disabled = true;
	document.getElementById("send_fbrequests").href = "No.com";
	document.getElementById("send_fbrequests").disabled = true;
	//No Invite Button
	document.getElementsByClassName("Grid-u Btn Btn-primary Btn-short yfa-rapid-beacon yfa-rapid-module-invite-to-league  yfa-overlay-trigger")[0].innerHTML = "";
	document.getElementsByClassName("Grid-u Btn Btn-primary Btn-short yfa-rapid-beacon yfa-rapid-module-invite-to-league  yfa-overlay-trigger")[0].href = "";
	document.getElementsByClassName("Grid-u Btn Btn-primary Btn-short yfa-rapid-beacon yfa-rapid-module-invite-to-league  yfa-overlay-trigger")[0].className = "";
});
