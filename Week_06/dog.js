class Dog {
    constructor(damage) {
        this.damage = damage;
    }

    attact(obj) {
        obj.hurt(this.damage);
    }
}

class Person {
  constructor(lifeYears) {
        this.lifeYears = lifeYears;
    }
    hurt(damage) {
        this.lifeYears -= damage
    }
}