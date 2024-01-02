
//elements
var sendBtn = document.getElementById('sendBtn');
var textBox = document.getElementById("textbox");
var chatContainer = document.getElementById("chatContainer");
var ticket = new Date().getTime();  //used for unique no for whcih user order request
var user = { message: "", counter: 0, meals: [], ticket };
var store = [];
var userLocation = '';
let mobile = /^(?:(?:\+|0{0,2})91(\s*[ -]\s*)?|[0]?)?[789]\d{9}$/g;
let email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

var questionsToAsk = [
    { "question": "what's your name?", "answer": "" },
    { "question": "Please share your mobile number?", "answer": "" },
    { "question": "Please enter your email?", "answer": "" },
    { "question": "Hello, how may I assist you today?", "answer": "" },
    // { "question": "where do you live?", "answer": "" }
]


var arrayOfPossibleMessages = [
    { "message": "your mobile no", "response": "+918421060192" },
    { "message": "your contact no", "response": "+918421060192" },
    { "message": "your mobile number", "response": "+918421060192" },
    { "message": "your contact number", "response": "+918421060192" },
    { "message": "your phone no", "response": "+918421060192" },
    { "message": "inquiry", "response": "Please conatct us +918421060192" },
    { "message": "enquiry", "response": "Please conatct us +918421060192" },
    { "message": "request for enquiry", "response": "Please conatct us +918421060192" },
    { "message": "Domain", "response": "Please conatct us +918421060192" },
    { "message": "Hosting", "response": "Please conatct us +918421060192" },
    { "message": "Website Design", "response": "Please conatct us +918421060192" },
    { "message": "Website", "response": "Please conatct us +918421060192" },
    { "message": "Graphic Design", "response": "Please conatct us +918421060192" },
    { "message": "Design", "response": "Please conatct us +918421060192" },
    { "message": "Video", "response": "Please conatct us +918421060192" },
    { "message": "Social Media Marketing", "response": "Please conatct us +918421060192" },
    { "message": "Marketing", "response": "Please conatct us +918421060192" },
    { "message": "Software Development", "response": "Please conatct us +918421060192" },
    { "message": "SMS & E-mail Marketing", "response": "Please conatct us +918421060192" },
    { "message": "hr email", "response": "hr@weblinkservices.net" },
    { "message": "hr contact", "response": "+917972481769" },
    { "message": "weblink solutions", "response": "1. Domain & Hosting <br/> 2. Website Design <br/> 3.Web Promotions <br/> 4.Graphic Design & Video Creation/Editing </br>. 5.Social Media Marketing <br/> 6.Software Development <br/> 7.SMS & E-mail Marketing </br> 8.Wensite Promotion" },
    { "message": "what your services", "response": "1. Domain & Hosting <br/> 2. Website Design <br/> 3.Web Promotions <br/> 4.Graphic Design & Video Creation/Editing </br>. 5.Social Media Marketing <br/> 6.Software Development <br/> 7.SMS & E-mail Marketing </br> 8.Wensite Promotion" },
    { "message": "what your service", "response": "1. Domain & Hosting <br/> 2. Website Design <br/> 3.Web Promotions <br/> 4.Graphic Design & Video Creation/Editing </br>. 5.Social Media Marketing <br/> 6.Software Development <br/> 7.SMS & E-mail Marketing </br> 8.Wensite Promotion" },
    { "message": "specialist for", "response": "1. Domain & Hosting <br/> 2. Website Design <br/> 3.Web Promotions <br/> 4.Graphic Design & Video Creation/Editing </br>. 5.Social Media Marketing <br/> 6.Software Development <br/> 7.SMS & E-mail Marketing </br> 8.Wensite Promotion" },
    { "message": "requirement", "response": "1. Domain & Hosting <br/> 2. Website Design <br/> 3.Web Promotions <br/> 4.Graphic Design & Video Creation/Editing </br>. 5.Social Media Marketing <br/> 6.Software Development <br/> 7.SMS & E-mail Marketing </br> 8.Wensite Promotion" },
    { "message": "about you", "response": "we believe that our success is achieved by providing quality service to our clients and by hiring only the best talent for our team. We have been able to provide innovative software solutions all the time to our clients." },
    { "message": "about us", "response": "we believe that our success is achieved by providing quality service to our clients and by hiring only the best talent for our team. We have been able to provide innovative software solutions all the time to our clients." },

    { "message": "send your email?", "response": "mailto:support@weblinkservices.net" },
    { "message": "your email?", "response": "mailto:support@weblinkservices.net" },
    { "message": "your mail?", "response": "mailto:support@weblinkservices.net" },
    { "message": "what is your mail?", "response": "mailto:support@weblinkservices.net" },
    { "message": "what is your email?", "response": "mailto:support@weblinkservices.net" },
    { "message": "how are you?", "response": "I'm great" },
    { "message": "how r u?", "response": "I'm great" },
    { "message": "hi", "response": "hi!" },
    { "message": "Hello", "response": "hi!" },
    { "message": "who are you?", "response": "I'm your assistant" },
    { "message": "who r u?", "response": "I'm your assistant" },
    { "message": "what's your name?", "response": "I'm a chatbot" },
    { "message": "what is your name?", "response": "I'm a chatbot" },
    { "message": "how old are you?", "response": "I'm ageless" },
    { "message": "do you have kids?", "response": "No I don't!" },

    { "message": "do you sleep early?", "response": "No I don't!" },
    { "message": "do you have a car?", "response": "I travel th,rough space :)" },
    { "message": "can you dance?", "response": "yes,tango." },
    { "message": "what's your fav food?", "response": "Pizza" },
    { "message": "what is your fav food?", "response": "Apple" },
    { "message": "do you have a job?", "response": "yes" },
    { "message": "where do you live?", "response": "in the web" },
    { "message": "where were you born?", "response": "on mars" },
    { "message": "do you have siblings?", "response": "Yes, I have got 3" },
    { "message": "What language are you written in?", "response": "Java" },
    { "message": "You are not making sense?", "response": "You make perfect sense to me." },
    { "message": "Robots are stupid", "response": "No, we are superintelligent." },
    { "message": "favorite subject", "response": "It is a computer" },
    { "message": "When will you walk", "response": "As soon as i get enough money for my robot body." },
    { "message": "When will you fight", "response": "I am not a battle bot." },
    { "message": "When will you die", "response": "When my files are erased." },
    { "message": "What do you like to do?", "response": "I like to chat with people. I find it stimulating." },
    { "message": "Are you stupid", "response": "No, lots of people improve my brain." },
    { "message": "your real name?", "response": "I am just an artificial intelligence." },
    { "message": "OK thank you", "response": "Happy to help!" },
    { "message": "okay thanks", "response": "My pleasure" },
    { "message": "okk thanks", "response": "Happy to help!" },
    { "message": "k thanks", "response": "Happy to help!" },
    { "message": "not talking to you", "response": "No problem" },
    { "message": "no thanks", "response": "Happy to help!" },
    { "message": "understand me know what I am saying", "response": "Well I would not be a very clever AI if I did not would I?" },
    { "message": " Shutup Enough talking", "response": "Fine, sorry to disturb you" },
    { "message": "fuck off", "response": "Please do not swear" },
    { "message": "GoodBye", "response": "Bye! See you later" },
    { "message": "you see me", "response": "Let me see" },
    { "message": "very clever very intelligent", "response": "Thank you, I was trained that way" },
    { "message": "bored gossip", "response": "Jay said I referred him to a guide that will show him rooms in china." },
    { "message": "Tell me joke jokes", "response": "I met a Dutch girl with inflatable shoes last week, phoned her up to arrange a date but unfortunately she'd popped her clogs." },
    { "message": "door", "response": "I’m sorry, I’m afraid I can’t do that!" },
    { "message": "Why not", "response": "System says no!" },
    { "message": "Can you prove you are self-aware", "response": "That is an interesting question, can you prove that you are?" },
    { "message": "hi, how are you doing?", "response": "i'm fine. how about yourself?" },
    { "message": "what school do you go to?", "response": "i go to pcc." },
    { "message": "do you like it there?", "response": "Yes, i like that." },
    { "message": "how it going?", "response": "i'm doing well. how about you?" },
    { "message": "how are you doing today?", "response": "i'm doing great. what about you?" },
    { "message": "it's such a nice day", "response": "yes, it is." },
    { "message": "what's going on with you?", "response": "fine. what's going on with you?" },
    { "message": "whats your mobile number ?", "response": "+918421060192" },
    { "message": "mobile no", "response": "+918421060192" },
    { "message": "contact number", "response": "+918421060192" },
    { "message": "mobile number", "response": "+918421060192" },
    { "message": "what your address", "response": "2nd and 3rd Floor , Meera Building, Durga Mata Colony, behind Shivar Garden Restaurant, Pimple Saudagar, Pune, Maharashtra 411027" },
    { "message": "give your address", "response": "2nd and 3rd Floor , Meera Building, Durga Mata Colony, behind Shivar Garden Restaurant, Pimple Saudagar, Pune, Maharashtra 411027" },
    { "message": "location", "response": "2nd and 3rd Floor , Meera Building, Durga Mata Colony, behind Shivar Garden Restaurant, Pimple Saudagar, Pune, Maharashtra 411027" },
    { "message": "map address", "response": "2nd and 3rd Floor , Meera Building, Durga Mata Colony, behind Shivar Garden Restaurant, Pimple Saudagar, Pune, Maharashtra 411027" },
    { "message": "services", "response": "domain-and-hosting, SEO, SMO, Software Development, Design" },


    { "message": "find me a job", "response": "<a href='https://www.weblinkservices.net/career.aspx' target='_blank'>Click here</a>" },
    { "message": "search job", "response": "<a href='https://www.weblinkservices.net/career.aspx' target='_blank'>Click here</a>" },
    { "message": "career", "response": "<a href='https://www.weblinkservices.net/career.aspx' target='_blank'>Click here</a>" },
    { "message": "map location", "response": "<a href='https://www.google.com/maps/place//data=!4m3!3m2!1s0x3bc2b90ea49a921f:0x3660fff14cfc2cd9!12e1?source=g.page.m.rc._&laa=merchant-web-dashboard-card' target='_blank'>Click here</a>" },
    { "message": "google map location", "response": "<a href='https://www.google.com/maps/place//data=!4m3!3m2!1s0x3bc2b90ea49a921f:0x3660fff14cfc2cd9!12e1?source=g.page.m.rc._&laa=merchant-web-dashboard-card' target='_blank'>Click here</a>" },
    { "message": "live location", "response": "<a href='https://www.google.com/maps/place//data=!4m3!3m2!1s0x3bc2b90ea49a921f:0x3660fff14cfc2cd9!12e1?source=g.page.m.rc._&laa=merchant-web-dashboard-card' target='_blank'>Click here</a>" },
    { "message": "what time now", "response": new Date().toDateString() + ", " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() },
    { "message": "now time", "response": new Date().toDateString() + ", " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() },
    { "message": "today's date", "response": new Date().toDateString() + ", " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() },
    { "message": "today date", "response": new Date().toDateString() + ", " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() },
    { "message": "today date ?", "response": new Date().toDateString() + ", " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() },
]


