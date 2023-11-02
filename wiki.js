async function CheckHash(){
	let Hash = window.location.hash;
	if(Hash.length<1)return;
	Hash = Hash.substring(1);
	if(Hash.length<1)return;
	try{
		let Response = await fetch(`https://fireyauto.github.io/DistrictCascade/wikipages/${Hash}.txt`);
		Response = await Response.text()
		document.getElementById("side").innerHTML = Response;
	}catch(E){
		console.error(E);
	}
}

window.addEventListener("load",CheckHash);
window.addEventListener("hashchange",CheckHash);