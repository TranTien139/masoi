function setup() {
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
    var number = 10;

    var sources = {
        baove: '/images/bao-ve.jpg',
        danlang: '/images/dan-lang.jpg',
        kethoisao: '/images/ke-thoi-sao.jpg',
        gialang: '/images/gia-lang.jpg',
        masoi: '/images/ma-soi.png',
        phuthuy: '/images/phu-thuy.jpg',
        quanbaibian: '/images/quan-bai-bi-an.jpg',
        thantinhyeu: '/images/than-tinh-yeu.jpg',
        thosan: '/images/tho-san.jpg',
        tientri: '/images/tien-tri.jpg'
    };

    loadImages(sources, function(images) {
        var arr = Object.keys(images).map(function (key) { return images[key]; });
        var num_row = Math.ceil(number / 4);
        var end_num = 1;
        for (var i = 0; i < num_row; i++) {
            for (var k = 0; k < 4; k++) {
                var key = Math.floor(Math.random()*9);
                context.drawImage(arr[key], 150 * k + 120, 120 * i + 50, 120, 80);
                context.font = "13pt Roboto";
                context.fillStyle = '#0000ff';
                context.fillText("Trần Tiến", 150 * k + 140, 120 * i + 100);

                context.beginPath();
                context.moveTo(150 * k + 120, 120 * i + 50);
                context.lineTo(150 * k + 120 + 120, 120 * i + 50 + 80);
                context.stroke();

                context.fillStyle = '#ff0000';
                context.font = "18pt Roboto";
                context.fillText("0", 150 * k + 120, 120 * i + 50);

                if (end_num === number) {
                    break;
                    return;
                }
                end_num = end_num + 1;
            }
        }
    });

};

setup();

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
    console.log(e.offsetX, e.offsetY, e);

    // var canvas = document.getElementById('my_canvas');
    // var context = canvas.getContext('2d');
    //
    // context.clearRect(120, 50, 120, 80);

    //
    // var imageObj1 = new Image();
    // imageObj1.onload = function() {
    //      context.drawImage(imageObj1, e.offsetX, e.offsetY);
    // };
    // imageObj1.src = './public/images/tho-san.jpg';
}