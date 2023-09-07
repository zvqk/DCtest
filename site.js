const SelectMetadata = Query=>document.head.querySelector(`meta[${Query}]`),
	GetMetadata = Query=>{let M=SelectMetadata(Query);return M?M.getAttribute(Query):null};

function OnLoad(){
	//{{ Website Title }}\\
	let SiteTitle = document.head.querySelector("title"),
		PageName = GetMetadata("page-name");
	if(SiteTitle&&PageName)
		SiteTitle.innerHTML = `${PageName} | District Cascade`;
	//{{ Nav Links }}\\
	let LinksElement = document.getElementById("links"),
		Links = {
		"Home": "index.html",
		"Wiki": "index.html",
		"Custom Maps API": "index.html",
	};
	for(let Name in Links){
		let Value = Links[Name];
		let Element = document.createElement("a")
		Element.href = Value;
		Element.innerHTML = Name;
		LinksElement.appendChild(Element);
	}
	//{{ Replacements }}\\
	/*
	let Replacements = document.querySelectorAll("replace");
	let Replaces = {
		"title": "",
	}
	Replacements.forEach((Element)=>{
		Element.insertAdjacentHTML("beforeBegin",Replaces[Element.getAttribute("with")]||"")
		Element.remove();
	})
	*/
}

window.onload = OnLoad;