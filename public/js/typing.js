const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
    let typingTextarea = document.getElementById('typingTextarea')
    let liveTyping = document.getElementById('liveTyping')
    let testPara = document.getElementById('testPara')
    let myProgressBar = document.getElementById('myProgressBar')
    let opponentProgressBar = document.getElementById('opponentProgressBar')
    let myWins = document.getElementById('myWins')
    let opponentWins = document.getElementById('opponentWins') 
    myWins.value=0
    opponentWins.value=0    
    let myWinsCount=0
    let opponentWinsCount=0

    var socket = io({
        transports: ['websocket'],
        allowUpgrades: false,
        reconnection:false,
        reconnectionDelay:1000,
        reconnectionDelayMax:5000,
        reconnectionAttempts:Infinity,
        secure:true,
        rejectionUnauthorized:false,
        forceNew:true,
        timeout:60000,
        pingTimeout:60000
    })

    socket.emit('join',{username,room},(error)=>{
        if(error){
            alert(error.error)
            location.href='/'
        }
    })

    socket.on('updateRoomInfo',(roomInfo,userInRoom)=>{
        document.getElementById('roomName').innerHTML="<h1 style='margin-left: 100px;'>"+"Room:   "+roomInfo.room+"</h1>"
        if(userInRoom.length==1)
        document.getElementById('allUsers').innerHTML="<br><fieldset style='background:lightgreen;'><h3 style='margin-left: 150px;'>"+userInRoom[0].username+"</h3></fieldset>"
        else  {
            if(userInRoom[0].id==socket.id)
            document.getElementById('allUsers').innerHTML="<br><fieldset style='background:lightgreen;'><h3 style='margin-left: 150px;'>"+userInRoom[0].username+"</h3></fieldset><br><fieldset><h3 style='margin-left: 150px;'>"+userInRoom[1].username+"</h3></fieldset>"
            else document.getElementById('allUsers').innerHTML="<br><fieldset ><h3 style='margin-left: 150px;'>"+userInRoom[0].username+"</h3></fieldset><br><fieldset style='background:lightgreen;'><h3 style='margin-left: 150px;'>"+userInRoom[1].username+"</h3></fieldset>"
        }
    })

    function startTest10(){
        socket.emit('startTest',10)
    }
    function startTest30(){
        socket.emit('startTest',30)
    }
    function startTest50(){
        socket.emit('startTest',50)
    }
    function startTest70(){
        socket.emit('startTest',70)
    }

    typingTextarea.addEventListener('input',()=>{
        let q=""
        let typingSoFar = typingTextarea.value.toString()
        let testParaString = testPara.textContent
        let mn=typingSoFar.length 
        if(testParaString.length<mn)
            mn=testParaString.length
        for(let i=0;i<testParaString.length;++i){
            if( i<typingSoFar.length && typingSoFar[i]!=testParaString[i]){
                q=q+"<span style='background:red;color:white;'>"+testParaString[i]+"</span>"
            }
            else if(i<typingSoFar.length)q+="<span style='background:#abc5ab ;color:black;'>"+testParaString[i]+"</span>";
            else q+="<span style='background:tranparent;color:black;'>"+testParaString[i]+"</span>";
        }
        testPara.innerHTML=q
        socket.emit('updateLiveTyping',typingSoFar,testParaString)
    })

   
    socket.on('clear',async()=>{
        myProgressBar.value="0"
        opponentProgressBar.value="0"
        testPara.textContent=""
        liveTyping.textContent=""
        typingTextarea.value=""
        document.getElementById("winOrLose").innerHTML=""
        document.getElementById("thumbUpDown").textContent=""
    })

    let btn1=document.getElementById('btn1')
    let btn2=document.getElementById('btn2')
    let btn3=document.getElementById('btn3')
    let btn4=document.getElementById('btn4')

    socket.on('updateTestPara',async (msg,noOfWords)=>{
        btn1.disabled=true
        btn2.disabled=true
        btn3.disabled=true 
        btn4.disabled=true
        typingTextarea.disabled=true
        document.getElementById('noOfWords').textContent=noOfWords+" words"
        document.getElementById('loadingGIF').style.display="block"
        await setTimeout(() => {
            testPara.innerHTML=msg
            btn1.disabled=false
            btn2.disabled=false
            btn3.disabled=false 
            btn4.disabled=false
            document.getElementById('loadingGIF').style.display="none"
            typingTextarea.disabled=false
            typingTextarea.focus()
        }, 2500);
    })

    socket.on('updateOpponentProgress',(opponentScore)=>{
        opponentProgressBar.value=opponentScore
        let myScoree = parseFloat(myProgressBar.value)
        let opponentScoree = parseFloat(opponentProgressBar.value)
        if(myScoree>opponentScoree){
            document.getElementById('thumbUpDown').textContent="👍";
        }
        else if(myScoree<opponentScoree) document.getElementById('thumbUpDown').textContent="👎";
        else document.getElementById('thumbUpDown').textContent="🤝"
    })

    socket.on('updateMyProgress',(myScore)=>{
        myProgressBar.value=myScore
        let myScoree = parseFloat(myProgressBar.value)
        let opponentScoree = parseFloat(opponentProgressBar.value)
        if(myScoree>opponentScoree){
            document.getElementById('thumbUpDown').textContent="👍";
        }
        else if(myScoree<opponentScoree) document.getElementById('thumbUpDown').textContent="👎";
        else document.getElementById('thumbUpDown').textContent="🤝"
    })

    socket.on('lose',()=>{
        opponentWinsCount++
        opponentWins.value=opponentWinsCount
        typingTextarea.disabled=true
        document.getElementById('winOrLose').innerHTML="<h1 style='color:black;font-weight:black;font-size:50px;'>You lose 😔</h1>"
    })

    socket.on('win',()=>{
        myWinsCount++
        myWins.value=myWinsCount
        typingTextarea.disabled=true
        document.getElementById('winOrLose').innerHTML="<h1 style='color:black;font-weight:900;font-size:50px;'>You win 🥳</h1>"
    })
    
    socket.on('disconnected',(msg)=>{
        opponentWins.value="0"
        myWins.value="0"
        alert(msg)
    })

    socket.on('connected',(msg)=>{
        opponentWins.value="0"
        myWins.value="0"
        alert(msg)
    })