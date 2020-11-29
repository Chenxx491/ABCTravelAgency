// flag 信号量标志游戏开始和结束
var flag = false;
// clock 用于开启和关闭定时器
var clock = null;
// speed 设置黑白块下落速度
var speed = 4;

// 获取到开始游戏按钮
var startBtn = document.querySelector('#startBtn');
// 获取游戏界面盒子main
var main = document.querySelector('.main');
// 获取到装黑白块的盒子content
var content = document.querySelector('.content');

// 生成随机黑白块类名的函数
function createWB() {
    // 1. 先创建一个长度为4的类名数组(因为一行总共四个黑白块)，存放白块类名'column'
    var classAry = ['column', 'column', 'column', 'column'];
    // 2. 用Math.random()随机生成0-3的随机数并赋值给i
    var i = Math.floor(Math.random() * 4);
    // 3. 用随机数i来控制每一行第几个是黑块
    classAry[i] = 'column black';
    // 4. 最后返回该类名数组
    return classAry;
}

// 创建div的函数，这里是方便后边生成column时随机生成黑白块，同时也可以提高代码复用率
function createDiv(classname) {
    // 1. 生成一个div元素
    var div = document.createElement('div');
    // 2. 给这个div元素加上类名
    div.className = classname;
    // 3. 返回该元素
    return div;
}

// 生成 一行黑白块 函数
function creatRow() {
    // 1. 创建一个div元素并添加类名row，这是存放一行黑白块的盒子
    var row = createDiv('row');
    // 2. 将row添加到content中
    content.appendChild(row);
    // 3. 生成随机的黑白块类名数组
    var colAry = createWB();
    // 3. 用for循环给row里边放入四个黑白块
    for (var i = 0; i < 4; i++) {
        // 创建div元素并给其添加类名
        var column = createDiv(colAry[i]);
        // 将创建的黑白块加到row中
        row.appendChild(column);
    }
    /* 
      如果装黑白块的盒子content第一个子节点为空，即content盒子为空，
      直接将row放到content中即可
    */
    if (content.firstChild == null) {
        content.appendChild(row);
    }
    /* 
      如果content第一个子节点不为空，即content盒子不为空说明此时是游戏中，
      那么row应该是加到第一个子节点的前边，也就是加到最上边
    */
    else {
        content.insertBefore(row, content.firstChild);
    }
}
// 删除 一行 函数
function delRow() {
    /**
     * 游戏界面所能展示的是四行黑白块，当游戏开始后，最上边应该不断生成新的一行黑白块，
     * 同时不断删除最下边的黑白块，所以当装黑白块的盒子节点数达到6时，也就是最上方已经生成了新的黑白块
     * 而旧的一行黑白块也已经离开游戏界面框，这个时候将最下边的一行黑白块删除   
     * */
    if (content.childNodes.length == 6) {
        // 删除其最后一个子节点
        content.removeChild(content.lastChild);
    }

}

// 计分函数
function score() {
    // 获取到显示分数的元素
    var score = document.querySelector('#score');
    // 将分数 + 1 并赋值给newScore变量
    var newScore = parseInt(score.innerHTML) + 1;
    // 设置新的分数
    score.innerHTML = newScore;
    // 当分数是10的倍数时进行加速
    if (newScore % 10 == 0) {
        speed += 2;
    }
}

// 判断点击的是黑块还是白块
function judgeWB(ev) {
    /**
     * target 是一个事件属性，返回触发该事件的事件源，此处的触发源是被点击的黑/白块
     */
    // 点击了白块，没有类名‘black’且有类名‘column’
    if (ev.target.className.indexOf('black') == -1 && ev.target.className.indexOf('column') !== -1) {
        // 给其父节点row定义属性clickW = 1，表明该行有白块被点击
        ev.target.parentNode.clickW = 1;
    }
    // 点击了黑块，有类名‘black’
    if (ev.target.className.indexOf('black') !== -1) {
        // 1. 去掉black类名，让其变成白块
        ev.target.className = 'column';
        // 2. 给其父节点定义属性clickB，表明该行黑块被点击
        ev.target.parentNode.clickB = 1;
        // 3. 点击了黑块加一分，调用计分函数
        score();
    }
}

// 向下移动的函数，让黑白块不停下落
function move() {
    // 获取到content的style样式中的top值
    var top = parseInt(window.getComputedStyle(content, null)['top']);
    /* 
      top = 0 时，刚好整个content全部展示出来，如大于0，那么content就会跑到的main的下边
      黑块不能触底，所以top最大值只能是0
    */
    if (top + speed > 0) {
        top = 0;
    } else {
        // 不断增加top值
        top += speed;
    }
    // 给content设置新的top值使得content向下移动起来
    content.style.top = top + 'px';
    // 每次移动后，判断游戏是否结束(即判断黑块是否触底 或 是否点击了白块)
    judgeOver();

    // 如果top = 0，证明content盒子触底了
    if (top == 0) {
        // 此时应该在最上边生成一行row
        creatRow();
        // 将content盒子上移一行的高度，即top = -102px
        content.style.top = '-102px';
        // 同时删除最下边一行row
        delRow();
    }
}

// 初始化函数
function init() {
    // 表明在游戏中
    flag = true;
    // 循环生成四行黑白块
    for (var i = 0; i < 4; i++) {
        // 调用生成黑白块函数
        creatRow();
    }
    // 给main绑定点击事件，用事件委托；也就是给游戏界面里边的所有黑白块都绑定了该点击事件
    main.onclick = function(ev) {
            // 当方块被点击的时候调用判断黑白块函数 进行判断
            judgeWB(ev);
        }
        // 开启定时器
    clock = window.setInterval('move()', 30);
}

/* 给开始游戏按钮绑定点击事件，点击开始游戏按钮，执行初始化游戏函数*/
startBtn.onclick = function() {
    // flag = flase，没有开始游戏，此时才可以点击开始游戏按钮
    if (!flag) {
        init();
    }
    // flag = true，游戏已经开始，无需重复点击按钮
    else {
        alert('不要重复点击');
    }
}

// 游戏结束函数
function over() {
    // 1. 关闭定时器
    clearInterval(clock);
    // 2. 修改信号量flag
    flag = false;
    // 3. 获取到显示分数的元素
    var score = document.querySelector('#score');
    // 4. 弹出最终得分
    confirm('最终得分：' + parseInt(score.innerHTML) + '分')
        // 5. 将得分清零
    score.innerHTML = 0;
    // 6. 清空content中的黑白块
    content.innerHTML = '';
    // 7. 设置content的top为初值-408px
    content.style.top = '-408px';

}

// 判断游戏是否结束(有两种情况)
function judgeOver() {
    // 获取到所有的row节点
    var rows = content.childNodes;
    // 第一种情况：在黑块触底(rows.length == 5)之前未点击黑块(rows[rows.length - 1].clickB !== 1)
    if (rows.length == 5 && rows[rows.length - 1].clickB !== 1) {
        // 调用游戏结束函数
        over();
    }
    // 第二种情况：点击了游戏界面中任意一行的白块，游戏结束
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].clickW == 1) {
            over();
        }
    }
}