let img;
let gif;
let main;
let drum;
let guitar;
let panio;
let Pdrum;
let PdrumGif;
let Pguitar;
let PguitarGif;
let Ppanio;
let PpanioGif;
let Pmain;
let PmainGif;
let fft;
let w;
let slider;
var button;
var flagPanio = false;
var flagDrum = false;
var flagGuitar = false;
var colorflag;
var flag = true;
var flagPause = false;


function preload() {
    drum = loadSound('drum.mp3');
    guitar = loadSound('guitar.mp3');
    panio = loadSound('panio.mp3');
    Pdrum = loadImage("drum.png");
    PdrumGif = loadImage("drum.gif");
    Pguitar = loadImage("guitar2.png");
    PguitarGif = loadImage("guitar2.gif");
    Ppanio = loadImage("panio.png");
    PpanioGif = loadImage("panio.gif");
    PmainGif = loadImage("main.gif");
    Pmain = loadImage("main.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);  //创建画布

    colorMode(HSB);
    strokeCap(ROUND); //PROJECT for rectangles, ROUND for circles and rounded rectangles
    radius = height*1/4; // Radius of the circle made
    number = 80; // Number of points making up the circle
    baseAngle = 0;
    angle = baseAngle; // Used to draw the circle of points
    frameRate(60);
    rec = 0; // This only needs to be non-zero if using strokeCap(Project), since it means they will be properly rotated


  /*  drum.play();
    guitar.play();
    panio.play();*/
  //  main.play();

    amp1 = new p5.Amplitude();
    amp1.setInput(drum);
    amp2 = new p5.Amplitude();
    amp2.setInput(guitar);
   // amp.setInput(panio,drum,guitar);
    amp3 = new p5.Amplitude();
    amp3.setInput(panio);
    amp = new p5.Amplitude();

    fft1 = new p5.FFT(0.9);
    fft1.setInput(drum);
    fft2 = new p5.FFT(0.9);
    fft2.setInput(guitar);
    fft3 = new p5.FFT(0.9);
    fft3.setInput(panio);
    fft = new p5.FFT(0.9);

  //  fft.setInput(panio,drum,guitar);

    slider = createSlider(0,1,0.5,0.01);
    slider.position(40, 30);
    slider.size(200);

    sliderPanio = createSlider(0,1,0.5,0.01);
    sliderPanio.position(width/9-15,height/2-12+55+70+40);
    sliderPanio.size(100);

    sliderDrum = createSlider(0,1,0.5,0.01);
    sliderDrum.position(width/2-350,height/4-92+80);
    sliderDrum.size(100);

    sliderGuitar = createSlider(0,1,0.5,0.01);
    sliderGuitar.position(width/4*3-110,height/4-62-40);
    sliderGuitar.size(100);

    //
    button = createButton("PLAY"); //开始按钮
    button.position(40, 80);
    button.mousePressed(playSong);

    button1 = createButton("PAUSE"); //暂停按钮
    button1.position(40, 130);
    button1.mousePressed(pauseSong);

    button2 = createButton("STOP"); //暂停按钮
    button2.position(40, 180);
    button2.mousePressed(stopSong);

    button3 = createButton("JUMP"); //跳转按钮
    button3.position(40, 230);
    button3.mousePressed(jumpSong);

    button4 = createButton("PLAY"); //钢琴音频播放按钮
    button4.position(width/9-15,height/2-12+55+30);
    button4.mousePressed(playPanio);

    button5 = createButton("PAUSE"); //钢琴音频暂停按钮
    button5.position(width/9-15,height/2-12+55+70);
    button5.mousePressed(pausePanio);

    button6 = createButton("PLAY"); //鼓音频播放按钮
    button6.position(width/2-350,height/4-92);
    button6.mousePressed(playDrum);

    button7 = createButton("PAUSE"); //鼓音频暂停按钮
    button7.position(width/2-350,height/4-92+40);
    button7.mousePressed(pauseDrum);

    button8 = createButton("PLAY"); //吉他音频播放按钮
    button8.position(width/4*3-110,height/4-62);
    button8.mousePressed(playGuitar);
    //
    button9 = createButton("PAUSE"); //吉他音频暂停按钮
    button9.position(width/4*3-110,height/4-62+40);
    button9.mousePressed(pauseGuitar);

    sel = createSelect(); //速度下拉框
    sel.position(40, 280);
    sel.option('0.5x');
    sel.option('0.75x');
    sel.option('1x');
    sel.option('1.25x');
    sel.option('1.5x');
    sel.option('2x');
    sel.selected('1x');
    sel.changed(speedSong);

    sel1 = createSelect(); //颜色下拉框
    sel1.position(40, 330);
    sel1.option('white');
    sel1.option('pink');
    sel1.option('yellow');
    sel1.option('rainbow');
    sel1.option('blue');
    sel1.option('green');
    sel1.selected('white');
    sel1.changed(changeColor);


}
function draw() {
    background(10);
    noFill();
    stroke(220);

    strokeWeight(5);
    ellipse(width/2,height,width/4);
    strokeWeight(3);
    ellipse(width/2,height,width*2/3);
    strokeWeight(2);
    ellipse(width/2,height,width);

    textSize(22);

 //   main.setVolume(slider.value());

    text(int(slider.value()*100),250,40);
    textSize(20);
    text(int(sliderPanio.value()*100),width/9-15+100,height/2-12+55+70+40+10);
    text(int(sliderDrum.value()*100), width/2-350+100,height/4-92+80+10);
    text(int(sliderGuitar.value()*100), width/4*3-110+100,height/4-62-40+10);



    drawMain();
    drawPanio();
    drawDrum();
    drawGuitar();



    slider.changed(sliderVolumeChange);
    sliderPanio.changed(PaniosliderVolumeChange);
    sliderGuitar.changed(GuitarsliderVolumeChange);
    sliderDrum.changed(DrumsliderVolumeChange);

    if(flagPanio==true){
        panio.setVolume(0);
    }else{
        panio.setVolume(sliderPanio.value());
    }
    if(flagDrum==true){
        drum.setVolume(0);
    }else{
        drum.setVolume(sliderDrum.value());
    }
    if(flagGuitar==true){
        guitar.setVolume(0);
    }else{
        guitar.setVolume(sliderGuitar.value());
    }

    if(flagPause==true){
        flag = true;
    }





}



function drawPanio(){

    let vol3 = amp3.getLevel();

    noStroke();
    fill('#B0C4DE');
    let r = map(vol3, 0, 1, 260, 430);
    ellipse(width/4,height/2,r);
    //Ppanio.stop();
   // image(Ppanio, width/4-125, height/2-125);

  drawAmp(fft3,amp3,width/4,height/2);

    if(flag==false){
        image(PpanioGif, width/4-125, height/2-125);
    }else{
        image(Ppanio, width/4-125, height/2-125);
    }
  //  console.log(vol3);
  fill(220);

  rect(width/9-20,height/2-12,10,55);
  textSize(24);
  textStyle(BOLD);
  textFont('Courier New');
  text('Piano',width/9,height/2);
  text('钢琴',width/9,height/2+40);

}

function drawDrum(){

    let vol1 = amp1.getLevel();

    noStroke();
    fill('#FFE4E1');
    let r1 = map(vol1, 0, 1, 270, 450);
    ellipse(width/2,height/4,r1);
   // image(Pdrum, width/2-120, height/4-160);
    //ellipse(width/2,height/4,vol1*200)
   // stroke('#F08080')
    drawAmp(fft1,amp1,width/2,height/4);
    //console.log(vol1);
    if(flag==false){
        image(PdrumGif, width/2-120, height/4-160);
    }else{
        image(Pdrum, width/2-120, height/4-160);
    }

    fill(220);
    rect(width/2-280,height/4-92,10,55);
    textSize(24);
    textStyle(BOLD);
    textFont('Courier New');
    text('Drum',width/2-260,height/4-80);
    text('鼓',width/2-260,height/4-40);

}

function drawGuitar(){


    let vol2 = amp2.getLevel();
    noStroke();
    fill('#FFEBCD');
    let r2 = map(vol2, 0, 1, 260, 450);
    ellipse(width/4*3,height/2,r2);
   // image(Pguitar, width/4*3-110, height/2-120);
   // ellipse(900,400,vol2*300)
    //stroke('#F0E68C');
    drawAmp(fft2,amp2,width/4*3,height/2);
    if(flag==false){
        image(PguitarGif, width/4*3-120, height/2-140);
    }else{
        image(Pguitar, width/4*3-120, height/2-140);
    }


    fill(220);
    rect(width/4*3-40,height/4-62,10,55);
    textSize(24);
    textStyle(BOLD);
    textFont('Courier New');
    text('Guitar',width/4*3-20,height/4-50);
    text('吉他',width/4*3-20,height/4-10);
}

function drawMain(){

    let vol = amp.getLevel();
    noStroke();
    fill('#E6E6FA');
    let r = map(vol, 0, 1, 260, 430);
    ellipse(width/2,height/4*3,r);
    //image(Pmain, width/2-120, height/4*3-125);
    //ellipse(width/2,height/4*3,vol*200)
   // stroke('#87CEEB');
    drawAmp(fft,amp,width/2,height/4*3);
    if(flag==false){
        image(PmainGif, width/2-120, height/4*3-125);
    }else{
        image(Pmain, width/2-120, height/4*3-125);
    }
    fill(255);
    textSize(42);
    textStyle(BOLD);
    textFont('Courier New');
    text('Main Melody',width/2-120,height-20);
}

function drawAmp(fft,amp,w,h){
    push();
    magnitude = radius/10;
    angle = baseAngle;
    var spectrum = fft.analyze(); // This is what gives us the shape

    beginShape();
    translate(w, h);
    for(var i = 0; i < number; i++){
        spec = spectrum[i*2]; // Most of the 1024 parts of the spectrum are unused, we only need 1-200ish really (does depend on the song)
        size = sq(map(spec, 0, 255, 0, 1)); // Squaring the map() just means there is a bigger difference between the highs and the lows
        level = amp.getLevel(); // Get the current volume
        if(level >0.0004&&flagPause==true){
            flag = true;
        }else if(level >0.0004&&flagPause==false){
            flag = false;
        }else{
            flag = true;
        }

        x1 = sin(angle)*radius/4*3; // Get the inner coords of the point on the circle using trig
        y1 = cos(angle)*radius/4*3;
        modifier = (1 + size/2)*(1+level/7) + rec;
        x2 = x1 * modifier;
        y2 = y1 * modifier;

        strokeWeight((level+1)*6);
        stroke(225);
        if(colorflag==0){
            stroke(225);
        }else if(colorflag==1){
            stroke("#FFC0CB");
        }else if(colorflag==2){
            stroke("#FFE4B5");
        }else if(colorflag==3){
            stroke("#4169E1");
        }else if(colorflag==4){
            stroke("#98FB98");
        }else if(colorflag==5){
            stroke(i*(360/number), 360, 360);
        }
        line(x1, y1, x2, y2);
        angle += TWO_PI/number;
    }
    endShape();
    pop();
}


function playSong(){
    if((!panio.isPlaying())&&(!drum.isPlaying())&&(!guitar.isPlaying())){
       // main.play();
        panio.play();
        drum.play();
        guitar.play();
    }
    flagPause = false;

}
function pauseSong(){

    if((panio.isPlaying())&&(drum.isPlaying())&&(guitar.isPlaying())){
      //  main.pause();
       // panio.setVolume(0);
 //  flagPause = true;
        panio.pause();
      // panio.setVolume(0);

        drum.pause();
        guitar.pause();

    }
    flagPause = true;
  //  image(Ppanio, width/4-125, height/2-125);


}
function stopSong(){
    if((panio.isPlaying())&&(drum.isPlaying())&&(guitar.isPlaying())){
      //  main.stop();
        panio.stop();
        drum.stop();
        guitar.stop();
    }
    flagPause = true;
}

function jumpSong(){
    var len = panio.duration();
    var currentLen = panio.currentTime();
    if((panio.isPlaying())&&(drum.isPlaying())&&(guitar.isPlaying()) && (currentLen<=len)){
        currentLen += 15;
      //  main.jump(currentLen);
        panio.jump(currentLen);
        drum.jump(currentLen);
        guitar.jump(currentLen);
    }


}

function speedSong(){
    let item = sel.value();

    if(item=='0.5x') {
        // main.playbackRate = 0.5;
        // main.pause();
        // main.play();
        panio.playbackRate = 0.5;
        panio.pause();
        panio.play();
        drum.playbackRate = 0.5;
        drum.pause();
        drum.play();
        guitar.playbackRate = 0.5;
        guitar.pause();
        guitar.play();
    }else if(item=='0.75x'){
        // main.playbackRate = 0.75;
        // main.pause();
        // main.play();
        panio.playbackRate = 0.75;
        panio.pause();
        panio.play();
        drum.playbackRate = 0.75;
        drum.pause();
        drum.play();
        guitar.playbackRate = 0.75;
        guitar.pause();
        guitar.play();
    }else if(item=='1x'){
        // main.playbackRate = 1;
        // main.pause();
        // main.play();
        panio.playbackRate = 1;
        panio.pause();
        panio.play();
        drum.playbackRate = 1;
        drum.pause();
        drum.play();
        guitar.playbackRate = 1;
        guitar.pause();
        guitar.play();
    }else if(item=='1.25x'){
        // main.playbackRate = 1.25;
        // main.pause();
        // main.play();
        panio.playbackRate = 1.25;
        panio.pause();
        panio.play();
        drum.playbackRate = 1.25;
        drum.pause();
        drum.play();
        guitar.playbackRate = 1.25;
        guitar.pause();
        guitar.play();
    }else if(item=='1.5x'){
        // main.playbackRate = 1.5;
        // main.pause();
        // main.play();
        panio.playbackRate = 1.5;
        panio.pause();
        panio.play();
        drum.playbackRate = 1.5;
        drum.pause();
        drum.play();
        guitar.playbackRate = 1.5;
        guitar.pause();
        guitar.play();
    }else if(item=='2x'){
        // main.playbackRate = 2;
        // main.pause();
        // main.play();
        panio.playbackRate = 2;
        panio.pause();
        panio.play();
        drum.playbackRate = 2;
        drum.pause();
        drum.play();
        guitar.playbackRate = 2;
        guitar.pause();
        guitar.play();
    }

}

function changeColor(){
    let item1 = sel1.value();

    if(item1=='pink') {
        colorflag = 1;
    }else if(item1=='white'){
        colorflag = 0;
    }else if(item1=='yellow'){
        colorflag = 2;
    }else if(item1=='blue'){
        colorflag = 3;
    }else if(item1=='green'){
        colorflag = 4;
    }else if(item1=='rainbow'){
        colorflag = 5;
    }

}

function playPanio(){

    flagPanio = false;
}
function pausePanio(){

    flagPanio = true;

}

function playDrum(){

    flagDrum = false;
}
function pauseDrum(){

    flagDrum = true;

}

function playGuitar(){

    flagGuitar = false;
}
function pauseGuitar(){

    flagGuitar = true;

}

function sliderVolumeChange(){
    panio.setVolume(slider.value());
    sliderPanio.remove();
    sliderPanio = createSlider(0,1,slider.value(),0.01);
    sliderPanio.position(width/9-15,height/2-12+55+70+40);
    sliderPanio.size(100);
    drum.setVolume(slider.value());
    sliderDrum.remove();
    sliderDrum = createSlider(0,1,slider.value(),0.01);
    sliderDrum.position(width/2-350,height/4-92+80);
    sliderDrum.size(100);
    guitar.setVolume(slider.value());
    sliderGuitar.remove();
    sliderGuitar = createSlider(0,1,slider.value(),0.01);
    sliderGuitar.position(width/4*3-110,height/4-62-40);
    sliderGuitar.size(100);
}

function PaniosliderVolumeChange(){
    panio.setVolume(sliderPanio.value());
}

function DrumsliderVolumeChange(){
    drum.setVolume(sliderDrum.value());
}
function GuitarsliderVolumeChange(){
    guitar.setVolume(sliderGuitar.value());
}