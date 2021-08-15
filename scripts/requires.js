var Emojis={
    "troll.png":[":troll:",":trollface:",":troll_face:"],
    "awesome.png":[":awesome:",":awesomeface:",":awesome_face:",":epic:",":epicface:",":epic_face:"],
    "x.png":[":x:",":X:"],
    "oldroblox.png":[":oldroblox:",":old_roblox:"],
    "aoldance.gif":[":aoldance:",":aol_dance:"],
    "shopium.png":[":shopium:"],
    "pog.png":[":pog:",":pogger:",":poggers:"]
};

var insertEmoji=function(basePath,emojis){
    var replacements=[];
    Object.keys(emojis).forEach(function(file){
        var _file="<img src=\""+basePath+file+"\" id=\"emoji\"\>";
        emojis[file].forEach(function(chars){
            var reg=new RegExp(chars.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"),"g");
            replacements.push([reg,_file]);
        });
    });
    return function(text){
        return replacements.reduce(function(line,replacement){
            return line.replace(replacement[0],replacement[1]);
        },text);
    }
}(window.location.href.replace("/?", "") + "emojis/",Emojis);

createYoutubeEmbed = (key) => {
    return '<iframe width="500" height="315" src="https://www.youtube.com/embed/' + key + '" frameborder="0" allowfullscreen id="video"></iframe>';
};
  
transformYoutubeLinks = (text) => {
    if (!text) return text;
    const self = this;
  
    const linkreg = /(?:)<a([^>]+)>(.+?)<\/a>/g;
    const fullreg = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/g;
  
    let resultHtml = text;  
  
    // get all the matches for youtube links using the first regex
    const match = text.match(fullreg);
    if (match && match.length > 0) {
      // get all links and put in placeholders
      const matchlinks = text.match(linkreg);
      if (matchlinks && matchlinks.length > 0) {
          resultHtml = resultHtml.replace(matchlinks[0], "#placeholder" + 0 + "#");
      }
  
      // now go through the matches one by one
        // get the key out of the match using the second regex
        let matchParts = match[0].split(regex);
        // replace the full match with the embedded youtube code
        resultHtml = resultHtml.replace(match[0], "");
        resultHtml += self.createYoutubeEmbed(matchParts[1]);
  
      // ok now put our links back where the placeholders were.
      if (matchlinks && matchlinks.length > 0) {
          resultHtml = resultHtml.replace("#placeholder" + 0 + "#", matchlinks[0]);
      }
    }
    return resultHtml;
};

function getId(url) {
    const regExp = /(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?\s]*)/;
    const match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2]
    } else {
        return error;
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function checkCookie() {
    let username = getCookie("username");
    if (username != "") {
        return username;
    } else {
      username = prompt("Please enter your name (Maximum 16 Characters):", "anonymous");
      if (username != "" && username != null) {
        setCookie("username", username, Infinity);
        return username;
      }
    }
}