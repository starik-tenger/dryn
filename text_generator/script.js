var paragraph = document.getElementById("paragraph");
var input = document.getElementById("input");
var stata = document.getElementById("stata");

var alphabetDown = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
var alphabetUp = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";


function randomInterval(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normal(a,b,n)
{
	var s=0;
	for(var i=0; i<n; i++)
	{
		s+=randomInterval(a,b);
	}
	s=Math.round(s/n);
	return s;
}

function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}

var vowels = "аоуыяэюеи";

//getting words--------------------------------------------------------------------------------------------------------------------------------
var nounsList = getXmlHttp();
	nounsList.open('GET', 'words/nouns.txt', false);
	nounsList.send(null);
	var nouns = nounsList.responseText;
	var nounsArray = nouns.split(' ');
var adjectivesList = getXmlHttp();
	adjectivesList.open('GET', 'words/adjectives.txt', false);
	adjectivesList.send(null);
	var adjectives = adjectivesList.responseText;
	var adjectivesArray = adjectives.split(' ');
var verbsList = getXmlHttp();
	verbsList.open('GET', 'words/verbs.txt', false);
	verbsList.send(null);
	var verbs = verbsList.responseText;
	//hard way of getting werbs
	var verbsArray = [];
	var verb = [];
	for(var i = 0; i < verbs.length; i++)
	{
		if(alphabetUp.indexOf(verbs[i]) != -1)
		{
			if(verb.length != 0)
			verbsArray.push(verb.join(""));
			verb = [];
			verb.push(alphabetDown[alphabetUp.indexOf(verbs[i])]);
		}else
			verb.push(verbs[i]);
	}
var adverbsList = getXmlHttp();
	adverbsList.open('GET', 'words/adverbs.txt', false);
	adverbsList.send(null);
	var adverbs = adverbsList.responseText;
	var adverbsArray = adverbs.split(' ');

//case functions--------------------------------------------------------------------------------------------------------------------------------
const male = 0;
const female = 1;
const none = 2;

function getNounClass(word)
{
	switch(word[word.length-1])
	{
		case "а": case "я": case "ь":
			return female;
		case "е": case "о":
			return none;
		default:
			return male;
	}
}

function toCaseNoun(word, wordCase)
{
	newWord = word.split("");
	
	if ( vowels.indexOf(newWord[newWord.length-1]) == -1 && newWord[newWord.length-1] != "ь" && newWord[newWord.length-1] != "й")
	{
		switch(wordCase)
		{
			case 1:
				newWord.push("а");
				break;
			case 2:
				newWord.push("у");
				break;
			case 3:
				newWord.push("а");
				break;
			case 4:
				newWord.push("ом");
				break;
			case 5:
				newWord.push("е");
				break;
				
		}
	}else switch(newWord[newWord.length-1])
	{
		case "ь":
			switch(wordCase)
			{
				case 1:
					newWord[newWord.length-1] = "и";
					break;
				case 2:
					newWord[newWord.length-1] = "и";
					break;
				case 4:
					newWord.push("ю");
					break;
				
			}
			break;
		case "а":
			switch(wordCase)
			{
				case 1:
					newWord[newWord.length-1] = "и";
					break;
				case 2:
					newWord[newWord.length-1] = "е";
					break;
				case 3:
					newWord[newWord.length-1] = "у";
					break;
				case 4:
					newWord[newWord.length-1] = "ой";
					break;
				case 5:
					newWord[newWord.length-1] = "е";
					break;
			}
			break;
		case "я":
			switch(wordCase)
			{
				case 1:
					newWord[newWord.length-1] = "и";
					break;
				case 2:
					newWord[newWord.length-1] = "е";
					break;
				case 3:
					newWord[newWord.length-1] = "ю";
					break;
				case 4:
					newWord[newWord.length-1] = "ой";
					break;
				case 5:
					newWord[newWord.length-1] = "е";
					break;
			}
			break;
		case "о": 
			switch(wordCase)
			{
				case 1:
					newWord[newWord.length-1] = "а";
					break;
				case 2:
					newWord[newWord.length-1] = "у";
					break;
				case 3:
					newWord[newWord.length-1] = "о";
					break;
				case 4:
					newWord[newWord.length-1] = "ом";
					break;
				case 5:
					newWord[newWord.length-1] = "е";
					break;
			}
			break;
		case "е":
			switch(wordCase)
			{
				case 1:
					newWord[newWord.length-1] = "я";
					break;
				case 2:
					newWord[newWord.length-1] = "ю";
					break;
				case 3:
					newWord[newWord.length-1] = "е";
					break;
				case 4:
					newWord[newWord.length-1] = "ем";
					break;
				case 5:
					newWord[newWord.length-1] = "е";
					break;
			}
			break;
		case "й":
			switch(wordCase)
			{
				case 1:
					newWord[newWord.length-1] = "я";
					break;
				case 2:
					newWord[newWord.length-1] = "ю";
					break;
				case 3:
					newWord[newWord.length-1] = "я";
					break;
				case 4:
					newWord[newWord.length-1] = "ем";
					break;
				case 5:
					newWord[newWord.length-1] = "е";
					break;
			}
			break;
	}
	
	return newWord.join("");
}


