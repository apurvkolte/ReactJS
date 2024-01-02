
//elements
var sendBtn = document.getElementById('sendBtn');
var textBox = document.getElementById("textbox");
var chatContainer = document.getElementById("chatContainer");
var ticket = new Date().getTime();  //used for unique no for whcih user order request
var user = { message: "", counter: 0, meals: [], ticket };
var store = [];


let options = [
    {},
    { number: 1, choice: "Dal Makhani &nbsp;", price: 250, img: "images/meal1.jpg" },
    { number: 2, choice: "Veg Curry &nbsp; &nbsp;&nbsp;  ", price: 210, img: "images/meal2.jpg" },
    { number: 3, choice: "Kadai Paneer ", price: 180, img: "images/meal3.jpg" },
];


function initializeOptions() {

    var messageElement = document.createElement('div');
    messageElement.classList.add('w-60');
    messageElement.classList.add('float-left');
    messageElement.classList.add('shadow-sm');
    messageElement.style.margin = '10px';
    messageElement.style.padding = '5px';
    messageElement.innerHTML = "<span><img src=" + "images/favicon.png" + " " + "width=" + "38px" + " " + "class=" + "rounded-circle float-left img-thumnail"
        + "/></span>" + " " + "Please choose an option:"

    for (let i = 1; i < options.length; i++) {
        messageElement.innerHTML += `<br/> <span style="margin: top 10px; padding: 35px">` + options[i].number + " " + options[i].choice + "</span > ";
    }

    messageElement.animate([{ easing: "ease-in", opacity: 0.4 }, { opacity: 1 }], { duration: 1000 });
    chatContainer.appendChild(messageElement);

    //scroll to last message
    chatContainer.scrollTop = chatContainer.scrollHeight;

}
function handleWeatherResponse() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let response = JSON.parse(httpRequest.responseText);

            let city = response.location.name;
            let temp = response.current.temperature;
            let hum = response.current.humidity;
            let icon = response.current.weather_icons[0];

            let messageToSend = "<br/>";
            messageToSend += "<span><img src='" + icon + "'></span>"
            messageToSend += "<br/>";
            messageToSend += "City: " + city;
            messageToSend += "<br/>";
            messageToSend += "Temperature: " + temp + " °C";
            messageToSend += "<br/>";
            messageToSend += "Humidity: " + hum;
            messageToSend += "<br/>";

            chatBotSendMessage(messageToSend);
            // initializeOptions();
            // showMenu()
            chatBotSendMessage("Are you buy meals? if yes choose meal above number.");

        } else {
            alert("There was an unexpected error.");
        }
    }

}

function getWhetherRequest(lat, long) {
    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = handleWeatherResponse
    httpRequest.open('GET', "http://api.weatherstack.com/current?access_key=291b4ae7335f8fb9260a6ee72305e575&query=" + parseInt(lat) + "," + parseInt(long));
    httpRequest.send()
}

function getLocationAndWhether() {
    navigator.geolocation.getCurrentPosition((pos) => {
        let lat = pos.coords.latitude;
        let long = pos.coords.longitude;

        getWhetherRequest(lat, long);
    },
        (err) => {
            console.log(err);
        }
    )
}

function assistantResponse(messageText) {

    let userChoise = parseInt(messageText.trim());

    chatBotSendMessage("Please wait...!");


    switch (userChoise) {
        case 1:
            //get whether
            getLocationAndWhether();
            break;
        case 2:
            //get sports
            window.open("https://www.google.com/search?q=sports");
            initializeOptions();

            break;
        case 3:
            //get news
            window.open("https://www.google.com/search?q=news");
            initializeOptions();

            break;
        default:
            chatBotSendMessage("Please choose a  valid number");
            break;
    }
}


showMenu()
function showMenu() {
    chatBotSendMessage("Welcome to ... Restaurant");

    var messageElement = document.createElement('div');
    messageElement.classList.add('w-60');
    messageElement.classList.add('float-left');
    messageElement.classList.add('shadow-sm');
    messageElement.style.margin = '10px';
    messageElement.style.padding = '5px';
    messageElement.innerHTML = "<span><img src=" + "images/favicon.png" + " " + "width=" + "38px" + " " + "class=" + "rounded-circle float-left img-thumnail"
        + "/></span>" + " " + "Please choose your meal: (number)"

    for (let i = 1; i < options.length; i++) {
        messageElement.innerHTML += "<br>" +
            "<span style=" + "margin-top:10px; padding:10px" + ">" + options[i].number + " - " + options[i].choice + "- ₹" +
            options[i].price + "</span>"
            + "<img style='width:100px; margin-left:20px' src=" + options[i].img + ">";

    }

    messageElement.animate([{ easing: "ease-in", opacity: 0.4 }, { opacity: 1 }], { duration: 1000 });
    chatContainer.appendChild(messageElement);

    //scroll to last message
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


function getTotalPrice() {
    let totalPrice = 0;

    for (let i = 0; i < user.meals.length; i++) {

        totalPrice += user.meals[i].price;
    }

    return totalPrice;
}

function send() {

    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "trivia424@gmail.com",
        Password: "5798030052C0638A62F27C2E62B796CAD51A",
        To: 'trivia424@gmail.com',
        From: "trivia424@gmail.com",
        Subject: "This is the subject",
        Body: "And this is the body"

    }).then(
        // message => alert(message)
    );
}



function restaurantResponseToUser(messageText) {
    let userChoise = (messageText.trim());

    switch (userChoise) {
        case "0":
            getLocationAndWhether();
            break;

        case "1":
            chatBotSendMessage("You choose " + options[1].choice + " Rs:" + options[1].price + " <img style='width:100px; margin-left:20px' src=" + options[1].img + ">");
            user.meals.push(options[1]);
            chatBotSendMessage("Are you buy more meals? if more choose meal number or type ( ok ) to checkout")
            break;

        case "2":
            chatBotSendMessage("You choose " + options[2].choice + " Rs:" + options[2].price + " <img style='width:100px; margin-left:20px' src=" + options[2].img + ">");
            user.meals.push(options[2]);
            chatBotSendMessage("Are you buy more meals? if more choose meal number or type ( ok ) to checkout")
            break;

        case "3":
            chatBotSendMessage("You choose " + options[3].choice + " Rs:" + options[3].price + " <img style='width:100px; margin-left:20px' src=" + options[3].img + ">");
            user.meals.push(options[3]);
            chatBotSendMessage("Are you buy more meals? if more choose meal number or type ( ok ) to checkout")
            break;

        case "ok":
            chatBotSendMessage("Total Price: ₹" + getTotalPrice());
            chatBotSendMessage("Please click this link to complete checkout:");
            chatBotSendMessage("<a href='https://google.com' target='_blank'>Checkout</a>");
            break;

        default:
            chatBotSendMessage("Please choose a valid number");
            break;
    }
}



//hotel
// showMenu()
// initializeOptions();

//option whather

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

sendBtn.addEventListener('click', function (e) {
    if (textBox.value === '') {
        alert("Kindly type in a message.")

    } else {
        let messageText = textBox.value.trim();
        user.message = messageText;
        sendMessage(messageText);
        textBox.value = '';

        restaurantResponseToUser(messageText);

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
            sendMessage(messageText);
            textBox.value = "";

            restaurantResponseToUser(messageText);

        }
        // processMessage()
    }
});

