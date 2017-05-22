var p = document.getElementById("input");
var size = document.getElementById("size");
p.innerHTML="";
var p1 = ["мудо", "руко", "жопо", "долбо", "пиздо", "ебло", "хуе", "нацисто", "свастико", "разврато", "зло"];
var p2 = ["глазое", "рукое", "ногое", "иобаноё", "крученое", "подобное"];
var p3 = ["уёбище", "хваталище", "ебалово", "ибланистче", "исчадие", "копание", "шипение", "плетение", "блядство"];
function random(min, max) {  
 return Math.floor(Math.random() * (max - min + 1)) + min; 
}
function hell()
{
	p.innerHTML += " - " + p1[random(0,p1.length-1)] + p2[random(0,p2.length-1)] + " " + p1[random(0,p1.length-1)] + p3[random(0,p3.length-1)] + "<br>";
}
function generate()
{
	for(var i=0; i<100; i++)
	{
		hell();
	}
}
generate();
var s = size.value+"% Arial";
function Size()
{
	s = size.value+"% Arial";
	document.body.style.font = s;
}
//document.body.style.font = "200% Arial";
//document.body.style.backgroundColor = prompt('background color?', 'green');
setInterval(Size,50);