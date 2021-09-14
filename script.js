var Socket;
var uNodeID=-1;
WebSocket.prototype.org = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
    if(uNodeID==-1){
        var parse=JSON.parse(data);
        if(parse.evt==4259)
            HandleReaction(this, parse);
    }
    WebSocket.prototype.org.apply(this, [data]);
};

function HandleReaction(ws, data){
    Socket=ws;
    uNodeID=data.body.uNodeID;
    console.log('reactor ready');
}

function MakeData(emoji){
    return "{\"evt\":4259,\"body\":{\"uNodeID\":"+uNodeID+",\"strEmojiContent\":\""+emoji+"\"},\"seq\":3191}"
}

var delay=10*200;
window.REACTION_DELAY=function(t)
{
    delay=t;
}
var rando=false;
window.REACTION_RANDO=function(r)
{
    rando=r;
}
var reacting=-1;
window.REACTIONS=function(emojiList){
    var idx=0;

    console.log(emojiList);

    var id=++reacting;
    var l=emojiList.length;
    var DoReactions=function(){
        if(reacting==id){
            if(idx>=l)
                idx=0;
            React(emojiList[idx]);

            if(rando)
                idx=Math.floor(Math.random()*l);
            else
                idx++;

            setTimeout(DoReactions,delay);
        }
    }
    DoReactions();
}

window.STOP_REACTIONS=function(){
    reacting++;
}

window.REACT=function(emoji){
    React(emoji);
}

function React(emoji, prevent){
    if(Socket&&uNodeID!=-1){
        var data=MakeData(emoji);
        WebSocket.prototype.org.apply(Socket, [data]);
        console.log(data);
    }else{
        INIT();
        if(!prevent)
        React(emoji,true);
    }
}

function INIT(prevent){
    document.querySelector('.footer-button__reactions-icon').parentElement.parentElement.click();
    var emoji=      document.querySelector('.reaction-simple-picker__content-wrapper');
    if(!emoji)emoji=document.querySelector('.reaction-all-emoji-picker-list__line');

    if(emoji)emoji.click();
    else if(!prevent)INIT(true);else console.warn('failed to get sending information');
}
