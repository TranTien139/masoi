// setInterval(function () {
//     document.getElementById('auto_scaling').insertAdjacentHTML('beforeend','<canvas id="countdown"></canvas>');
//     var t = new Timer(document.getElementById('countdown'));
//     t.timerRun();
// }, 30*1000);


function Timer(el) {
    // params
    this.WIDTH = 150;
    this.HEIGHT = 150;
    this.TIMER_BORDER = 3;
    this.TIMER_COLOR1 = "#ececec";
    this.TIMER_COLOR2 = "#3366CC";
    this.TIMER_DURATION = 10000;
    this.TIME_ELAPSED = 0;
    this.DOT_RADIUS = 6;
    this.MAXFPS = 60;
    this.el = el;
    this.el.width = this.WIDTH;
    this.el.height = this.HEIGHT;
    this.ctx = el.getContext('2d');
}

Timer.prototype.timerString = function () {
    var ts = Math.ceil((this.TIMER_DURATION - this.TIME_ELAPSED) / 1000);
    var h = parseInt(ts / 3600) % 24;
    var m = parseInt(ts / 60) % 60;
    var s = ts % 60;
    return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}

Timer.prototype.clearFrame = function () {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height);
}

Timer.prototype.drawTimer = function () {
    var self = this;
    var ctx = this.ctx;
    var center = {
        x: this.el.width / 2,
        y: this.el.height / 2
    };
    var r = (this.el.width - this.TIMER_BORDER) / 2 - this.DOT_RADIUS;
    var eAngle = (1.5 - 2.0 * this.TIME_ELAPSED / this.TIMER_DURATION) * Math.PI;
    var dot = {
        x: center.x + r * Math.cos(eAngle),
        y: center.y + r * Math.sin(eAngle)
    };
    dot.r = this.DOT_RADIUS;
    // draw background arc
    ctx.lineWidth = this.TIMER_BORDER;
    ctx.strokeStyle = this.TIMER_COLOR1;
    ctx.beginPath();
    ctx.arc(center.x, center.y, r, -0.5 * Math.PI, eAngle); // -0.5pi ~ 1.5pi
    ctx.stroke();
    // draw foreground arc
    ctx.beginPath();
    ctx.arc(center.x, center.y, r, -0.5 * Math.PI, eAngle, 1); // counterclockwise
    ctx.strokeStyle = this.TIMER_COLOR2;
    ctx.stroke();
    // draw dot
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.TIMER_COLOR2;
    ctx.fill();
    // draw time string
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.font = "300 32pt Roboto";
    ctx.fillText(self.timerString(), center.x, center.y);
}

Timer.prototype.render = function () {
    this.clearFrame();
    this.drawTimer();
    return Date.now();
}

Timer.prototype.timerRun = function () {
    var self = this;
    if (self.TIME_ELAPSED >= self.TIMER_DURATION){
        document.getElementById('auto_scaling').innerHTML = '';
        GLOBAL_CHOOSE = 0;
        IS_SELECT_BY_USER = 1;

        var max_select = 0;
        var charater_select = "";

        Object.keys(GLOBAL_PLAYER_CHOOSE).map(function (obj) {
            if(GLOBAL_PLAYER_CHOOSE[obj].length > max_select){
                max_select = GLOBAL_PLAYER_CHOOSE[obj].length;
                charater_select = obj;
            }
        });

        GLOBAL_PLAYER_DIE.push(charater_select);

        GLOBAL_PLAYER_LIVE = GLOBAL_PLAYER_LIVE.filter(function (obj) {
           return  obj.user !== charater_select;
        });

        socket.emit('player-live-die', {'live': GLOBAL_PLAYER_LIVE, 'die': GLOBAL_PLAYER_DIE}, function () {});

        GLOBAL_PLAYER_CHOOSE = {};

        var sosoiconlai = GLOBAL_PLAYER_LIVE.filter(function (obj) {
            return  obj.charater === 'masoi';
        });

        if(GLOBAL_PLAYER_LIVE.length - 2 * sosoiconlai.length <= 0){
            alert('Trò chơi kết thúc, bên sói thắng');
            IS_FINISH = true;
        }

        if(sosoiconlai.length === 0){
            alert('Trò chơi kết thúc, bên đân thắng');
            IS_FINISH = true;
        }

        setup(GLOBAL_MAIN_PLAYER);

        if(GLOBAL_NIGHT_DAY === 'NIGHT'){
            ClearText();
            DrawText('Thời gian ban gày thảo luận của người dân');
            GLOBAL_NIGHT_DAY = 'DAY';
        } else {
            ClearText();
            DrawText('Thời gian buổi tối, thời gian thảo luận của sói');
            GLOBAL_NIGHT_DAY = 'NIGHT';
        }

        return false;
    }
    if (!self.lastRender) self.lastRender = Date.now();
    var delta = Date.now() - self.lastRender;
    // Trick to throttle FPS
    if (delta > (1000 / self.MAXFPS)) {
        self.TIME_ELAPSED += delta;
        self.lastRender = self.render();
    }
    requestAnimationFrame(self.timerRun.bind(self));
}

function RunTimeCountDown(delay_time) {
    document.getElementById('auto_scaling').insertAdjacentHTML('beforeend','<canvas id="countdown"></canvas>');
    var t = new Timer(document.getElementById('countdown'));
    t.TIMER_DURATION = delay_time;
    t.timerRun();
}

