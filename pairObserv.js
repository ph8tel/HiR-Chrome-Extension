function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, (tabs) => {
        var tab = tabs[0];
        var url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });

}

function changeBackgroundColor(color) {
    // var script = 'document.body.style.backgroundColor="' + color + '";';

    var mariner = `
    var commentsObj = document.getElementsByClassName('comment');
    console.log(commentsObj);
    for (let i in commentsObj) {
        if (commentsObj.hasOwnProperty(i)){
            if (commentsObj[i].innerHTML.split('?').length > 1){    
                commentsObj[i].style.backgroundColor = 'red'
            } else  if (commentsObj[i].innerHTML.split('!').length > 1 ||
            commentsObj[i].innerHTML.split('!!').length > 1 ||
            commentsObj[i].innerHTML.split('!!!').length > 1){    
                commentsObj[i].style.backgroundColor = 'blue'
            } else {          
                commentsObj[i].style.backgroundColor = '${color}'
            }
        }
      }
    
    `
    var script = `
    if (document.URL === 'https://www.youtube.com/comments') {
      var commentText = [];
      var commentsObj = document.getElementsByClassName('comment-text-content');
      for (let i in commentsObj) {
        if (commentsObj.hasOwnProperty(i)){
            commentText.push(commentsObj[i].innerHTML)
            if (commentsObj[i].innerHTML.split('?').length > 1){    
                commentsObj[i].style.backgroundColor = 'red'
            } else {          
                commentsObj[i].style.backgroundColor = '${color}'
            }
        }
      }
    } else {
        window.setInterval( function(){
            var commentsObj = document.getElementsByClassName('chat-line__message');
            for (let i in commentsObj) {
              if (commentsObj.hasOwnProperty(i)){
                if (commentsObj[i].innerHTML.split('?').length > 1){    
                  commentsObj[i].style.backgroundColor = 'red'
                  commentsObj[i].style.fontSize = 'large'
                } else if (commentsObj[i].innerHTML.split('!').length > 1){
                  commentsObj[i].style.backgroundColor='blue'
                } else {          
                  commentsObj[i].style.backgroundColor = '${color}'
                }
              }
            }
        }, 300)
        
    }

    `


    chrome.tabs.executeScript({
        code: mariner
    });
}

function getSavedBackgroundColor(url, callback) {

    chrome.storage.sync.get(url, (items) => {
        callback(chrome.runtime.lastError ? null : items[url]);
    });
}

function saveBackgroundColor(url, color) {
    var items = {};
    items[url] = color;
    chrome.storage.sync.set(items);
}


document.addEventListener('DOMContentLoaded', () => {
    getCurrentTabUrl((url) => {
        var dropdown = document.getElementById('dropdown');

        getSavedBackgroundColor(url, (savedColor) => {
            if (savedColor) {
                changeBackgroundColor(savedColor);
                dropdown.value = savedColor;
            }
        });

        dropdown.addEventListener('change', () => {
            changeBackgroundColor(dropdown.value);
            saveBackgroundColor(url, dropdown.value);
        });
    });
});