function toClassAdjective(word, adjClass)
{
	var newWord = word.split("");
	var ending = word[word.length-2] + word[word.length-1];
	var newEnding = ending;
	var exp1 = "чжшщк"; //исключения (сущий, черепаший)
	newWord.splice(word.length-2, 2);
	switch(adjClass)
	{
		case male:
			if(exp1.indexOf(newWord[newWord.length-1]) == -1)
				newEnding = "ый";
			else
				newEnding = "ий";
			break;
		case female:
			newEnding = "ая";
			break;
		case none:
			if(exp1.indexOf(newWord[newWord.length-1]) == -1)
				newEnding = "ое";
			else
				newEnding = "ее";
	}
	return newWord.join("") + newEnding;
}

function toCaseAdjective(word, wordCase)
{
	var newWord = word.split("");
	var ending = word[word.length-2] + word[word.length-1];
	var newEnding = ending;
	newWord.splice(word.length-2, 2);
	switch(ending)
	{
		case "ый": case"ий": case "ой": case "ое": case "ее":
			switch(wordCase)
			{
				case 1: case 3:
					newEnding = "ого";
					break;
				case 2:
					newEnding = "ому";
					break;
				case 4:
					newEnding = "ым";
					break;
				case 5:
					newEnding = "ом";
					break;
			}
			break;
		case "ая":
			switch(wordCase)
			{
				case 1: case 2: case 4: case 5:
					newEnding = "ой";
					break;
				case 3:
					newEnding = "ую";
					break;
			}
			break;
	}
	return newWord.join("") + newEnding;
}

//time consts
const PAST = 0;
const PRESENT = 1;
const FUTURE = 2;

function toCaseVerb(word, time, genus)
{
	var newWord = word.split("");
	var ending;
	//варианты окончаний
	var e1 = word[word.length-1];                                            //1 буква
	var e4 = word[word.length-4] + word[word.length-3] + word[word.length-2] + word[word.length-1];                  //4 буквы
	var e3 = word[word.length-3] + word[word.length-2] + word[word.length-1];//3 буквы
	if(e3 == "ать" || e3 == "еть" || e3 == "ить" || e3 == "ять")
	{
		ending = e3;
		newWord.splice(word.length-3, 3);
	}else if(e4 == "ться")
	{
		ending = e4;
		newWord.splice(word.length-4, 4);
	}
	var newEnding = ending;
	switch (time)
	{
		case PAST:
			switch (genus)
			{
				case male:
					switch(ending)
					{
						case "ать":
							newEnding = "ал";
							break;
						case "ять":
							newEnding = "яла";
							break;
						case "ить":
							newEnding = "ил";
							break;
						case "еть":
							newEnding = "ел";
							break;
						case "ться":
							newEnding = "лся";
							break;
					}
					break;
				case female:
					switch(ending)
					{
						case "ать":
							newEnding = "ала";
							break;
						case "ять":
							newEnding = "яла";
							break;
						case "ить":
							newEnding = "ила";
							break;
						case "еть":
							newEnding = "ела";
							break;
						case "ться":
							newEnding = "лась";
							break;
					}
					break;
				case none:
					switch(ending)
					{
						case "ать":
							newEnding = "ало";
							break;
						case "ять":
							newEnding = "яла";
							break;
						case "ить":
							newEnding = "ило";
							break;
						case "еть":
							newEnding = "ело";
							break;
						case "ться":
							newEnding = "лось";
							break;
					}
					break;
			}
			break;
		case PRESENT:
			switch (ending)
			{
				case "ать":
					newEnding = "ает";
					break;
				case "ить":
					newEnding = "ит";
					break;
				case "еть":
					newEnding = "ит";
					break;
				case "ться":
					newEnding = "ется";
					break;
			}
			break;
	}
	return newWord.join("") + newEnding;
	
}