function InPlayGame(){
    if(GLOBAL_CHOOSE === 0 && IS_FINISH === false) {
        if(GLOBAL_PLAYER[0] === GLOBAL_USER_LOGIN.trim()) {
            if (GLOBAL_NIGHT_DAY === 'DAY') {

                IS_SELECT_BY_USER = 0;
                var list_id_werewolf = [];

                for (var j = 0; j < GLOBAL_PLAYER_LIVE.length; j++) {
                    if (GLOBAL_PLAYER_LIVE[j].charater === 'masoi') {
                        list_id_werewolf.push(j);
                    }
                }

                for (var k = 0; k < GLOBAL_PLAYER_LIVE.length; k++) {
                    if (GLOBAL_PLAYER_LIVE[k].user !== GLOBAL_USER_LOGIN) {
                        if (GLOBAL_PLAYER_LIVE[k].charater !== 'masoi') {
                            var random = generateRandom(0, GLOBAL_PLAYER_LIVE.length, [k]);
                            if (GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user] === undefined) {
                                GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user] = [GLOBAL_PLAYER_LIVE[k].user];
                            } else {
                                GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user].push(GLOBAL_PLAYER_LIVE[k].user);
                            }
                        } else {
                            var except = [k].concat(list_id_werewolf);
                            var random = generateRandom(0, GLOBAL_PLAYER_LIVE.length, except);
                            if (GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user] === undefined) {
                                GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user] = [GLOBAL_PLAYER_LIVE[k].user];
                            } else {
                                GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user].push(GLOBAL_PLAYER_LIVE[k].user);
                            }
                        }
                    }
                }
            }

            if (GLOBAL_NIGHT_DAY === 'NIGHT') {
                if (IS_WEREWOLF !== true) {
                    var list_id_werewolf = [];
                    for (var j = 0; j < GLOBAL_PLAYER_LIVE.length; j++) {
                        if (GLOBAL_PLAYER_LIVE[j].charater === 'masoi') {
                            list_id_werewolf.push(j);
                        }
                    }

                    var except = list_id_werewolf;
                    for (var k = 0; k < GLOBAL_PLAYER_LIVE.length; k++) {
                        if (GLOBAL_PLAYER_LIVE[k].charater === 'masoi') {
                            var random = generateRandom(0, GLOBAL_PLAYER_LIVE.length, except);
                            if (GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user] === undefined) {
                                GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user] = [GLOBAL_PLAYER_LIVE[k].user];
                            } else {
                                GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user].push(GLOBAL_PLAYER_LIVE[k].user);
                            }
                        }
                    }
                } else {
                    IS_SELECT_BY_USER = 0;

                    var list_id_werewolf = [];
                    for (var j = 0; j < GLOBAL_PLAYER_LIVE.length; j++) {
                        if (GLOBAL_PLAYER_LIVE[j].charater === 'masoi') {
                            list_id_werewolf.push(j);
                        }
                    }

                    var except = list_id_werewolf;
                    for (var k = 0; k < GLOBAL_PLAYER_LIVE.length; k++) {
                        if (GLOBAL_PLAYER_LIVE[k].user !== GLOBAL_USER_LOGIN && GLOBAL_PLAYER_LIVE[k].charater === 'masoi') {
                            var random = generateRandom(0, GLOBAL_PLAYER_LIVE.length, except);
                            if (GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user] === undefined) {
                                GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user] = [GLOBAL_PLAYER_LIVE[k].user];
                            } else {
                                GLOBAL_PLAYER_CHOOSE[GLOBAL_PLAYER_LIVE[random].user].push(GLOBAL_PLAYER_LIVE[k].user);
                            }
                        }
                    }
                }
            }
            socket.emit('ramdom choose',GLOBAL_PLAYER_CHOOSE,function () {
            });
        }
        RunTimeCountDown(15000);
    }

    if(IS_FINISH === true){
        alert('Trò chơi đã kết thúc bạn không thể tiếp tục lại');
    }
}

function InPlayGame_socket() {
    socket.emit('count down',{},function () {
    });
}


socket.on('count down', function (data) {
    InPlayGame();
});

socket.on('ramdom choose', function (data) {
    GLOBAL_CHOOSE = 1;
    GLOBAL_PLAYER_CHOOSE = data;
    if (GLOBAL_NIGHT_DAY === 'DAY' && GLOBAL_PLAYER[0] !== GLOBAL_USER_LOGIN.trim()) {
      IS_SELECT_BY_USER = 0;
    }
});

socket.on('player choose', function (obj) {
    if(GLOBAL_PLAYER_CHOOSE[obj.name] === undefined){
        GLOBAL_PLAYER_CHOOSE[obj.name] = [obj.user];
    } else {
        if(GLOBAL_PLAYER_CHOOSE[obj.name].indexOf(obj.user) === -1) {
          GLOBAL_PLAYER_CHOOSE[obj.name].push(obj.user);
        }
    }
});

socket.on('player-live-die', function (obj) {
     GLOBAL_PLAYER_DIE = obj.die;
     GLOBAL_PLAYER_LIVE = obj.live;
});


function generateRandom(min, max, except) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    return (except.indexOf(num) !== -1) ? generateRandom(min, max, except) : num;
}
