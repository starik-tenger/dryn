function randomInterval(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var paragraph = document.getElementById("paragraph");
var input = document.getElementById("input");
var number = document.getElementById("size");
var first = document.getElementById("first");
var _button = document.getElementById("button");

var alphabetDown = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
var alphabetUp = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

var wordList = [];
var inputText = input.value;
function checkText()
{
	inputText = input.value.split("");
	var newWord = [];
	for(var i = 0; i < inputText.length; i++)
	{
		if(alphabetUp.indexOf(inputText[i]) != -1)
		{
			inputText[i] = alphabetDown[alphabetUp.indexOf(inputText[i])];
		}
		if(alphabetDown.indexOf(inputText[i]) == -1)
		{
			if(newWord.length>0)
			wordList.push(newWord.join(""));
			newWord = [];
		}else{
			newWord.push(inputText[i]);
		}
	}
}

var findWord = "";
var endText = [];

function findAll(array, elem)
{
	var idx = array.indexOf(elem);
	var indices = [];
	while (idx != -1) 
	{
	  indices.push(idx);
	  idx = array.indexOf(elem, idx + 1);
	}	
	return indices;
}

var wordGraph = [];
function setGraph()
{
	for(var i=0; i<wordList.length; i++)
	{
		var checkWord = wordList[i];
		wordGraph.push({word: wordList[i], other: []});
		wordGraph[i].other = findAll(wordList, checkWord);
		if(i%100==0)
			console.log(Math.round(i/wordList.length*100));
	}
}

function degenerate()
{
	endText = [];
	findWord = wordList[first.value];
	var find = first.value;
	for(var i=0; i<number.value; i++)
	{
		/*if(findWord == wordList[i])
		{
			endText.push(wordList[i]);
			findWord = wordList[i+1];
			i++;
		}*/
		endText.push(wordGraph[find].word);
		if(wordGraph[find].other.length != 0)
			find = wordGraph[find].other[randomInterval(0, wordGraph[find].other.length-1)]+1;
		else
			break;
	}
	
	paragraph.innerHTML = endText.join(" ");
}

function onButtonClick()
{
	inputText = input.value;
	wordList = [];
	wordGraph = [];
	checkText();
	setGraph();
	degenerate();
}