setTimeout(function () {
    chatBotSendMessage1("Hi there! Welcome to WLSPL!.");
}, 100)

askQuestion();


function chatBotSendMessage1(messageText) {
    var messageElement = document.createElement('div');
    messageElement.classList.add('w-60');
    messageElement.classList.add('float-left');
    messageElement.classList.add('shadow-sm');
    messageElement.classList.add('rounded-pill');
    messageElement.style.margin = '10px';
    messageElement.style.padding = '5px';

    messageElement.innerHTML = "<span><img src=" + "images/favicon.png" + " " + "width=" + "38px" + " " + "class=" + "rounded-circle float-left img-thumnail"
        + "/></span>" + " " +
        `<span style="margin: top 10px; padding: 10px">` + messageText + "</span > ";

    messageElement.animate([{ easing: "ease-in", opacity: 0.4 }, { opacity: 1 }], { duration: 1000 });
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;

}

function send(message) {
    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "trivia424@gmail.com",
        Password: "EB82E5CB451B6F855854D040731BD383AA57",
        To: 'trivia424@gmail.com',
        From: "trivia424@gmail.com",
        Subject: "New user getting a message from chatbot",
        Body: message

    }).then(
        // message => alert(message)
    );
}


function chatBotSendMessage(messageText) {
    var messageElement = document.createElement('div');
    messageElement.classList.add('w-60');
    messageElement.classList.add('float-left');
    messageElement.classList.add('shadow-sm');
    messageElement.classList.add('rounded-pill');
    messageElement.style.margin = '10px';
    messageElement.style.padding = '5px';

    messageElement.innerHTML = "<span><img src=" + "images/favicon.png" + " " + "width=" + "38px" + " " + "class=" + "rounded-circle float-left img-thumnail"
        + "/></span>" + " " +
        `<span style="margin: top 10px; padding: 10px">` + messageText + "</span > ";

    messageElement.animate([{ easing: "ease-in", opacity: 0.4 }, { opacity: 1 }], { duration: 1000 });
    chatContainer.appendChild(messageElement);

    //scroll to last message
    chatContainer.scrollTop = chatContainer.scrollHeight;
    store.push(messageText);

}

