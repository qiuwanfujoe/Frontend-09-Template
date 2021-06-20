import {Component, createElement} from './framework.js'
import {Carousel} from './carousel.js';
import {Button} from './button.js';
import {List} from './list.js';
import {Timeline ,Animation} from './animation.js'
let imgs = [
    {
        img:'https://youimg1.tripcdn.com/target/1009050000000fwwxF9F2_C_670_770.jpg_.webp',
        url:'https://www.trip.com/travel-guide/city-of-los-angeles/universal-studios-hollywood-85361/',
        title:'Hollywood Walk of Fame'
    },
    {
        img:'https://youimg1.tripcdn.com/target/100f1f000001gqbpe5961_C_670_770.jpg_.webp',
        url:'https://www.trip.com/travel-guide/city-of-los-angeles/griffith-observatory-85260/',
        title:'Hollywood Walk of Fame'
    },
    {
        img:'https://youimg1.tripcdn.com/target/100u1f000001gq76gF793_C_670_770.jpg_.webp',
        url:'https://www.trip.com/travel-guide/los-angeles/santa-monica-beach-80509/',
        title:'Hollywood Walk of Fame'
    },
    {
        img:'https://youimg1.tripcdn.com/target/100i1f000001gp4gs2FA1_C_670_770.jpg_.webp',
        url:'https://www.trip.com/travel-guide/city-of-los-angeles/hollywood-walk-of-fame-10559066/',
        title:'Hollywood Walk of Fame'
    }
];

var a = <Carousel src={imgs} 
onChange={event => console.log(event.detail.position)}
onClick={event => window.open(event.detail.data.url)}
>
</Carousel>;

a.mountTo(document.body);

let timeLine = new Timeline();
window.timeLine = timeLine;
window.animation = new Animation({set a(v){ console.log(v)}},'a',0, 100,1000,null);
timeLine.start();


// 两种children的实现
let b = <Button>
    button content
</Button>;
b.mountTo(document.body);

let c = <List data={imgs}>
    {
        (record)=> <div>
            <img style="width:100px;height:80px;vertical-align:middle;" src={record.img} />
            <a href={record.url}>{record.title}</a>
        </div>
    }
</List>;
c.mountTo(document.body);