//forms
const NOUN = 0;
const VERB = 1;
const ADJECTIVE = 2;
const ADVERB = 3;

const OWN = 666;

var innerWords = ["однако", "но при этом", "стоит заметить, что", "в итоге", "итак, ", "может быть,", "таким образом,", "из этого следует, что", "получается,", "в связи с этим", "тем временем"];

var useNouns = [];
var useVerbs = [];
var useAdjectives = [];
var useAdverbs = [];
for(var i=0; i<100; i++)
{
	useNouns.push(nounsArray[randomInterval(0, nounsArray.length-1)]);
	useAdjectives.push(adjectivesArray[randomInterval(0, adjectivesArray.length-1)]);
	useVerbs.push(verbsArray[randomInterval(0, verbsArray.length-1)]);
	useAdverbs.push(adverbsArray[randomInterval(0, adverbsArray.length-1)]);
}

var adjectiveEndings = ["ой", "ий", "ая", "яя", "ое", "ее", "ие", "ые", "ого", "ой", "ых", "их", "ую", "ом", "его", "ым", "ый"];
var verbEndings = ["ать", "еть", "ыть", "ить", "ять", "ал", "ала", "ает", "ет", "ела", "ит", "ел", "ил", "ться", "лся", "лась", "лось", "ало"];
var nounEndings = ["а", "е", "о", "ь", "я", ""];

var gotAdjectives = [];

function getWord(innerWord)
{
	var word = innerWord.split("");
	var type;
	var e1 = word[word.length-1];                                            //1 буква
	var e2 = word[word.length-2] + word[word.length-1];                      //2 буквы
	var e3 = word[word.length-3] + word[word.length-2] + word[word.length-1];//3 буквы
	if(adjectiveEndings.indexOf (e2) != -1)
	{
		word.splice(word.length-2, 2);
		word.push("ый");
		type = ADJECTIVE;
	}else if(adjectiveEndings.indexOf (e3) != -1)
	{
		word.splice(word.length-3, 3);
		word.push("ый");
		type = ADJECTIVE;
	}else if(e1 == "о" && adverbsArray.indexOf(innerWord) != -1)
	{
		type = ADVERB;
	}else if(verbEndings.indexOf (e2) != -1)
	{
		word.splice(word.length-2, 2);
		word.push("ать");
		type = VERB;
	}else if(verbEndings.indexOf (e3) != -1)
	{
		word.splice(word.length-3, 3);
		word.push("ать");
		type = VERB;
	}else
	{
		var newWord = word;
		for(var i=0; i<4; i++)
		{
			newWord = word;
			newWord.splice(newWord.splice-i, i);
			for(var j=0; j<nounEndings.length; j++)
			{
				var newWord1 = newWord.slice();
				newWord1.push(nounEndings[j])
				newWord1 = newWord1.join("");
				if(nounsArray.indexOf(newWord1) != -1)
				{
					return {word: newWord1, type: NOUN};
				}
			}
		}
		return {word: "0", type: NOUN};
	}
	return {word: word.join(""), type: type};
}

