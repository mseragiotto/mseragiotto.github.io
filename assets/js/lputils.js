class LPUtils {
  
  /*Get domain for account*/
  static getDomain(account, name) {
    const domains = "adminlogin.liveperson.net";
    return new Promise((res, rej) => $.ajax({
      url: `https://${domains}/csdr/account/${account}/service/${name}/baseURI.lpCsds?version=1.0`,
      jsonp: "cb",
      jsonpCallback: "domainCallback",
      cache: true,
      dataType: "jsonp",
      success: data => res(data.ResultSet.lpData[0].lpServer),
      error: (e, text) => rej(text) }));
  }

  static agentProfile(account, agentID) {
    return new Promise((res, rej) => this.getDomain(account, "acCdnDomain").then(accdnDomain => $.ajax({
      url: `https://${accdnDomain}/api/account/${account}/configuration/le-users/users/${agentID}`,
      jsonp: "cb",
      jsonpCallback: "apCallback",
      cache: true,
      dataType: "jsonp",
      success: accdnResp => res(accdnResp) })));

  }

  /*UnAuthenticate signup on Agent Account, for estabilish a simple messaging conversation*/
  static signup(account) {
    return new Promise((res, rej) => this.getDomain(account, "idp").then(idpDomain => $.ajax({
      url: `https://${idpDomain}/api/account/${account}/signup.jsonp`,
      jsonp: "callback",
      dataType: "jsonp",
      success: idpResp => res(idpResp.jwt) })));

  }
  /*Autenticate signup on Agent Account, for estabilish a messaging conversation with known user John Doe*/
  static auth_signup(account) {
    const jwt = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NvbWV0aGluZy5pdCIsInN1YiI6ImhnaHZiam5pIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiSm9obkRvZSIsInBob25lX251bWJlciI6IisxLTEwLTM0NC0zNzY1MzMzIiwiZ2l2ZW5fbmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IlRlc3QyIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJnZW5kZXIiOiJNYWxlIiwibHBfc2RlcyI6W3sidHlwZSI6ImN0bXJpbmZvIiwiaW5mbyI6eyJjc3RhdHVzIjoiY2FuY2VsbGVkIiwiY3R5cGUiOiJ2aXAiLCJjdXN0b21lcklkIjoiYWJjMTIzNDU2IiwiYmFsYW5jZSI6Ii00MDAuOTkiLCJzb2NpYWxJZCI6IjM0NTY3ODc2NTQiLCJpbWVpIjoiOTk5NjYzMjEiLCJ1c2VyTmFtZSI6InVzZXIwMDAiLCJjb21wYW55U2l6ZSI6IjUwMCIsImFjY291bnROYW1lIjoiYmFuayBjb3JwIiwicm9sZSI6ImJyb2tlciIsImxhc3RQYXltZW50RGF0ZSI6eyJkYXkiOiIxNSIsIm1vbnRoIjoiMTAiLCJ5ZWFyIjoiMjAxNCJ9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6IjIzIiwibW9udGgiOiI1IiwieWVhciI6IjIwMTMifX19LHsidHlwZSI6InBlcnNvbmFsIiwicGVyc29uYWwiOnsiZmlyc3RuYW1lIjoiSm9obiIsImxhc3RuYW1lIjoiRG9lIiwiYWdlIjp7ImFnZSI6IjM0IiwieWVhciI6IjE5ODAiLCJtb250aCI6IjQiLCJkYXkiOiIxNSJ9LCJjb250YWN0cyI6W3siZW1haWwiOiJteW5hbWVAZXhhbXBsZS5jb20iLCJwaG9uZSI6IjM5MzQyNTkyOTAxNSJ9XSwiZ2VuZGVyIjoiTUFMRSIsImNvbXBhbnkiOiJMaXZlUGVyc29uIn19XSwiaWF0IjoxNjEwMzYzNTc5LCJleHAiOjE2MTA5NjM1Nzl9.UjUSG7aAvq-OqqR9L_iMsWh00NBjmTndOxdI5Y_aANeHBnbODBl-KBBy6sq5YjxgFFC1ABl3IEojbs-2p0TZAvmf851CLHTkUWnGxsW6sqK8Qx3wq1rB1tGVvW-BqiiBo2c0ghB4r_lcx-2PBZD8eH8GV__k_D2rPEjIYNBy0nYQtOvCgzE7l2hbC8_zB45dx5gckaGxle46g0HYkWqjEhw2ngZIVmLtGQLbxqBF7ipm9RlXRq28yZgW2IFytsPulqi5ZeOZYPhHtRE-J4eawu3JEo0hzVi_VbvukMSRO62YOvi1enbtQZbIh1ObtEZTh-qEplxP7WDVS9owsq4NHQ";
    return new Promise((res, rej) => this.getDomain(account, "idp").then(idpDomain => $.ajax({
      type: "POST",
      url: `https://${idpDomain}/api/account/${account}/authenticate`,
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({authCode : jwt}),
      success: idpResp => res(idpResp.jwt) })));
  }

  // fetch jwt from localstorage or create one (authenticate or unauthenticate, based on previous function used)
  static getJWT(account) {
    const localJWT = localStorage.getItem(`${account}-jwt`);
    if (localJWT)
      return Promise.resolve(localJWT);
    else
      return this.signup(account).then(newJWT => {
        localStorage.setItem(`${account}-jwt`, newJWT);
        return Promise.resolve(newJWT);
      });
  }

  static clearJWT(account) {
    localStorage.removeItem(`${account}-jwt`);
  }}


class LPWs {
  static connect(url) {
    return new LPWs(url)._connect();
  }

  static connectDebug(url) {
    return new LPWs(url, true)._connect();
  }

  constructor(url, debug) {
    this.reqs = {};
    this.subs = [];
    this.url = url;
    this.debug = debug; 
  }

  _connect() {
    return new Promise((resolve, reject) => {
      let ws = new WebSocket(this.url);
      this.ws = ws;
      ws.onopen = () => resolve(this);
      ws.onmessage = msg => this.onmessage(msg);
      ws.onclose = evt => {
        this.ws = null;
        reject(evt);
      };
    });
  }

  request(type, body, headers) {
    return new Promise((resolve, reject) => {
      var obj = {
        "kind": "req",
        "type": type,
        "body": body || {},
        "id": Math.floor(Math.random() * 1e9),
        "headers": headers };

      this.reqs[obj.id] = (type, code, body) => resolve({
        type: type,
        code: code,
        body: body });

      var str = JSON.stringify(obj);
      console.log("Invio messaggio: \n" + str);
      this.ws.send(str);
    });
  }

  onNotification(filterFunc, onNotification) {
    this.subs.push({
      filter: filterFunc,
      cb: onNotification });

  }

  toFuncName(reqType) {
    var str = reqType.substr(1 + reqType.lastIndexOf('.'));
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  registerRequests(arr) {
    arr.forEach(reqType => this[this.toFuncName(reqType)] = (body, headers) => this.request(reqType, body, headers));
  }

  onmessage(msg) {
    if (this.debug) console.log("recieved: " + msg.data);
    var obj = JSON.parse(msg.data);
    if (obj.kind == "resp") {
      var id = obj.reqId;
      delete obj.reqId;
      delete obj.kind;
      this.reqs[id].call(this, obj.type, obj.code, obj.body);
      delete this.reqs[id];
    } else if (obj.kind == "notification") {
      this.subs.forEach(function (sub) {
        if (sub.filter.call(this, obj)) {
          sub.cb.call(this, obj.body);
        };
      });
    }
  }}
