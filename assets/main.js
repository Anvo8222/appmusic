const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);


const heading=$('header h2');
const cdThumb=$('.cd-thumb');
const audio= $('#audio');
const cd=$('.cd');
const playBtn=$('.btn-toggle-play');
const player=$('.player');
const progress=$('#progress');
const nextBtn=$('.btn-next');
const prevBtn=$('.btn-prev');
const randomBtn=$('.btn-random');
const repeatBtn=$('.btn-repeat')
const playList=$('.playlist');


const app={
    currenIndex:0,
    isplaying:false,
    isRandom:false,
    isRepeat:false,
    songs:[
        {
            name:'Anh sai roi',
            Singer:'Son Tung',
            path:'./assets/music/anh_sai_roi.mp3',
            image:'./assets/img/anhsairoi.jpg'
        },
        {
            name:'Binh yen tung phut giay',
            Singer:'Son Tung',
            path:'./assets/music/binhyennhungphutgiay.mp3',
            image:'./assets/img/binhyentungphutgiay.jpg'
        },
        {
            name:'Buông đôi tay nhau ra',
            Singer:'Son Tung',
            path:'./assets/music/buongdoitaynhaura.mp3',
            image:'./assets/img/buongdoitaynhaura.jpg'
        },
        {
            name:'Chúng ta không thuộc về nhau',
            Singer:'Son Tung',
            path:'./assets/music/chungtakhongthuocvenhau.mp3',
            image:'./assets/img/chungtakhongthuocvenhau.jpg'
        },
        {
            name:'Có chắc yêu là đây',
            Singer:'Son Tung',
            path:'./assets/music/cochacyeuladay.mp3',
            image:'./assets/img/cochacyeuladay.jpg'
        },
        {
            name:'Cơn mưa ngang qua',
            Singer:'Son Tung',
            path:'./assets/music/conmuangangqua.mp3',
            image:'./assets/img/conmuangangqua.jpg'
        },
        {
            name:'Đừng về trễ',
            Singer:'Son Tung',
            path:'./assets/music/dungvetre.mp3',
            image:'./assets/img/dungvetre.jpg'
        },
        {
            name:'Em của ngày hôm qua',
            Singer:'Son Tung',
            path:'./assets/music/emcuangayhomqua.mp3',
            image:'./assets/img/emcuangayhomqua.jpg'
        },
        {
            name:'Hãy trao cho anh',
            Singer:'Son Tung',
            path:'./assets/music/haytraochoanh.mp3',
            image:'./assets/img/haytraochoanh.jpg'
        },
        {
            name:'Lệ anh vẫn rơi',
            Singer:'Son Tung',
            path:'./assets/music/leanhvanroi.mp3',
            image:'./assets/img/leanhvanroi.jpg'
        },
        {
            name:'Mai này con lớn lên',
            Singer:'Son Tung',
            path:'./assets/music/mainayconlonlen.mp3',
            image:'./assets/img/mainayconlonlen.jpg'
        },
        {
            name:'Mãi yêu em',
            Singer:'Son Tung',
            path:'./assets/music/maiyeuem.mp3',
            image:'./assets/img/maiyeuem.jpg'
        },
        {
            name:'Nơi này có anh',
            Singer:'Son Tung',
            path:'./assets/music/noinaycoanh.mp3',
            image:'./assets/img/noinaycoanh.jpg'
        },
    ],
    //render ra cai view
    render:function(){
        //chọc lên cái mảng ở bên trên
        const htmls=this.songs.map((song,index) => {
            return `
            <div class="song ${index===this.currenIndex? 'active' : ' '}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                            <p class="author">${song.Singer}</p>
                            </div>

                            <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        //thêm element có class là song vào playList ngăng cánh bởi ''
        $('.playlist').innerHTML=htmls.join('');

    },
    //lay bai hat dau tien 
    definePropertise:function(){
        //
        Object.defineProperty(this,'currenSong',{
            get: function(){
                return this.songs[this.currenIndex];
            }
        })
    },
    //hàm sử lý các sự kiện DOM
    handleEvent:function(){
        const cd=$('.cd');
        const cdWidth=cd.offsetWidth;
        // xu ly khi quay / dừng
       const cdThumbAnimate= cdThumb.animate([
        {
            transform:'rotate(360deg)'
        }
        ],{
            duration:10000, //10 giây
            iterations:Infinity
        } )
        cdThumbAnimate.pause();
        //lắng nghe sự kiện kéo thả thanh scroll
        document.onscroll= function() {

            //lấy giá trị khi kéo
            const scrollTop= document.documentElement.scrollTop || window.scrollY;
            const newCdWidth=cdWidth-scrollTop;
            cd.style.width=newCdWidth>0 ? newCdWidth+'px' : 0;
            cd.style.opacity=newCdWidth/cdWidth;
        }
        //xu ly click play
        playBtn.onclick= () =>{

            if(app.isplaying){
                //iplaying == truee
                app.isplaying=false;
                //dừng
                audio.pause();
                //xóa class playin
                player.classList.remove('playing')
            }
            else{
                app.isplaying=true;
                audio.play();
                player.classList.add('playing')
            }
            

        }
        //khi dang chay
        audio.onplay = function(){
            cdThumbAnimate.play();
            player.classList.add('playing')
        }
        //khi dang dừng
        audio.onpause=function(){
            cdThumbAnimate.pause();
            player.classList.remove('playing')
        }

        // khi tiến độ bài hat thay đổi.
        audio.ontimeupdate=function(){
            if(audio.duration){

                const progressPercent=Math.floor(audio.currentTime / audio.duration *100);
                progress.value=progressPercent;
            }
        }
        // xu ly khi tua
        progress.onchange=function(e){
            //tổng số giây chia 100 * vị trí thay đổi = số giây

            const seekTime =audio.duration / 100 *e.target.value;
            audio.currentTime=seekTime;
            //thời gian hiện tại khi click
        }
        nextBtn.onclick=() => {
            
            app.nextSong();
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        prevBtn.onclick=() => {
            
            app.prevSong();
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        //khi click vao nut random(bat / tat)
        randomBtn.onclick=()=>{
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active',app.isRandom);
        }

        //khi bai hat ket thuc
        audio.onended=function(){
            // if(app.isRepeat){
            //     audio.play();
            // }else{
                if(app.isRepeat){
                    audio.play();
                }
                else{
                    nextBtn.click();

                }
                app.render();
                app.scrollToActiveSong();
            // }
            // app.nextSong();
            // audio.play();
        }
        //xu ly phat lai 1 bai hat
        repeatBtn.onclick=function(){
            app.isRepeat= !app.isRepeat
            repeatBtn.classList.toggle('active',app.isRepeat)
        }
        // lang nghe hanh vi click vao playList
        playList.onclick = function(e){
            const songNode=e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                //xu ly khi click vao song
                if(songNode){
                    //nãy dạng chuỗi đổi sang dạng số
                    app.currenIndex=Number(songNode.getAttribute('data-index')) ;
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
                //xu ly khi click vao option
            }
        }
    },
    loadCurrentSong:function(){
       
        heading.textContent=this.currenSong.name;
        cdThumb.style.backgroundImage=`url('${this.currenSong.image}')`;
        audio.src=this.currenSong.path;

    },
    //khi load xong
    nextSong:function(){
        this.currenIndex++
        if(this.currenIndex >= this.songs.length){
            this.currenIndex=0;
        }
        this.loadCurrentSong();
    },
    prevSong:function(){
        this.currenIndex--;

        if(this.currenIndex < 0){
            this.currenIndex=this.songs.length -1;
        }
        this.loadCurrentSong();
        console.log(this.currenIndex,this.songs.length)
    },
    playRandomSong:function(){
        let newIndex;
        do{
            newIndex=Math.floor(Math.random()*app.songs.length);
        }while(newIndex===app.currenIndex)
        app.currenIndex=newIndex;
        app.loadCurrentSong();
    },
    //bắt đầu
    start:function(){
        //dinh nghia cac thuoc tinh cho object 
        this.definePropertise();
        //lang nghe xu ly cac su kien
        this.handleEvent();
        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong();
        //render lai danh sach bai hat
        this.render();
    },
    scrollToActiveSong:function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView(
                {
                    behavior:'smooth',
                    block:'center',
                }
            );
        },500)
    },
    
}
app.start();

