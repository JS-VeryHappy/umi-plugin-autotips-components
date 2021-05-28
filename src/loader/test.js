class Scheduler {
  constructor() {
    this.tasks = [];
    this.waitTasks = [];
  }
  add(promiseCreator) {
    return new Promise(resolve => {
      promiseCreator.resolve = resolve;
      if (this.tasks.length < 2) {
        this.start(promiseCreator);
      } else {
        this.waitTasks.push(promiseCreator);
      }
    });
  }
  start(promiseCreator) {
    this.tasks.push(promiseCreator);
    promiseCreator().then(() => {
      promiseCreator.resolve();
      this.remove(promiseCreator);
      if (this.waitTasks.length > 0) {
        this.start(this.waitTasks.shift());
      }
    });
  }
  remove(promiseCreator) {
    var idnex = this.tasks.findIndex(promiseCreator);
    this.tasks.splice(idnex, 1);
  }
}
const timeout = time =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
};

// addTask(1000, '1')
// addTask(500, '2')
// addTask(300, '3')
// addTask(400, '4')

function getNums36() {
  var nums36 = [];
  for (var i = 0; i < 36; i++) {
    if (i >= 0 && i <= 9) {
      nums36.push(i);
    } else {
      nums36.push(String.fromCharCode(i + 87));
    }
  }
  return nums36;
}

//十进制数转成36进制
function scale36(n) {
  var arr = [];
  var nums36 = getNums36();
  while (n) {
    var res = n % 36;
    //作为下标，对应的36进制数，转换成
    arr.unshift(nums36[res]);
    //去掉个位
    n = parseInt(n / 36);
    console.log('====================================');
    console.log(arr);
    console.log('====================================');
  }
  return arr.join('');
}

// console.log(scale36(100));

function phone() {
  this.name = '你好1';
  this.sendMassage = function() {
    console.log('1');
  };
}
// phone.prototype.sendMassage = function(){
//   console.log('1');
// }

function iPhone8() {
  phone.apply(this);
  this.name = '你好2';
  this.sendMassage = function() {
    console.log('2');
  };
}
// let fn = function (){}
// fn.prototype = phone.prototype;
// iPhone8.prototype = new iPhone8()

// var a = new iPhone8();
// a.sendMassage();
// console.log(a.name,a.__proto__);

var Person = function() {
  this.x = 1;
};
Person.prototype.name = 'Nicholas';
Person.prototype.age = '29';
Person.prototype.job = 'Software Engineer';
var person1 = new Person();
console.log(person1.x, Person.prototype); //true
