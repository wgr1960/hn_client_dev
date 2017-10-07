/*
    Handles state changing routes
*/

'use strict';

const states = {
    index: '/',
    comments: 'comments'
};

module.exports = {
    stateChange: function(newState, index) {
        var newPath = states[newState];
        if (index !== -1) {
            newPath = newPath + '?id=' + index;
            window.history.replaceState({ newState: states[newState]}, '', newPath);
        } else {
            window.history.replaceState({ newState: states[newState]}, '', newPath);
        }
    }
}