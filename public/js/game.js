function setup(array_player) {
    var canvas = document.getElementById('my_canvas');
    canvas.width = 800;
    canvas.height = 630;
    var context = canvas.getContext('2d');
    canvas.addEventListener('click', clickReporter, false);

    var imageObj = new Image();

    imageObj.onload = function () {
        for (var k = 0; k < 8; k++) {
            for (var j = 0; j < 6; j++) {
                context.drawImage(imageObj, k * 100, j * 100);
            }
        }
    };
    imageObj.src = '/images/background.png';

    var monsterImage = new Image();
    var number = 12;

    var sources = {
        baove: '/images/bao-ve.jpg',
        danlang: '/images/dan-lang.jpg',
        kethoisao: '/images/ke-thoi-sao.jpg',
        gialang: '/images/gia-lang1.jpg',
        masoi: '/images/ma-soi.png',
        phuthuy: '/images/phu-thuy.jpg',
        quanbaibian: '/images/quan-bai-bi-an.jpg',
        thantinhyeu: '/images/than-tinh-yeu.jpg',
        thosan: '/images/tho-san.jpg',
        tientri: '/images/tien-tri.jpg'
    };

    document.getElementById('my_canvas').innerHTML = '';

    var arr_cungmasoi = [];
    if (IS_WEREWOLF === true) {
        for (var h = 0; h < GLOBAL_PLAYER_LIVE.length; h++) {
            if (GLOBAL_PLAYER_LIVE[h].charater === 'masoi') {
                arr_cungmasoi.push(GLOBAL_PLAYER_LIVE[h].user);
            }
        }
    }

    loadImages(sources, function (images) {
        var end_num = 1;
        for (var i = 0; i < 4; i++) {
            for (var k = 0; k < 4; k++) {
                var key = i * 4 + k;

                if (array_player[key]) {
                    var full_image_draw = array_player[key].charater;
                    var full_name_draw = array_player[key].user;

                    if (GLOBAL_PLAYER_DIE.indexOf(full_name_draw) !== -1 || IS_FINISH === true) {

                        context.drawImage(images[full_image_draw], 150 * k + 120, 120 * i + 50, 120, 80);
                        context.font = "13pt Roboto";
                        context.fillStyle = '#0000ff';
                        context.fillText(full_name_draw, 150 * k + 130, 120 * i + 100);

                        context.beginPath();
                        context.moveTo(150 * k + 120, 120 * i + 50);
                        context.lineTo(150 * k + 120 + 120, 120 * i + 50 + 80);
                        context.stroke();

                    } else {
                        if (full_name_draw === GLOBAL_USER_LOGIN) {
                            context.drawImage(images[full_image_draw], 150 * k + 120, 120 * i + 50, 120, 80);
                            context.font = "13pt Roboto";
                            context.fillStyle = '#0000ff';
                            context.fillText(full_name_draw, 150 * k + 130, 120 * i + 100);

                            // context.beginPath();
                            // context.moveTo(150 * k + 120, 120 * i + 50);
                            // context.lineTo(150 * k + 120 + 120, 120 * i + 50 + 80);
                            // context.stroke();
                            //
                            // context.fillStyle = '#ff0000';
                            // context.font = "18pt Roboto";
                            // context.fillText("0", 150 * k + 120, 120 * i + 50);
                        } else {
                            if (IS_WEREWOLF === true && arr_cungmasoi.indexOf(full_name_draw) !== -1) {
                                context.drawImage(images[full_image_draw], 150 * k + 120, 120 * i + 50, 120, 80);
                                context.font = "13pt Roboto";
                                context.fillStyle = '#0000ff';
                                context.fillText(full_name_draw, 150 * k + 130, 120 * i + 100);
                            } else {
                                context.drawImage(images['quanbaibian'], 150 * k + 120, 120 * i + 50, 120, 80);
                                context.font = "13pt Roboto";
                                context.fillStyle = '#0000ff';
                                context.fillText(full_name_draw, 150 * k + 130, 120 * i + 100);
                            }
                        }
                    }

                    if (end_num === number) {
                        break;
                        return;
                    }
                    end_num = end_num + 1;
                }
            }
        }
    });
};


function DrawBackGround() {
    var canvas = document.getElementById('my_canvas');
    canvas.width = 800;
    canvas.height = 630;
    var context = canvas.getContext('2d');
    canvas.addEventListener('click', clickReporter, false);

    var imageObj = new Image();

    imageObj.onload = function () {
        for (var k = 0; k < 8; k++) {
            for (var j = 0; j < 6; j++) {
                context.drawImage(imageObj, k * 100, j * 100);
            }
        }
    };
    imageObj.src = '/images/background.png';
};

function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

