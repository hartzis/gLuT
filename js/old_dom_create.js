        var tweetContainer = $('<div>', {
            class: 'row tweet-container',
            'data-tweet-id': this.tweetId
        });
        var userIcon = $('<img>', {
            class: 'user-icon',
            src: this.userIconUrl
        });
        var userNameSpan = $('<span>', {
            class: "userName",
            text: this.userName + " @" + this.userScreenName
        });
        var tweetDateSpan = $('<span>', {
            class: "date-span",
            text: this.tweetDate
        });
        var theTweet = $('<span>', {
            class: "tweet-text",
            text: this.tweet
        });
        var tweetIconContainer = $('<div class="small-2 columns"></div>');
        var tweetInfoContainer = $('<div class="small-10 columns"></div>')
         var tweetHeadContainer = $('<div class="row"></div>');
        var tweetFootContainer = $('<div class="row"></div>');

        var tweetNameContainer = $('<div class="small-6 columns"></div>');
        var tweetDateContainer = $('<div class="small-6 columns"></div>');
        var tweetTextContainer = $('<div class="small-12 columns"></div>');

        tweetIconContainer.append(userIcon);
        tweetHeadContainer.append(tweetNameContainer.append(userNameSpan),
            tweetDateContainer.append(tweetDateSpan));
        tweetFootContainer.append(tweetTextContainer.append(theTweet));
        tweetInfoContainer.append(tweetHeadContainer, tweetFootContainer);
         //compile full tweet
        tweetContainer.append(tweetIconContainer, tweetInfoContainer);