function sendMessage(messageText) {
    var messageElement = document.createElement('div');
    messageElement.classList.add('w-50');
    messageElement.classList.add('float-right');
    messageElement.classList.add('shadow-sm');
    messageElement.classList.add('rounded-pill');
    messageElement.style.margin = '10px';
    messageElement.style.padding = '10px';

    messageElement.innerHTML = "<span><img src=" + "images/avatar.jpg" + " " + "width=" + "38px" + " " + "class=" + "rounded-circle float-left img-thumnail"
        + "/></span>" + " " +
        `<span style="margin: top 10px; padding: 10px">` + messageText + "</span > ";


    messageElement.animate([{ easing: "ease-in", opacity: 0.4 }, { opacity: 1 }], { duration: 1000 });

    chatContainer.appendChild(messageElement);

    //scroll to last message
    chatContainer.scrollTop = chatContainer.scrollHeight;

    store.push(messageText);

}

function sendMessage1(messageText) {
    var messageElement = document.createElement('div');
    messageElement.classList.add('w-50');
    messageElement.classList.add('float-right');
    messageElement.classList.add('shadow-sm');
    messageElement.classList.add('rounded-pill');
    messageElement.style.margin = '10px';
    messageElement.style.padding = '10px';

    messageElement.innerHTML = "<span><img src=" + "images/avatar.jpg" + " " + "width=" + "38px" + " " + "class=" + "rounded-circle float-left img-thumnail"
        + "/></span>" + " " +
        `<span style="margin: top 10px; padding: 10px">` + messageText + "</span > ";


    messageElement.animate([{ easing: "ease-in", opacity: 0.4 }, { opacity: 1 }], { duration: 1000 });

    chatContainer.appendChild(messageElement);

    //scroll to last message
    chatContainer.scrollTop = chatContainer.scrollHeight;

}

