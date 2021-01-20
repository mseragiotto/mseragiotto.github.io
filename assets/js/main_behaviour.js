$(document).ready(() => {
  prepareToConnect();
});

function prepareToConnect() {
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
  console.log(`connection is opened.\n`);
  socket.registerRequests(apiRequestTypes);
  console.log(`registrata la richiesta.\n`);
  const me = myId(jwt);
  console.log('me = '+me+'\n');
  
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
    	console.log('Ho cliccato');
      if (Object.keys(openConvs)[0]) {
      	console.log('Avvio conversazione');
        publishTo(socket,Object.keys(openConvs)[0]);
      } else  {
      	console.log('Continuo conversazione');
        socket.consumerRequestConversation()
          .then(resp => publishTo(socket,resp.body.conversationId));
      }
      $('#close').show();
    });
    $('#close').click(() => {
      if (Object.keys(openConvs)[0]) {
      	console.log('Chiudo conversazione');
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
  /*$('#send').prop('disabled', true).unbind('click');
  $('#account').prop('disabled',false).val();      */  
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

const apiRequestTypes = ['cqm.SubscribeExConversations','ms.PublishEvent','cm.ConsumerRequestConversation','ms.SubscribeMessagingEvents','InitConnection','cm.UpdateConversationField'];

