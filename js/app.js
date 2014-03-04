var URLEvent = new Event('OnURLCreated');
var createWindow = chrome.windows.create;
var Share = {};

shareForm.addEventListener('click', shareFormHandler, false);

function shareFormHandler (e) {
    // Check if is a valid element (checkbox share)
    if ((e.target.nodeType === 1) && (e.target.id === 'share')) {
        e.preventDefault();

        shareForm.addEventListener('OnURLCreated', shareURL, false);
        launchEventForURL();
    }
}

function launchEventForURL () {
    chrome.windows.getCurrent(
        // Bring the tabs object
        // https://developer.chrome.com/extensions/windows#method-getCurrent
        {
            populate: true
        },
        function (currentWindow) {
            chrome.tabs.query(
                {
                    active: true, 
                    windowId: currentWindow.id
                },
                function(activeTabs) {
                    var activeTab = activeTabs[0];

                    // Set URL
                    Share.url = activeTab.url;
                    Share.title = activeTab.title;
                    Share.encoded = {
                        url: encodeURI(activeTab.url),
                        title: encodeURI(activeTab.title)
                    };

                    shareForm.dispatchEvent(URLEvent);
                }
            );
        }
    );
}

function shareURL () {
    var checks = document.querySelectorAll('.socialNetWork');

    if (!checks) {
        return false;
    }

    Array.prototype.forEach.call(checks, function(item) {
        if (!item.checked) {
            return false;
        }
        
        var socialNetWork = item.getAttribute('data-share').toLowerCase(),
            windowOptions = {
                width: 550,
                height: 540,
                focused: true,
                type: 'detached_panel'
            };

        windowOptions.left = Math.round((screen.width / 2) - (windowOptions.width / 2));
        windowOptions.top = (screen.height > windowOptions.height) ? Math.round((screen.height / 2) - (windowOptions.height / 2)) : 0;

        switch (socialNetWork) {
            case 'twitter' : 
                shareOnTwitter(windowOptions);
                break;
            case 'facebook' :
                shareOnFacebook(windowOptions);
                break;
            case 'gplus' :
                shareOnGPlus(windowOptions);
                break;
            case 'linkedin' :
                shareOnLinkedIn(windowOptions);
                break;
        }
    });
}

function shareOnTwitter (options) {
    var URLToShare = 'https://twitter.com/intent/tweet?';

    URLToShare += 'url=' + Share.encoded.url;
    URLToShare += '&text=' + Share.encoded.title;

    options.url = URLToShare;

    createWindow(options);
}

function shareOnFacebook (options) {
    var URLToShare = 'https://www.facebook.com/sharer/sharer.php?';

    URLToShare += 'u=' + Share.encoded.url;
    URLToShare += '&p=' + Share.encoded.title;

    options.url = URLToShare;

    createWindow(options);
}

function shareOnGPlus (options) {
    var URLToShare = 'https://plus.google.com/share?';

    URLToShare += 'url=' + Share.encoded.url;

    options.url = URLToShare;

    createWindow(options);
}

function shareOnLinkedIn (options) {
    var URLToShare = 'https://www.linkedin.com/shareArticle?mini=true&';

    URLToShare += 'url=' + Share.encoded.url;
    URLToShare += '&title=' + Share.encoded.title;

    options.url = URLToShare;

    createWindow(options);
}