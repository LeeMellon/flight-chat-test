//  IMPORTANT: Do not edit index.js or your changes will be lost - use src/index.ts - index.js is transpiled from src/index.ts
var functions = require('firebase-functions');
var firebase = require('firebase-admin');
firebase.initializeApp(functions.config().firebase);
//-------------v CommentAssociations v-------------
exports.makeCommentAssociations = functions.database.ref('/commentData/comments/{pushId}')
    .onWrite(function (event) {
    var newCommentKey = event.data.key;
    var newCommentValue = event.data.val();
    commentAssociations({
        rootRef: firebase.database().ref(),
        commentKey: newCommentKey,
        commentValue: newCommentValue
    }).then(function (_) {
        console.log('Success: commentAssociations.');
    }).catch(function (err) {
        console.error('Fail: commentAssociations.', err);
    });
});
// This is an atomic function. As a guide I used
// this video: https://www.youtube.com/watch?v=i1n9Kw3AORw starting at 5:35
function commentAssociations(_a) {
    var rootRef = _a.rootRef, commentKey = _a.commentKey, commentValue = _a.commentValue;
    // Create empty update object
    var updateObj = {};
    //  Add to updateObj: The path and value you would like to update
    updateObj[makeParentAssociation(commentValue.parentKey, commentKey)] = true;
    updateObj[makeUserAssociation(commentValue.parentKey, commentKey)] = true;
    updateObj[makeParentTypeAssociation(commentValue.parentType, commentValue.parentKey, commentKey)] = true;
    // Updates the database, return the promise 
    return rootRef.update(updateObj);
}
function makeParentAssociation(parentKey, commentKey) {
    return "commentData/commentsPerParent/" + parentKey + "/" + commentKey;
}
function makeUserAssociation(authorKey, commentKey) {
    return "commentData/commentsPerUser/" + authorKey + "/" + commentKey;
}
function makeParentTypeAssociation(parentType, parentKey, childKey) {
    if (parentType === 'article')
        return makeCommentsPerArticleAssociation(parentKey, childKey);
    if (parentType === 'comment')
        return makeRepliesPerCommentAssociation(parentKey, childKey);
}
function makeCommentsPerArticleAssociation(parentKey, commentKey) {
    return "commentData/commentsPerArticle/" + parentKey + "/" + commentKey;
}
function makeRepliesPerCommentAssociation(parentKey, commentKey) {
    return "commentData/repliesPerComment/" + parentKey + "/" + commentKey;
}
//-------------^ CommentAssociations ^-------------
//# sourceMappingURL=index.js.map