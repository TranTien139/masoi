var socket = io();
var GLOBAL_CHOOSE = 0;
var GLOBAL_MAIN_PLAYER = [];
var GLOBAL_LAT_LONG = [];

var GLOBAL_PLAYER = [];

function LoginWithName(){
    var full_name = document.getElementById('input_full_name').value;
    if(full_name.length >=3 && full_name.length <=20){
        socket.emit('new player', full_name, function(data){
            document.getElementById('login').innerHTML = "";
            document.getElementById('main-container').style.display = "block";
            document.getElementById('full-name').value = full_name;
        });
    } else {
        document.getElementById('error-name').innerHTML = '* Bạn phải nhập tên trong khoảng 3-20 kí tự';
    }
    return false;
}


socket.on('list_player', function(data){
    document.getElementById('item-play').innerHTML = '';
    GLOBAL_PLAYER = data;
    for (var i=0; i< data.length; i++) {
        UpdatePeoplePlay(data[i]);
    }
});


function SendChat(e) {
    var valuechat = document.getElementById('content-chat').value;
    var fullname = document.getElementById('full-name').value;
    if (e.keyCode == 13 && valuechat !== '') {
        var currentdate = new Date();
        var datetime = FormatTime(currentdate.getHours(),currentdate.getMinutes(),currentdate.getSeconds());
        var value_chat = {"fullname":fullname, "datetime": datetime, "valuechat": valuechat};
        socket.emit('chat message',value_chat, function (data) {
            displayData(value_chat);
        });
        return false;
    }
}

socket.on('new message', function(data){
    displayData(data);
});

function displayData(data){
    document.getElementById('list-chat').insertAdjacentHTML('beforeend',
        '<div class="item-chat"> <div class="d-flex w-100 justify-content-between"> <h5 class="mb-1">'+data.fullname+'</h5> <small>'+data.datetime+'</small> </div> <p class="mb-1">'+data.valuechat+'</p> </div>');
    document.getElementById('content-chat').value = '';
    var elementChat = document.getElementsByClassName('box-chat')[0];
    var clientHeight = document.getElementsByClassName('list-chat')[0].offsetHeight;
    elementChat.scrollTop = clientHeight;
}

function UpdatePeoplePlay(name) {
    document.getElementById('item-play').insertAdjacentHTML('beforeend', '<li class="list-group-item">'+name+'</li>');
}

function UpdatePeopleOut(name) {
    document.getElementById('item-out').insertAdjacentHTML('beforeend', '<li class="list-group-item">+name+</li>');
}

function FormatTime(hour, minute, second) {

    if(hour < 10){
        hour = '0' + hour;
    }

    if(minute < 10){
        minute = '0' + minute;
    }

    if(second < 10){
        second = '0' + second;
    }

   return hour + ': ' + minute + ': ' + second;
    
}

