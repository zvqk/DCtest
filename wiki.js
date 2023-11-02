window.addEventListener("load",async ()=>{
	let Hash = window.location.hash;
	if(Hash.length<1)return;
	Hash = Hash.substring(1);
	if(Hash.length<1)return;
	try{
		let Response = await fetch(`https://fireyauto.github.io/DistrictCascade/wikipages/${Hash}.txt`);
		document.getElementById("content").innerHTML = await Response.text();
	}catch(E){
		console.error(E);
	}
});