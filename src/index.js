'use strict';

import './styles.scss';
var newsService = require('./js/services.js');
var stateHelper = require('./js/stateHelper.js');
var comments = require('./comments/comments.js');

// Variables
var topStories = [];
var storyDisplayRange;
var limitButton = null;


// Creates page Header DOM Elements
function setPageHeader() {
    // Container setup
    if (!document.getElementById('pageHeaderContainer')) {
        var pageHeaderContainer = document.createElement('div');
        pageHeaderContainer.id = 'pageHeaderContainer';
        
        // Page icon setup
        var pageIcon = document.createElement('img');
        pageIcon.className = 'page-icon';
        pageIcon.alt = 'Hacker News Icon';
        pageIcon.src = './src/images/icon.png';
    
        // Page header setup
        var pageHeader = document.createElement('h1');
        pageHeader.className = 'page-header';
        pageHeader.innerText = 'Hacker News';
    
        // Add Container and Elements
        pageHeaderContainer.appendChild(pageIcon);
        pageHeaderContainer.appendChild(pageHeader);
        document.getElementById('app').appendChild(pageHeaderContainer);
    }
}

// Sets Page Loader Until Page Contents Load
function setLoader() {
    if (!document.getElementById('pageLoader')) {
        var pageLoader = document.createElement('div');
        pageLoader.id = 'pageLoader';
        pageLoader.innerText = 'Loading... Please Wait.';
        document.getElementById('app').appendChild(pageLoader);
    }
}

// Removes Loader 
function removeLoader() {
    var loader = document.getElementById('pageLoader');
    if (loader) {
        document.getElementById('app').removeChild(loader);
    }
}

// Creates container for topStories
function setTopStoriesContainer() {
    var topStoriesContainer = document.createElement('div');
    topStoriesContainer.id = 'topStoriesContainer';

    var title = document.createElement('h1');
    title.className = 'title';
    title.innerText = 'Top Stories';

    topStoriesContainer.appendChild(title);
    document.getElementById('app').appendChild(topStoriesContainer);
}

// Adds Limit Button event listener and dom element
function addLimitButton() {
    if (!document.getElementsByClassName('limit-btn').length) {
        var limitButtonContainer = document.createElement('div');
        limitButtonContainer.id= 'limitBtnContainer';

        var limitButton = document.createElement('button');
        limitButton.className = 'limit-btn';
        limitButton.innerText = 'Show More';
        

        limitButtonContainer.appendChild(limitButton);
        document.getElementById('app').appendChild(limitButtonContainer);
    }
}


// Removes Limit Button event listener and dom element
function removeLimitButton() {
    var limitBtn = document.getElementsByClassName('limit-btn');
    if (limitBtn.length) {
        document.removeChild(limitBtn[0]);
    }
}

// Shows more top stories before reaching the end of the array and takes action on when its reaching array end
function showMoreStories() {
    var tempEndIndex = storyDisplayRange.endIndex + storyDisplayRange.limit;
    if (tempEndIndex < topStories.length) {
        storyDisplayRange.startIndex = storyDisplayRange.endIndex;
        storyDisplayRange.endIndex = tempEndIndex;
        getLimitedStories();
    } else {
        getLimitedStories();
        removeLimitButton();
    }
}

// Get Top Stories
function getTopStories() {
    return newsService.fetchTopStories().then(function(response) {
        if (Array.isArray(response)) {
            topStories = response;
        }
    });
}

// Populates Top Stories
function populateTopStories() {
    setLoader();
    setTopStoriesContainer();       
    getTopStories().then(function() {
        if (storyDisplayRange.limit < topStories.length) {
            storyDisplayRange.endIndex = storyDisplayRange.limit;
            getLimitedStories();
            
        } else {
            getLimitedStories();
        }
    });
}

function getLimitedStories() {
    var topStoriesPromise = [];
    for (var i = storyDisplayRange.startIndex; i < storyDisplayRange.endIndex; ++i) {
        topStoriesPromise.push(newsService.genericFetch(topStories[i]));
    }

    Promise.all(topStoriesPromise).then(function(response) {
        var storyPromises = [];
        for (var i = 0; i < response.length; ++i) {
            storyPromises.push(response[i].json());
        }
        return Promise.all(storyPromises);
    }).then( function(stories) {
        for (var i = 0; i < stories.length; ++i) {
            generateTopStories(stories[i], i);
        }
    });
}

// Returns number of comments per story
function checkIfCommentsExist(comments) {
    if (comments && comments.length) {
        return comments.length;
    }
    return 0;
}



// Generates Top Stories in HTML
function generateTopStories(topStory, index) {
    if (topStory.type === 'story') {
        removeLoader();
        addLimitButton();
        var topStoryRow = document.createElement('div');
        topStoryRow.className = 'story--container';
        
        // Top Story Icon         
        var topStoryIcon = document.createElement('img');
        topStoryIcon.className = 'top-story--icon';
        topStoryIcon.alt = 'Top Story Icon';
        topStoryIcon.src = './src/images/story-icon.png';

        // Top Story Title
        var topStoryTitle = document.createElement('h5');
        topStoryTitle.className = 'top-story--title';
        var commentCount = checkIfCommentsExist(topStory.kids);
        topStoryTitle.innerHTML = '<a href="' + topStory.url +'">' + topStory.title + '</a> | ' +  '<a class="comment-link" data-id=\'' + topStory.id +  '\' data-comments=\'' + commentCount +  '\' data-index=\'' + index +  '\'>' + commentCount + ' comments</a>';

        topStoryRow.appendChild(topStoryIcon);
        topStoryRow.appendChild(topStoryTitle);
        var topStoriesContainer = document.getElementById('topStoriesContainer');
        
        if (topStoriesContainer) {
            topStoriesContainer.appendChild(topStoryRow);
        }
    }
}

document.addEventListener('click', function(e) {
    if (e.srcElement.className === 'limit-btn') {
        showMoreStories(); 
    } else if (e.srcElement.className === 'comment-link' && e.srcElement.dataset.index && e.srcElement.dataset.comments !== '0') {
        stateHelper.stateChange('comments', e.srcElement.dataset.index);
        comments(e.srcElement.dataset.id);
    } else if (e.srcElement.className === 'page-icon') {
        stateHelper.stateChange('index', -1);
        init();
    }
});

function removeCommentElements() {
    var element = document.getElementById('commentsContainer')
    if (element) {
        var parent = element.parentNode;
        parent.removeChild(element);
    }
}

// Initalizes page
function init() {
    storyDisplayRange = {
        startIndex: 0,
        endIndex: null,
        limit: 30
    };
    setPageHeader();
    removeCommentElements();
    populateTopStories();
}

init();
