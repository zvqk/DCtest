const Colors = {
	red:"#df1c4a",
	green:"#1cdf7a",
	blue:"#1c7adf",
	yellow:"#dfca1c",
	orange:"#df8a1c",
	purple:"#8a1cdf",
	pink:"#df1c9a",
}

const RarityColors = {
	Common: "#ffffff",
	Uncommon: "#3fb929",
	Rare: "#437fe7",
	Epic: "#7938da",
	Legendary: "#ffd747",
	Mythical: "#ff1c4a",
	Exotic: "#cf55ff",
	Exclusive: "#ff63ea",
	VIP: "#ffaa3c",
}

window.FVars = {};

String.prototype.escapeHTML = function(){
	let v = this.replace(/\&/g,"&amp;");
    v = v.replace(/\</g,"&lt;");
    v = v.replace(/\"/g,"&quot;");
    v = v.replace(/\>/g,"&gt;");
    v = v.replace(/\'/g,"&apos;");
    return v;
}

String.prototype.isHTMLChar = function(Char){
	return (this=="&lt;"&&Char=="<")||(this=="&gt;"&&Char==">")||(this=="&quot;"&&Char=="\"")||(this=="&amp;"&&Char=="&")||(this=="&apos;"&&Char=="'")
}

String.prototype.toHTMLChar = function(){
	return {"\"":"&quot;","'":"&apos;","<":"&lt;",">":"&gt;","&":"&amp;"}[this];
}

const ColorText =(t,c)=>`<span style="color:${c};">${t}</span>`;

const RT=(a,...x)=>a("$&",...x);
const REP = (Text,Reg,Rep)=>Text.replace(Reg,Rep);

function IterateMatches(Result,M){
	for(let	k in M){
		let MA = M[k];
		let DidMatch=true;
		if(MA.hasOwnProperty("match")){
			let REX=MA.match;
			let R=Result;
			if(!MA.hasOwnProperty("matches")){
				Result=REP(Result,REX,MA.call);
				DidMatch=R!=Result;
			}else if(Result.match(REX)){
				let RES=IterateMatches(Result,MA.matches);
				DidMatch=R!=RES;
				if(!DidMatch)Result=REP(Result,REX,MA.call);
				else {
					Result=RES;
					continue;
				}
			}
		}
		if(MA.hasOwnProperty("matches")&&DidMatch)
			Result=IterateMatches(Result,MA.matches);
	}
	return Result;
}

const Matches = [
	{
		name:"Quotations",
		match:/(\"(.+?)\")/g,
		call:function(_,_,x){
			return `“${x}”`;
		}
	},
	{
		name:"Arrow",
		match:/(\-\>\s*(.+))/g,
		call:function(_,_,x){
			return `→ ${x}`;
		}
	},
	{
		name:"DoubleArrow",
		match:/(\=\>\s*(.+))/g,
		call:function(_,_,x){
			return `⇒ ${x}`;
		}
	},
	{
		name:"Ellipsis",
		match:/(\.{3})/g,
		call:function(){
			return "…";
		}
	},
	{
		name:"Pre",
		match:/(\{pre\}\s*(.+))/g,
		call:function(_,_,x){
			return `<pre>${x}</pre>`;
		}
	},
	{
		name:"ListStart",
		match:/(\{uls\})/g,
		call:function(){
			return "<ul>";
		}
	},
	{
		name:"ListEnd",
		match:/(\{ule\})/g,
		call:function(){
			return "</ul>";
		}
	},
	{
		name:"OListStart",
		match:/(\{ols\})/g,
		call:function(){
			return "<ol>";
		}
	},
	{
		name:"OListEnd",
		match:/(\{ole\})/g,
		call:function(){
			return "</ol>";
		}
	},
	{
		name:"Header",
		match:/((\#+)\s*(.+))/g,
		call:function(_,_,h,x){
			let hm = h.length;
			return `<h${hm}>${x}</h${hm}>`;
		}
	},
	{
		name:"Color",
		match:/(\{\(c\:([A-Fa-f0-9]{6})\)\s*(.*?)\})/g,
		call:function(_,_,c,t){
			return ColorText(t,"#"+c);
		}
	},
	{
		name:"Colors",
		match:/(\{\(cn\:(\w+)\)\s*(.*?)\})/g,
		call:function(_,_,cn,t){
			return ColorText(t,Colors[cn]||cn);
		}
	},
	{
		name:"TimeStamp",
		match:/(\{\(ts\)\s*(.*?)\})/g,
		call:function(_,_,t){
			return `<span class="example">${t}</span>`;
		}
	},
	{
		name:"Tag",
		match:/(\{\(tag\:\s*([A-Fa-f0-9]{6})\)\s*(.*?)\})/g,
		call:function(_,_,c,t){
			return `<span class="tag" style="background:#${c}">${t}</span>`;
		}
	},
	{
		name:"Bold",
		match:/(\*{2}(.+?)\*{2})/g,
		call:function(_,_,x){
			return `<b>${x}</b>`;
		}
	},
	{
		name:"Italics",
		match:/(\*(.+?)\*)/g,
		call:function(_,_,x){
			return `<i>${x}</i>`;
		}
	},
	{
		name:"Underline",
		match:/(\_{2}(.+?)\_{2})/g,
		call:function(_,_,x){
			return `<u>${x}</u>`;
		}
	},
	{
		name:"Example",
		match:/(ex\:\s*(.+))/g,
		call:function(_,_,x){
			return `<span class="example">Ex: ${x}</span>`;
		}
	},
	{
		name:"HR",
		match:/(\{hr\})/g,
		call:function(){
			return "<hr>";
		}
	},
	{
		name:"Link",
		match:/(\{\(l\:(.+?)\)\s*(.+?)\})/g,
		call:function(_,_,n,t){
			return `<a class="side-a" href="${t}">${n}</a>`;
		}
	},
	{
		name:"Image",
		match:/(\{\(i\:(.+?)\:(.+?)\:(.+?)\)\s*(.+?)\})/g,
		call:function(_,_,n,x,y,t){
			let extra=[];
			if(x&&x!="~")
				extra.push(`width="${x}px"`);
			if(y&&y!="~")
				extra.push(`height="${y}px"`);
			return `<img alt="${n}" src="${t}"${extra.join(" ")}></img>`;
		}
	},
	{
		name:"SetVariable",
		match:/(\{sv\:\s*(.+?)\}\s*(.+)[\r\n]?)/g,
		call:function(_,_,n,v){
			window.SVars[n]=v;
			return "";
		}
	},
	{
		name:"GetVariable",
		match:/(\{v\:\s*(.+?)\}[\r\n]*)/g,
		call:function(_,_,n){
			return window.SVars[n]||"";
		}
	},
	{
		name:"Price",
		match:/(\{price\:(.+?)\:(.+?)\})/g,
		call:function(_,_,n,c){
			return `Price: ${ColorText(n,"#1cdf7a")} <span class="smaller">${c}</span>`;
		}
	},
	{
		name:"Acronym",
		match:/(\{ac\:\s*(.+?)\})/g,
		call:function(_,_,t){
			return t.split("").join(".");
		}
	},
	{
		name:"Super",
		match:/(\{sp\:\s*(.+?)\})/g,
		call:function(_,_,t){
			return `<sup>${t}</sup>`;
		}
	},
	{
		name:"Currency",
		match:/(\{cr\})/g,
		call:function(){
			return "dc";
		}
	},
	{
		name:"TODO",
		match:/(\{TODO\})/g,
		call:function(){
			return "<b style=\"color:#df1c4a;\">TODO</b>";
		}
	},
	{
		name:"WikiReference",
		match:/(\{{2}(.+?)\:(.+?)\}{2})/g,
		call:function(_,_,t,n){
			return `<a class="side-a" href="#${t}">${n}</a>`;
		}
	},
	{
		name:"MultiLineCodeBlock",
		match:/(\`{3}[\r\n](.+?)[\r\n]\`{3})/gms,
		call:function(_,_,x){
			return `<pre class="multi-code-block">${x}</pre>`;
		}
	},
	{
		name:"SingleLineCodeBlock",
		match:/(\`([^\`]+?)\`)/g,
		call:function(_,_,x){
			return `<span class="single-code-block">${x}</span>`;
		}
	},
	{
		name:"Note",
		match:/(\|\s(.+))/g,
		call:function(_,_,x){
			return `<span class="note">${x}</span>`;
		}
	},
	{
		name:"Bullet",
		match:/(\^\s(.+))/g,
		call:function(_,_,x){
			return `<li>${x}</li>`;
		}
	},
	{
		name:"RarityColor",
		match:/(\{rc\:\s*(.+?)\})/g,
		call:function(_,_,n){
			return ColorText(n,RarityColors[n]||RarityColors.Common);
		}
	},
];

//{{ Function }}\\

window.WikiParse = function(Text){
	return IterateMatches(Text,Matches)//.replace(/[\n\r]/g,"<br>");
}