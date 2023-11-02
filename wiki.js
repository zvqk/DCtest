const List = document.getElementById("list");

const WhitespaceTags = ["PRE","H1","H2","H3","H4","H5","H6","LI"];

function RemoveNewlines(Element){
	if(WhitespaceTags.includes(Element.tagName)){
		let Next = Element.nextSibling;
		if(!Next||Next.tagName)return;
		Next.textContent=Next.textContent.replace(/^[\n\r]/,"")
	}
}

async function CheckHash(){
	let Hash = window.location.hash;
	let RHash = Hash;
	if(Hash.length<1)Hash="#home";
	Hash = Hash.substring(1);
	if(Hash.length<1)Hash="home";
	try{
		let Response = await fetch(`https://fireyauto.github.io/DistrictCascade/wikipages/${Hash}.txt`);
		Response = await Response.text();
		if(window.WikiParse){
			let Side = document.getElementById("side");
			Side.innerHTML = window.WikiParse(Response);
			for(let C of Side.childNodes)
				RemoveNewlines(C);
		}
	}catch(E){
		console.error(E);
	}
	ClearActiveWikis();
	for(let C of List.childNodes)
		if(C.href.match(new RegExp(`${RHash}$`,""))){AddActiveWiki(C);break}
}

function AddActiveWiki(E){
	if(!E.classList.contains("active-wiki"))
		E.classList.add("active-wiki");
}

function RemoveActiveWiki(E){
	if(E.classList.contains("active-wiki"))
		E.classList.remove("active-wiki");
}

function ClearActiveWikis(E){
	for(let C of List.childNodes)
		if(C==E)continue;
		else RemoveActiveWiki(C);
}

function Click(){
	ClearActiveWikis();
	AddActiveWiki(this);
}

window.addEventListener("load",async()=>{
	try{
		let Response = await fetch(`https://fireyauto.github.io/DistrictCascade/scripts/files.json`);
			Response = await Response.json();
		for(let Item of Response){
			let [Name,Link] = Item;
			let Element = document.createElement("a");
			Element.href = `#${Link}`;
			Element.innerHTML = Name;
			List.appendChild(Element);
			//Element.onclick = Click;
		}
	}catch(E){
		console.error(E);
	}
	
	CheckHash();
});
window.addEventListener("hashchange",CheckHash);