//формы предложений
var centenseForms = [
	[ {type: NOUN, wordCase: 0}, {type: VERB, time: PRESENT} ],
	[ {type: ADJECTIVE, wordCase: 0}, {type: NOUN, wordCase: 0}, {type: VERB, time: PRESENT} ],
	[ {type: NOUN, wordCase: 0}, {type: ADVERB}, {type: VERB, time: PRESENT} ],
	[ {type: NOUN, wordCase: 0}, {type: VERB, time: PAST} ],
	[ {type: ADJECTIVE, wordCase: 0}, {type: NOUN, wordCase: 0}, {type: VERB, time: PAST} ],
	[ {type: NOUN, wordCase: 0}, {type: ADVERB}, {type: VERB, time: PAST} ],
	[ {type: NOUN, wordCase: 0}, {type: OWN, content: "может быть"}, {type: ADJECTIVE, wordCase: 4}]
];

var k = 1;

function centense()
{
	var main = "";
	var inner = "";
	if(randomInterval(0,2)==0)
	inner = innerWords[randomInterval(0, innerWords.length-1)] + " ";
	var noun = useNouns[normal(0, useNouns.length-1, k)];
	var centenseNouns = [];//используются в предложении
	for(var i=0; i<5; i++)
	{
		centenseNouns.push(useNouns[normal(0, useNouns.length-1, k)]);
	}
	
	var adverb = useAdverbs[randomInterval(0, useAdverbs.length-1)];
	var adjective = useAdjectives[randomInterval(0, useAdjectives.length-1)];
	var verb = useVerbs[randomInterval(0, useVerbs.length-1)];
	var nounClass = getNounClass(noun);
	
	var nounCount = 0;
	choise = randomInterval(0, centenseForms.length-1);
	for(var i=0; i<centenseForms[choise].length; i++)
	{
		var word = centenseForms[choise][i];
		switch(word.type)
		{
			case NOUN:
				main += toCaseNoun(centenseNouns[nounCount], word.wordCase);
				nounCount++;
				break;
			case VERB:
				main += toCaseVerb(verb, word.time, getNounClass(centenseNouns[nounCount]));
				break;
			case ADJECTIVE:
				main += toCaseAdjective (toClassAdjective(adjective, getNounClass(centenseNouns[nounCount])), word.wordCase);
				break;
			case ADVERB:
				main += adverb;
				break;
			case OWN:
				main += word.content;
		}
		if(i < centenseForms[choise].length-1)
			main += " ";
	}
	
	main += ".";
	if(randomInterval(0,10) == 0)
	{
		main += "<br><br>";
	}
	
	main = inner + main + " ";
	var end = main.split("");
	if(alphabetDown.indexOf(end[0]) == -1)end.splice(0, 1);
	end[0] = alphabetUp[alphabetDown.indexOf(main[0])]
	
	return end.join("");
}



function generate()
{
	var inputText = input.value.split("");
	var wordList = [];
	var newWord = [];
	for(var i = 0; i < inputText.length; i++)
	{
		if(alphabetUp.indexOf(inputText[i]) != -1)
		{
			inputText[i] = alphabetDown[alphabetUp.indexOf(inputText[i])];
		}
		if(alphabetDown.indexOf(inputText[i]) == -1)
		{
			if(newWord.length>3)
			wordList.push(newWord.join(""));
			newWord = [];
		}else{
			newWord.push(inputText[i]);
		}
	}
	useNouns = [];
	useVerbs = [];
	useAdjectives = [];
	useAdverbs = [];
	for(var i = 0; i < wordList.length; i++)
	{
		var wordChar = getWord(wordList[i]);
		if(wordChar.word.length>3)
		switch(wordChar.type)
		{
			case NOUN:
				useNouns.push(wordChar.word);
				break;
			case VERB:
				useVerbs.push(wordChar.word);
				break;
			case ADJECTIVE:
				useAdjectives.push(wordChar.word);
				break;
			case ADVERB:
				useAdverbs.push(wordChar.word);
				break;
		}
	}
	
	paragraph.innerHTML = "";
	for(var i=0; i<document.getElementById("size").value; i++)
	{
		paragraph.innerHTML +=  centense();
	}
	
	var words = paragraph.innerHTML.split(" ");
	
	stata.innerHTML = "символов: " + paragraph.innerHTML.length + "; слов: " + (words.length-1);
	
	input.rows = testInput.rows;
	
}
