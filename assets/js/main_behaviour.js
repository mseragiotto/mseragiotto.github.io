$(document).ready(() => {
  prepareToConnect();
});

function prepareToConnect() {
    console.log('Preparing connection ...');
    const account = 37717971;
    LPUtils.getJWT(account).then(jwt => {
      LPUtils.getDomain(account, 'asyncMessagingEnt').then(umsDomain => {
        LPWs.connect(`wss://${umsDomain}/ws_api/account/${account}/messaging/consumer?v=3`)
        .then(
          openedSocket => handleOpenedSocket(openedSocket,jwt), 
          errorOpening => {
            console.log(`error opening connection ${errorOpening}\n`);
            prepareToConnect();
          });
      });
    }, errorGettingJwt => {      
      console.log(`error ${errorGettingJwt} getting jwt for account ${account}\n`);
    });
  };


function handleOpenedSocket(socket,jwt) {
  console.log('Open connection');
  socket.registerRequests(apiRequestTypes);
  const me = myId(jwt);
  console.log('Unauthenticate JWT -> \n'+jwt);
  console.log('JWT decoded -> \n'+parseJwt(jwt));

  socket.initConnection({},[{ "type": ".ams.headers.ConsumerAuthentication", "jwt": jwt}]);
  socket.onNotification(withType('MessagingEvent'),
    body => body.changes.forEach(change => {
      switch (change.event.type) {
        case 'ContentEvent':
          let date = new Date();
          let time = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" - "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
          $('#text_container').append(`
                      ${change.originatorId===me? 
                      '<br><div class="direct-chat-info clearfix">'+
                      	'<div class="direct-chat-name pull-right">YOU - '+time+'</div>'+
                      '</div><div class="direct-chat-text pull-right">':
                      '<br><div class="direct-chat-info clearfix">'+
                      	'<div class="direct-chat-name pull-left chat_left">AGENT - '+time+'</div>'+
                      '</div><div class="direct-chat-text pull-left chat_left">'} ${change.event.message}</div><br>`);
          $('#text_container').scrollTop( $('#text_container')[0].scrollHeight );
      }
    }));

  // subscribe to open conversations metadata
  socket.subscribeExConversations({
    'convState': ['OPEN']
  }).then(resp => {
    let openConvs = {};
    socket.onNotification(withSubscriptionID(resp.body.subscriptionId),
      (notificationBody) => handleConversationNotification(socket,notificationBody,openConvs));

    $('#send').click(() => {
      if (Object.keys(openConvs)[0]) {
        publishTo(socket,Object.keys(openConvs)[0]);
      } else  {
        socket.consumerRequestConversation()
          .then(resp => publishTo(socket,resp.body.conversationId));
      }
      $('#close').show();
    });
    $('#close').click(() => {
      if (Object.keys(openConvs)[0]) {
      	console.log('Conversation closed by user');
        socket.updateConversationField({
            conversationId: Object.keys(openConvs)[0],
            conversationField: [{
                    field: "ConversationStateField",
                    conversationState: "CLOSE"
                }]
        });
      }
      socket.ws.close();
      socket.ws.onclose = (evt) => onCloseSocket(socket,evt);
      $('#close').hide();
      $('#text_container').empty();
    });
  });
}

function handleConversationNotification(socket,notificationBody,openConvs) {
  notificationBody.changes.forEach(change => {
    if (change.type === 'UPSERT') {
      if (!openConvs[change.result.convId]) {
        openConvs[change.result.convId] = change.result;
        socket.subscribeMessagingEvents({
          fromSeq: 0,
          dialogId: change.result.convId
        });
      }
    } else if (change.type === 'DELETE') {
      delete openConvs[change.result.convId];
      console.log(`conversation was closed.\n`);
    }
  });
}

function onCloseSocket(socket,evt) {
  socket.ws = null;
  console.log(`connection was closed with code ${evt.code}\n`);
  prepareToConnect();
}

function publishTo(socket,convID) {
  socket.publishEvent({
    dialogId: convID,
    event: {
      type: 'ContentEvent',
      contentType: 'text/plain',
      message: $('#textline').val()
    }
  })
  .then(resp => $('#textline').val(''));
}

function withSubscriptionID(subscriptionID) {
  return notif => notif.body.subscriptionId === subscriptionID;
}

function withType(type) {
  return notif => notif.type.includes(type);
}

function myId(jwt) {
  return JSON.parse(atob(jwt.split('.')[1])).sub;
}

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.stringify(JSON.parse(jsonPayload));
}

const apiRequestTypes = ['cqm.SubscribeExConversations','ms.PublishEvent','cm.ConsumerRequestConversation','ms.SubscribeMessagingEvents','InitConnection','cm.UpdateConversationField'];