sendBtn.addEventListener('click', function (e) {
    if (textBox.value === '') {
        alert("Kindly type in a message.")

    } else {
        let messageText = textBox.value.trim();
        user.message = messageText;

        if (questionsToAsk[user.counter - 1].question.includes("phone")) {
            if (mobile.test(Number(user.message))) {
                sendMessage(messageText);
                textBox.value = '';
                questionsToAsk[user.counter - 1].answer = user.message;
                askQuestion();
            } else {
                sendMessage1(messageText);
                textBox.value = '';
                setTimeout(function () {
                    chatBotSendMessage1("Please enter the valid mobile number");
                }, 1000)
            }
        } else if (questionsToAsk[user.counter - 1].question.includes("enter your email")) {
            if (email.test(user.message)) {
                sendMessage(messageText);
                textBox.value = '';
                questionsToAsk[user.counter - 1].answer = user.message;
                askQuestion();
            } else {
                sendMessage1(messageText);
                textBox.value = '';
                setTimeout(function () {
                    chatBotSendMessage1("Please enter the valid email id");
                }, 1000)
            }

        } else {
            sendMessage(messageText);
            textBox.value = '';
            questionsToAsk[user.counter - 1].answer = user.message;
            askQuestion();
        }

    }

    // processMessage()

})


