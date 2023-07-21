const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {addUser, removeUser, getUser, getUsersInRoom} = require("./utils/users");
const app=express();
const server=http.createServer(app);
const io=socketio(server);


const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));   
const words = ['drunk','save','faint','serve','soda','sip','puny','handy','copy','warn','dime','taboo','tip','cute','pat','rely','word','offer','shame','tank','back','boast','wall','seat','fence','cream','look','bent','size','jumpy','ugly','clap','boy','soft','wry','toys','water','gate','gun','uncle','groan','toe','use','shelf','step','ice','brush','spare','bath','saw','even','sense','scent','star','spill','early','road','cats','left','silk','coast','leg','null','angry','story','best','jolly','woman','slave','large','ajar','toad','nose','print','load','bump','peel','dusty','type','jar','pushy','rat','skate','lie','few','pray','scene','warm','board','blot','wrist','grip','trip','meaty','yummy','puffy','windy','birth','cause','crook','learn','knit','rob','chase','toes','alarm','end','wary','tooth','train','wink','oil','utter','agree','drown','zippy','berry','sleep','fuel','loss','joke','kill','truck','thaw','mint','bike','songs','bad','bow','dead','icky','woozy','admit','super','rail','list','haunt','snore','fear','past','lock','tail','dog','ducks','swift','dry','shaky','spell','grin','farm','pets','wail','bore','foot','mask','park','flame','fancy','money','hurry','quick','play','slope','bake','fast','zesty','far','bait','aback','mice','mark','hard','room','tough','kind','misty','work','roof','day','flash','mouth','scarf','file','hill','naive','badge','error','deep','plain','drink','need','lace','cub','pan','curly','pass','abaft','exist','mug','fly','stem','plot','solid','shy','whip','black','pie','mean','doll','tacky','nosy','girl','round','book','humor','thank','corn','kick','stale','card','short','float','party','loose','pull','smart','tame','wheel','crash','bell','knee','fang','basin','rare','sheep','cave','glue','raise','land','yard','tacit','yoke','ants','one','shape','angle','nod','gaze','fit','head','gabby','fade','store','spicy','sun','nerve','young','carry','trap','hall','hook','pink','boil','stamp','check','rabid','top','son','space','stuff','shade','peace','honey','wipe','noise','tent','cover','reply','slow','weigh','lame','pop','sink','brash','rod','icy','near','judge','scare','jail','teeny','pale','yarn','stiff','coach','chess','lean','shake','sore','brief','plant','smell','fail','wide','screw','egg','limit','cagey','zany','key','sky','spoon','moan','cool','half','sulky','horse','prick','bang','cycle','lunch','strap','waves','knife','flock','part','ink','straw','crack','heavy','frame','rush','wrong','rot','sharp','light','crowd','month','pin','kneel','damp','alike','food','clam','brick','jeans','cat','call','fax','nippy','noisy','flat','last','share','clip','wild','nasty','heap','fetch','tray','man','lush','punch','open','voice','ruin','grape','yak','ultra','fixed','arch','lowly','hum','rapid','match','obey','ghost','fruit','low','dock','steel','price','steep','talk','mass','note','stare','neck','bury','hop','lake','pot','own','grab','amuck','bag','horn','fry','long','eight','rake','hunt','whole','cry','stone','three','sock','place','ten','air','doubt','duck','pen','tour','claim','thin','guide','relax','ball','lucky','eggs','drop','ahead','bite','tub','flood','river','testy','four','great','shop','messy']
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

io.on('connection',(socket)=>{
    console.log('New WebSocket connection');
    socket.on('join', ({username,room},callback)=>{
        username=username.trim()
        room=room.trim()
        if(room=="" || username==""){
           return  callback({error:"input fields can not be empty!"})
        }
        const isAdded = addUser(socket.id,username,room)
        const roomLength = getUsersInRoom(room).length
        if(username.length>20){
            return callback({error:"username length too large, must be less than 21 characters"})
        }
        if(room.length>20){
            return callback({error:"room length too large, must be less than 21 characters"})
        }
        if(isAdded==0)
        {
            return callback({error:'this username already exist in this room'})
        }
        if(roomLength>2){
            return callback({error:'this room is full'})
        }

        let testPara=""
        socket.join(room) 
        let t=getUser(socket.id) 
        let userInRoom = getUsersInRoom(t.room)
        io.to(t.room).emit('updateRoomInfo',t,userInRoom)
        socket.broadcast.to(t.room).emit('connected',t.username+" joined the room!")
 
        io.set('transports', ['websocket'])
        socket.on('startTest',(noOfWords)=>{
            io.to(getUser(socket.id).room).emit('clear')
            let p="";    
            for(let i=0;i<noOfWords;++i) 
                p+=words[randomIntFromInterval(0,words.length-1)]+" ";
            p = p.trim()
            testPara = p  
            io.to(getUser(socket.id).room).emit('updateTestPara',testPara,noOfWords)
        })

        socket.on('updateLiveTyping',(userPara,testParaF)=>{ 
            let score=0
            testPara=testParaF
            let totalScore=testPara.length
            let mn=userPara.length      
            if(testPara.length<mn)
                mn=testPara.length
            for(let i=0;i<mn;++i){
                if(testPara[i]==userPara[i])
                    ++score;
            }
            if(score==totalScore){
                socket.broadcast.to(getUser(socket.id).room).emit('lose')
                socket.emit('win')
            }
            score=100*(score/totalScore)
            socket.broadcast.to(getUser(socket.id).room).emit('updateOpponentProgress',score)
            socket.emit('updateMyProgress',score)  
        })
    }) 
    socket.on('disconnect',(reason)=>{           
        let user = removeUser(socket.id)
        let userInRoom = getUsersInRoom(user.room)
        io.to(user.room).emit('updateRoomInfo',user,userInRoom)
        io.to(user.room).emit('disconnected',user.username+" left the room!")
    })
}); 

app.get('*',(req,res)=>{
    res.send("<h1>404 page not found</h1>") 
})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`);
}); 