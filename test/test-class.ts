function superF(age) {
  this.name = "super";
  this.age = age || 17;
}

function subF(age) {
  superF.call(this, age);
  this.name = "subF";
}

function testMain() {}

class SuperF {
  name: string;
  constructor(public age) {
    this.name = "SuperF";
  }
}

typeof SuperF;

class SubF extends SuperF {}
