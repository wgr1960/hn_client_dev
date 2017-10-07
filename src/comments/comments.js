/*
    Handles comments logic
*/

'use strict';

var newsService = require('./../js/services.js');
var comments = [];
var idNum;
var nes

function removeTopStoriesElementsIfExist() {
    var topStoriesContainer = document.getElementById('topStoriesContainer');
    var limitBtnContainer = document.getElementById('limitBtnContainer');

    removeElement(topStoriesContainer);
    removeElement(limitBtnContainer);
};

function removeElement(element) {
    if (element) {
        var parent = element.parentNode;
        parent.removeChild(element);
    }
}

function addCommentParentNode() {
    if (!document.getElementById('commentsContainer')) {
        var commentsContainer = document.createElement('div');
        commentsContainer.id = 'commentsContainer';

        var title = document.createElement('h1');
        title.className = 'title';
        title.innerText = 'Comments';

        commentsContainer.appendChild(title);
        document.getElementById('app').appendChild(commentsContainer);
    }
}

function getKids(id) {
    newsService.fetchKids(id).then(function(response) {
        if (response) {
            getComments(response.kids);
        }
    });

}

function getComments(kids) {
    var commentsPromises = [];
    for (var i = 0; i < kids.length; ++i) {
        commentsPromises.push(newsService.genericFetch(kids[i]));
    }

    Promise.all(commentsPromises).then(function(response) {
        var allCommentPromises = [];
        for (var i = 0; i < response.length; ++i) {
            allCommentPromises.push(response[i].json());
        }
        return Promise.all(allCommentPromises);
    }).then( function(comments) {
        for (var i = 0; i < comments.length; ++i) {
            generateComments(comments[i], i);
        }
    });
}

function generateComments(comment, index) {
    var commentRow = document.createElement('div');
    commentRow.className = 'comment-row--container';

    // Comment Paragraph
    var commentParagraph = document.createElement('p');
    commentParagraph.className = 'comment';
    commentParagraph.innerText = comment.text;

    commentRow.appendChild(commentParagraph);

    var commentsContainer = document.getElementById('commentsContainer');
    
    if (commentsContainer) {
        commentsContainer.appendChild(commentRow);
    }

    if (comment.hasOwnProperty('kids') && comment.kids.length) {
        for (var i = 0; i < comment.kids.length; ++i) {
            getComments(comment.kids[i]);
        }
    }
}


module.exports = function initialize(id) {
    idNum = id;
    removeTopStoriesElementsIfExist();
    addCommentParentNode();
    getKids(id);
}