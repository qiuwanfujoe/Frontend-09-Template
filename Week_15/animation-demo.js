
import {Timeline, Animation} from './animation'

let tl = new Timeline();
window.tl = tl;
tl.start();

window.animation = new Animation(document.querySelector('#el').style,"transform",0,100,2000,0, v=>`translateX(${v})px`)
tl.add(animation);

document.querySelector('#pause').addEventListener('click',()=>{
    tl.pause();
})

document.querySelector('#resume').addEventListener('click',()=>{
    tl.resume();
})