function clickReporter(e) {

    if (GLOBAL_LAT_LONG.length === 0) {
        for (var i = 0; i < 4; i++) {
            for (var k = 0; k < 4; k++) {
                var key = i * 4 + k;
                if (GLOBAL_MAIN_PLAYER[key]) {
                    var full_name_draw = GLOBAL_MAIN_PLAYER[key].user;
                    var obj_latlong = {
                        name: full_name_draw,
                        A: {x: 150 * k + 120, y: 120 * i + 50},
                        B: {x: 150 * k + 120 + 120, y: 120 * i + 50 + 80}
                    };
                    GLOBAL_LAT_LONG.push(obj_latlong);
                }
            }
        }
    }

    var check = GLOBAL_LAT_LONG.filter(function (object) {
        return (object.A.x <= e.offsetX && object.B.x >= e.offsetX && object.A.y <= e.offsetY && object.B.y >= e.offsetY)
    });

    if (GLOBAL_CHOOSE !== 0 && IS_SELECT_BY_USER === 0 && GLOBAL_PLAYER_DIE.indexOf(GLOBAL_USER_LOGIN) === -1) {

        if (check.length > 0) {
            var name = check[0].name;
            if (GLOBAL_PLAYER_CHOOSE[name] === undefined) {
                GLOBAL_PLAYER_CHOOSE[name] = [GLOBAL_USER_LOGIN];
                IS_SELECT_BY_USER = 1;
            } else {
                GLOBAL_PLAYER_CHOOSE[name].push(GLOBAL_USER_LOGIN);
                IS_SELECT_BY_USER = 1;
            }
            alert('Bạn đã chọn: ' + name);
            return false;
        }
    } else {
        if (check.length > 0) {
            if (GLOBAL_CHOOSE === 0) {
                alert('Chưa phải thời điểm để chọn');
            } else if (IS_SELECT_BY_USER === 1) {
                if (GLOBAL_NIGHT_DAY === 'NIGHT' && IS_WEREWOLF !== true) {
                    alert('Bạn không được chọn thời điểm ban đêm');
                } else {
                    alert('Bạn không thể chọn');
                }

            } else if (GLOBAL_PLAYER_DIE.indexOf(GLOBAL_USER_LOGIN) !== -1) {
                alert('Bạn die rồi nên không được chọn nữa');
            }
        }
    }
}

var html = "Với mỗi một ván chơi mà sói đều yêu cầu số người chơi nhất định từ 8 – 23 người, với số người chơi càng lớn thì đố khó và thời gian của game càng gia tăng. Thông thường, với số người chơi từ 10 -15 người là phù hợp nhất cho một ván chơi hấp dẫn."

    + " Với mối số lượng người chơi khác nhau thì cần có một sự phân bố các quân bài, chức năng khác nhau cho phù hợp."

    + " *** Từ 8 -9 người chơi: 1 bảo vệ, 1 thợ săn, 1 tiên chi, 3 sói và dân"

    + " *** Từ 10-11 người chơi: 1 bảo vệ, 1 thợ săn, 1 tiên chi, 1 thợ săn, 3 sói và dân"

    + " *** Từ 12-13 người chơi: 1 bảo vệ, 1 thợ săn, 1 tiên chi, 1 thợ săn, 1 cupid, 3 sói và dân"

    + " *** Với 14 người chơi: 1 tiên tri, 1 bảo vệ, 1 thợ săn, 1 cupid, 1 phù thủy + 3 sói + 5 dân + 1 phản bội."

    + " *** Với 15 người chơi: 1 tiên tri, 1 bảo vệ, 1 thợ săn, 1 cupid, 1 phù thủy + 4 sói + 6 dân."

    + " *** Với 16 người chơi: 1 tiên tri, 1 bảo vệ, 1 thợ săn, 1 cupid, 1 phù thủy, 1 già làng + 4 sói + 6 dân."

    + " *** Với 17 người chơi: 1 tiên tri, 1 bảo vệ, 1 thợ săn, 1 cupid, 1 phù thủy, 1 già làng, 1 thổi sáo + 4 sói + 6 dân 17 người: 1 tiên tri, 1 bảo vệ, 1 thợ săn, 1 cupid, 1 phù thủy, 1 già làng, 1 thổi sáo, 1 pháp sư câm + 4 sói + 5 dân."

    + " *** Với 18 người chơi: 1 tiên tri, 1 bảo vệ, 1 thợ săn, 1 cupid, 1 phù thủy, 1 già làng, 1 thổi sáo, 1 pháp sư câm + 4 sói + 6 dân."

    + " *** Với 19 người chơi: 1 tiên tri, 1 bảo vệ, 1 thợ săn, 1 cupid, 1 phù thủy, 1 già làng, 1 cảnh sát trưởng + 4 sói + 8 dân."

    + " *** Từ 20 người chơi trở lên thì cứ thêm 1 người chơi là thêm 1 dân làng."

    + " Với mỗi ván game ma sói cần có một quản trò để điều hành cuộc chơi.";


DrawBackGround();
DrawText('Bấm vào nút bắt đầu để than gia chơi');

var setupPlayer = ['baove', 'thosan', 'tientri', 'thantinhyeu', 'masoi', 'masoi', 'masoi', 'danlang', 'danlang', 'danlang', 'danlang', 'danlang'];

function BeginGame() {
    var num_play_more = 12 - GLOBAL_PLAYER.length;
    for (var num = 1; num <= num_play_more; num++) {
        GLOBAL_PLAYER.push('Người chơi ' + num);
    }

    var results = [];
    GLOBAL_PLAYER.map(function (obj) {
        var len = setupPlayer.length;
        var ran = Math.floor(Math.random() * len);
        var ddd = {"charater": setupPlayer[ran], "user": obj}
        if (obj === GLOBAL_USER_LOGIN && setupPlayer[ran] === 'masoi') {
            IS_WEREWOLF = true;
            IS_SELECT_BY_USER = 0;
        }
        results.push(ddd);
        setupPlayer.splice(ran, 1);
    });
    GLOBAL_MAIN_PLAYER = results;
    GLOBAL_PLAYER_LIVE = results;
    ClearText();
    document.getElementById('title-play').innerHTML = '<a onclick="InPlayGame()" style="cursor: pointer; color: red; font-size: 14px;">Tiếp theo<i class="fa fa-angle-double-right"></i></a>';
    DrawText('Thời gian buổi tối, thời gian thảo luận của sói');
    setup(results);
}