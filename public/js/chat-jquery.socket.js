var params = new URLSearchParams(window.location.search);
var name = params.get('name');
var room = params.get('room');

// jquery refs
var usersDiv = $('#usersDiv');
var formSend = $('#formSend');
var txtMessage = $('#txtMessage');
var chatboxDiv = $('#chatboxDiv');

// render users methods
function renderUsers(users) {
    console.log(users);

    var html = '';
    html += '<li>';
    html += `    <a href="javascript:void(0)" class="active"><span>${room}</span> Chat</a>`;
    html += '</li>';

    for (let i = 0; i < users.length; i++) {
        html += '<li>';
        html += `    <a data-id="${users[i].id}" href="javascript:void(0)">`;
        html += '        <img src="assets/images/users/1.jpg" alt="user-img" class="img-circle">';
        html += `        <span>${users[i].name} <small class="text-success">online</small></span>`;
        html += '    </a>';
        html += '</li>';
    }

    usersDiv.html(html);
}

function renderMessages(message, me) {
    var html = '';
    var picture = '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user"/></div>';
    var date = new Date(message.date);
    var hour = date.getHours() + ':' + date.getMinutes();
    var adminClass = 'info';

    if (message.name === 'ADMIN') {
        adminClass = 'danger';
        picture = '';
    }

    if (me) {
        html += `
            <li class="reverse animated fadeIn">
                <div class="chat-content">
                    <h5>${message.name}</h5>
                    <div class="box bg-light-inverse">${message.message}</div>
                </div>
                <div class="chat-img">
                    <img src="assets/images/users/5.jpg" alt="user"/>
                </div>
                <div class="chat-time">${hour}</div>
            </li>
        `;
    } else {
        html += `
            <li class="animated fadeIn">
                ${picture}
                <div class="chat-content">
                    <h5>${message.name}</h5>
                    <div class="box bg-light-${adminClass}">${message.message}</div>
                </div>
                <div class="chat-time">${hour}</div>
            </li>
        `;
    }

    chatboxDiv.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = chatboxDiv.children('li:last-child');

    // heights
    var clientHeight = chatboxDiv.prop('clientHeight');
    var scrollTop = chatboxDiv.prop('scrollTop');
    var scrollHeight = chatboxDiv.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        chatboxDiv.scrollTop(scrollHeight);
    }
}

// listeners
usersDiv.on('click', 'a', function () {
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }
});

formSend.on('submit', function (e) {
    e.preventDefault();
    if (txtMessage.val().trim().length === 0) { return; }

    socket.emit('createMessage', {
        user: name,
        message: txtMessage.val()
    }, function (message) {
        txtMessage.val('').focus();
        renderMessages(message, true);
        scrollBottom();
    });
});