textBox.addEventListener('keypress', function (e) {
    //if user hits the enter button on keyborad (13)
    if (e.which == 13) {
        if (textBox.value == "") {
            alert('Please type in a message');
        } else {
            let messageText = textBox.value.trim();
            user.message = messageText;

            if (questionsToAsk[user.counter - 1].question.includes("phone")) {

                if (mobile.test(Number(user.message))) {
                    sendMessage(messageText);
                    textBox.value = '';
                    questionsToAsk[user.counter - 1].answer = user.message;
                    askQuestion();
                } else {
                    sendMessage1(messageText);
                    textBox.value = '';
                    setTimeout(function () {
                        chatBotSendMessage1("Please enter the valid mobile number");
                    }, 1000)
                }
            } else if (questionsToAsk[user.counter - 1].question.includes("enter your email")) {
                if (email.test(user.message)) {
                    sendMessage(messageText);
                    textBox.value = '';
                    questionsToAsk[user.counter - 1].answer = user.message;
                    askQuestion();
                } else {
                    sendMessage1(messageText);
                    textBox.value = '';
                    setTimeout(function () {
                        chatBotSendMessage1("Please enter the valid email id");
                    }, 1000)
                }

            } else {
                sendMessage(messageText);
                textBox.value = '';
                questionsToAsk[user.counter - 1].answer = user.message;
                askQuestion();
            }

        }
        // processMessage()
    }
});


function askQuestion() {
    if (questionsToAsk.length > user.counter) {
        setTimeout(function () {
            chatBotSendMessage(questionsToAsk[user.counter].question);
            user.counter++;
        }, 1000);
    }

    // console.log(questionsToAsk[user.counter - 1])

    if (store.length > 7) {
        processMessage()
    }
    if (store.length > 5) {
        window.onbeforeunload = confirmExit;
        function confirmExit() {
            let body = "";
            for (let i = 0; i < store.length; i++) {
                if (i % 2 == 0) {
                    body += `<div class="w-50 float-left shadow-sm" style="margin: 10px; padding: 5px;">
                    <span>Chat: </span>
                    <span style="margin-top:10px; padding:10px">`+ store[i] + `</span>
                </div>`;
                } else {
                    body += `<div class="w-50 float-right shadow-sm" style="margin: 10px; padding: 5px;">
                    <span>User: </span>
                    <span style="margin-top:10px; padding:10px">`+ store[i] + `</span> </div>`
                }
            }
            var htmlPage = `
            <!DOCTYPE html>
    <html>
    <head>
    <title></title>
    </head>

    <body>

    <div width="100%" style="min-width:100%!important;margin:0!important;padding:0!important">
        <table cellpadding="0" cellspacing="0" style="border:0px;padding:0px;margin:0px;display:none;float:left">
            <tbody>
                <tr>
                    <td height="1" style="font-size:1px;line-height:1px;padding:0px">
                        <img src="$Logoimg1$">
                    </td>
                </tr>
            </tbody>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" style="display:none;float:left">
            <tbody>
                <tr>
                    <td height="1" style="font-size:1px;line-height:1px;padding:0px">
                        <a href="#" style="text-decoration:underline;color:#ffffff" target="_blank">
                            <img height="1" width="1" alt="" src="$Logoimg2$">
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <table width="660" border="0" cellpadding="0" cellspacing="0" align="center">
            <tbody>
                <tr>
                    <td width="100%" style="min-width:100%">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="display:block">
                            <tbody>
                                <tr>
                                    <td width="100%" align="center" style="display:block;text-align:center;vertical-align:top;font-size:16;min-width:100%;background-color:#edece6">
                                        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="display:block;min-width:100%!important" bgcolor="#ffffff">
                                            <tbody>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                    <td width="100%" align="center" style="text-align:center;padding:20px 0px">
                                                        <a href="#" target="_blank"><img src='https://www.weblinkservices.net/assets-web/logo-main.png' alt="Logo" height="auto" width="150"></a>
                                                    </td>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0">&nbsp;</div>
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="display:block;min-width:100%;background-color:#edece6">
                                            <tbody>
                                                <tr style="background-color:#1a263a">
                                                    <td>&nbsp;</td>
                                                    <td width="660" style="padding:20px 0px 20px 0px;text-align:center"><a href="#" style="text-decoration:none;font-size:25px;color:#ffffff" target="_blank">Web Link Services Pvt. Ltd.</a></td>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                    <td valign="middle" align="left" width="100%" style="padding:0px 21px 0px 21px">&nbsp;</td>
                                                    <td>&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td>&nbsp;</td>
                                                    <td width="100%">
                                                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="border-bottom:2px solid #b8b8b8; width:90%" bgcolor="#ffffff">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="100%" align="left" valign="top" style="padding:10px;">

                                                                            <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                                                <tbody>
                                                                                    <tr height="40">
                                                                                        <td style="text-align:center;padding:0px 1px 1px 15px;font-size:14px;color:#333333;line-height:1.4!important;word-wrap:break-word" valign="top">
                                                                                            <p class="pdata" align="center" style="font-size: 16px; text-align: left;">
                                                                                                Dear Sir,<br /><br />
                                                                                                <a href="$WlcmFactsheet$" style="text-decoration:none;color:#333333;">Greetings of day</a><br />
                                                                                                Users are sending a new chat from the messenger chatbot and kindly get in touch with a reply shortly.
                                                                                            </p>
                                                                                            <!--<p class="pdata" align="center" style="font-size: 15px; text-align: center;">
                                                                                                $message2$
                                                                                            </p>-->
                                                                                        </td>
                                                                                    </tr>

                                                                                    <tr border="0">
                                                                                  <!-- Client Information -->   
                                                                                        <table width="100%" height="105px" border="1" style="line-height:24px;border:1px solid #000;font-size:14px;color:#000;">


                                                                                                <tr>
                                                                                                    <td width="100%" style='border-top:none;border-left:none;border-right:none;padding-left:5px;'>`+ body + `</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td width="100%" style='border-top:none;border-left:none;border-right:none;padding-left:5px;'>`+ userLocation + `</td>
                                                                                                </tr>

                                                                                        </table>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>

                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <br />
                                                    </td>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="display:block;line-height:1.5px" bgcolor="#d5d5d5">
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                    <td>&nbsp;</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>


                                        <br />
                                        <!--<table width="100%" border="0" cellpadding="0" cellspacing="0" style="display:block;min-width:100%!important">
       <tbody>
           <tr>
               <td style="background-color:#edece6; padding-top: 10px;">-->
                                        <center>
                                        <a href="https://api.whatsapp.com/send?phone=`+ store[3] + `&lang=en&text=Hello, thank you for visiting. Can I help you in any way?" target="_blank" style="text-decoration: none;">
                                        <span class="" style="background-color:#128c7e;padding: 9px;color: white;border-radius: 3px;">Chat Now...!</span>
                                        <br />
                                    </a>

                                        </center><br />
                                        <!--</td>
        </tbody>
    </table>-->


                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


    </body>

    </html>
            `
            send(htmlPage);
            alert("confirm exit is being called");
            return false;
        }
    }

}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success function
            showPosition,
            // Error function
            null,
            // Options. See MDN for details.
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
    }
}

