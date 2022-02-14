// ==UserScript==
// @name        JIRA Links
// @namespace   http://github.com/
// @description Link JIRA issues by patterns. Change variables below to match your issue pattern and JIRA URL
// @include     https://app.slack.com/*
// @include     https://github.com/Tradeswell/*
// @updateURL   https://raw.githubusercontent.com/egarcia-tw/egarcia-tw/main/jira-link/user.js
// @version     1.02
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// ==/UserScript==

localStorage['issue-patterns'] = "ENG-\\d+";
localStorage['jira-url'] = "https://tradeswell.atlassian.net/";

function replaceInElement(element, find, replace) {
    for (var i= element.childNodes.length; i-->0;) {
        var child= element.childNodes[i];
        if (child.nodeType==1) {
            var tag= child.nodeName.toLowerCase();
            if (tag!='style' && tag!='script')
                replaceInElement(child, find, replace);
        } else if (child.nodeType==3) { // TEXT_NODE
            replaceInText(child, find, replace);
        }
    }
}

function replaceInText(text, find, replace) {
    var match;
    var matches= [];
    while (match= find.exec(text.data))
        matches.push(match);
    for (var i= matches.length; i-->0;) {
        match= matches[i];
        text.splitText(match.index);
        text.nextSibling.splitText(match[0].length);
        text.parentNode.replaceChild(replace(match), text.nextSibling);
    }
}

setTimeout(function() {
    var find = new RegExp('\\b\(' + localStorage['issue-patterns'] + '\)\\b', 'gi');

    replaceInElement(document.body, find, function(match) {
        var link= document.createElement('a');
        link.href= localStorage['jira-url'] + 'browse/' + match[0].replace(/([A-Z]+)(\d+)/,'\$1-\$2');
        link.appendChild(document.createTextNode(match[0]));
        return link;
    });
}, 1000); // bumped to 5 seconds due to slack loading times
