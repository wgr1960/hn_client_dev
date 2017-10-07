/*
    Handles fetching news and comments
*/

'use strict';

// API Variable Constants
const dataURL = 'https://hacker-news.firebaseio.com';
const version = 'v0';
var header = {
    'Content-Type': 'text/json'
};
var errorMessage = '<h1>Sorry, we\'re currently having technical difficulties. Please try again at a later time.</h1>';
const paths = {
    topStories: dataURL.concat('/', version, '/topstories.json?print=pretty')
};

module.exports = {
    fetchTopStories: function() {
        return fetch(paths.topStories, header).then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response failed');
        }, function(error) {
            console.log('Fetch failed!', error);
            return errorMessage;            
        });
    },

    fetchKids: function(id) {
        var commentURL = dataURL.concat('/', version, '/item/', id, '.json?print=pretty');
        return fetch(commentURL, header).then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response failed');
        }, function(error) {
            console.log('Fetch failed!', error);
            return errorMessage;            
        });
    },

    genericFetch: function(id) {
        var url = dataURL.concat('/', version, '/item/', id, '.json?print=pretty');
        return fetch(url, header);
    }
}