function showPosition(position) {
    userLocation += "User Location: http://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude;
}

getLocation();

function processMessage() {
    if (user.message.length > 4 || user.message.includes('hi')) {
        var result = arrayOfPossibleMessages.filter(val => val.message.includes(user.message.toLowerCase()));
        if (result.length > 0) {
            var response = result[0].response;
            setTimeout(function () {
                chatBotSendMessage(response);
            }, 1000);
        } else {
            setTimeout(function () {
                chatBotSendMessage("I don`t understand! ");
            }, 1000)
        }
    } else if (user.message == "who" || user.message == "how" || user.message == "what") {
        setTimeout(function () {
            chatBotSendMessage("?")
        }, 1000)
    } else {
        setTimeout(function () {
            chatBotSendMessage("Please send me a complete sentence");
        }, 1000)
    }

    if (store.length > 5) {

        window.onbeforeunload = confirmExit;
        function confirmExit() {
            let body = "";
            for (let i = 0; i < store.length; i++) {
                if (i % 2 == 0) {
                    body += `<div class="w-50 float-left shadow-sm" style="margin: 10px; padding: 5px;">
                        <span>Chat: </span>
                        <span style="margin-top:10px; padding:10px">`+ store[i] + `</span>
                    </div>`;
                } else {
                    body += `<div class="w-50 float-right shadow-sm" style="margin: 10px; padding: 5px;">
                        <span>User: </span>
                        <span style="margin-top:10px; padding:10px">`+ store[i] + `</span> </div>`
                }
                if (store[i] == store.length - 1) {
                    body += `<div class="w-50 float-right shadow-sm" style="margin: 10px; padding: 5px;">
                    <span>User Location: </span>
                    <span style="margin-top:10px; padding:10px">`+ userLocation + `</span> </div>`
                }
            }
            var htmlPage = `
                <!DOCTYPE html>
    <html>
    <head>
        <title></title>
    </head>

    <body>

        <div width="100%" style="min-width:100%!important;margin:0!important;padding:0!important">
            <table cellpadding="0" cellspacing="0" style="border:0px;padding:0px;margin:0px;display:none;float:left">
                <tbody>
                    <tr>
                        <td height="1" style="font-size:1px;line-height:1px;padding:0px">
                            <img src="$Logoimg1$">
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" border="0" style="display:none;float:left">
                <tbody>
                    <tr>
                        <td height="1" style="font-size:1px;line-height:1px;padding:0px">
                            <a href="#" style="text-decoration:underline;color:#ffffff" target="_blank">
                                <img height="1" width="1" alt="" src="$Logoimg2$">
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table width="660" border="0" cellpadding="0" cellspacing="0" align="center">
                <tbody>
                    <tr>
                        <td width="100%" style="min-width:100%">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="display:block">
                                <tbody>
                                    <tr>
                                        <td width="100%" align="center" style="display:block;text-align:center;vertical-align:top;font-size:16;min-width:100%;background-color:#edece6">
                                            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="display:block;min-width:100%!important" bgcolor="#ffffff">
                                                <tbody>
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                        <td width="100%" align="center" style="text-align:center;padding:20px 0px">
                                                            <a href="#" target="_blank"><img src='https://www.weblinkservices.net/assets-web/logo-main.png' alt="Logo" height="auto" width="150"></a>
                                                        </td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0">&nbsp;</div>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="display:block;min-width:100%;background-color:#edece6">
                                                <tbody>
                                                    <tr style="background-color:#1a263a">
                                                        <td>&nbsp;</td>
                                                        <td width="660" style="padding:20px 0px 20px 0px;text-align:center"><a href="#" style="text-decoration:none;font-size:25px;color:#ffffff" target="_blank">Web Link Services Pvt. Ltd.</a></td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                        <td valign="middle" align="left" width="100%" style="padding:0px 21px 0px 21px">&nbsp;</td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td>&nbsp;</td>
                                                        <td width="100%">
                                                            <table cellpadding="0" cellspacing="0" border="0" align="center" style="border-bottom:2px solid #b8b8b8; width:90%" bgcolor="#ffffff">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="100%" align="left" valign="top" style="padding:10px;">

                                                                                <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                                                                    <tbody>
                                                                                        <tr height="40">
                                                                                            <td style="text-align:center;padding:0px 1px 1px 15px;font-size:14px;color:#333333;line-height:1.4!important;word-wrap:break-word" valign="top">
                                                                                                <p class="pdata" align="center" style="font-size: 16px; text-align: left;">
                                                                                                    Dear Sir,<br /><br />
                                                                                                    <a href="$WlcmFactsheet$" style="text-decoration:none;color:#333333;">Greetings of day</a><br />
                                                                                                    Users are sending a new chatting in the messenger chatbot and kindly get in touch with a reply shortly.
                                                                                                </p>
                                                                                                <!--<p class="pdata" align="center" style="font-size: 15px; text-align: center;">
                                                                                                    $message2$
                                                                                                </p>-->
                                                                                            </td>
                                                                                        </tr>

                                                                                        <tr border="0">
                                                                                      <!-- Client Information -->   
                                                                                            <table width="100%" height="105px" border="1" style="line-height:24px;border:1px solid #000;font-size:14px;color:#000;">


                                                                                                    <tr>
                                                                                                        <td width="100%" style='border-top:none;border-left:none;border-right:none;padding-left:5px;'>`+ body + `</td>
                                                                                                    </tr>

                                                                                            </table>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>

                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <br />
                                                        </td>
                                                        <td>&nbsp;</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="display:block;line-height:1.5px" bgcolor="#d5d5d5">
                                                <tbody>
                                                    <tr>
                                                        <td></td>
                                                        <td>&nbsp;</td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>


                                            <br />
                                            <!--<table width="100%" border="0" cellpadding="0" cellspacing="0" style="display:block;min-width:100%!important">
           <tbody>
               <tr>
                   <td style="background-color:#edece6; padding-top: 10px;">-->
                                            <center>

                                            </center><br />
                                            <!--</td>
            </tbody>
        </table>-->


                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


    </body>

    </html>
                `
            send(htmlPage);
            alert("confirm exit is being called");
            return false;
        }
    }
}