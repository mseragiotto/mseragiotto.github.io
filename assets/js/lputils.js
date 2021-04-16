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
/*
John Doe
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NvbWV0aGluZy5pdCIsInN1YiI6ImhnaHZiam5pIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiSm9obkRvZSIsInBob25lX251bWJlciI6IisxLTEwLTM0NC0zNzY1MzMzIiwiZ2l2ZW5fbmFtZSI6IlRlc3QiLCJmYW1pbHlfbmFtZSI6IlRlc3QyIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJnZW5kZXIiOiJNYWxlIiwibHBfc2RlcyI6W3sidHlwZSI6ImN0bXJpbmZvIiwiaW5mbyI6eyJjc3RhdHVzIjoiY2FuY2VsbGVkIiwiY3R5cGUiOiJ2aXAiLCJjdXN0b21lcklkIjoiYWJjMTIzNDU2IiwiYmFsYW5jZSI6Ii00MDAuOTkiLCJzb2NpYWxJZCI6IjM0NTY3ODc2NTQiLCJpbWVpIjoiOTk5NjYzMjEiLCJ1c2VyTmFtZSI6InVzZXIwMDAiLCJjb21wYW55U2l6ZSI6IjUwMCIsImFjY291bnROYW1lIjoiYmFuayBjb3JwIiwicm9sZSI6ImJyb2tlciIsImxhc3RQYXltZW50RGF0ZSI6eyJkYXkiOiIxNSIsIm1vbnRoIjoiMTAiLCJ5ZWFyIjoiMjAxNCJ9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6IjIzIiwibW9udGgiOiI1IiwieWVhciI6IjIwMTMifX19LHsidHlwZSI6InBlcnNvbmFsIiwicGVyc29uYWwiOnsiZmlyc3RuYW1lIjoiSm9obiIsImxhc3RuYW1lIjoiRG9lIiwiYWdlIjp7ImFnZSI6IjM0IiwieWVhciI6IjE5ODAiLCJtb250aCI6IjQiLCJkYXkiOiIxNSJ9LCJjb250YWN0cyI6W3siZW1haWwiOiJteW5hbWVAZXhhbXBsZS5jb20iLCJwaG9uZSI6IjM5MzQyNTkyOTAxNSJ9XSwiZ2VuZGVyIjoiTUFMRSIsImNvbXBhbnkiOiJMaXZlUGVyc29uIn19XSwiaWF0IjoxNjEwMzYzNTc5LCJleHAiOjE2MTA5NjM1Nzl9.UjUSG7aAvq-OqqR9L_iMsWh00NBjmTndOxdI5Y_aANeHBnbODBl-KBBy6sq5YjxgFFC1ABl3IEojbs-2p0TZAvmf851CLHTkUWnGxsW6sqK8Qx3wq1rB1tGVvW-BqiiBo2c0ghB4r_lcx-2PBZD8eH8GV__k_D2rPEjIYNBy0nYQtOvCgzE7l2hbC8_zB45dx5gckaGxle46g0HYkWqjEhw2ngZIVmLtGQLbxqBF7ipm9RlXRq28yZgW2IFytsPulqi5ZeOZYPhHtRE-J4eawu3JEo0hzVi_VbvukMSRO62YOvi1enbtQZbIh1ObtEZTh-qEplxP7WDVS9owsq4NHQ

1.IMEI is a string that contains all data points
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjExODMzMjIsImlhdCI6MTYxMzQwNzMyMiwiaXNzIjoiaHR0cHM6Ly9saXZlcGVyc29uVGVzdC5jb20iLCJscF9zZGVzIjpbeyJpbmZvIjp7ImFjY291bnROYW1lIjoiMTIzNDVhYmNkLEEgdmFsdWUsIG51bWVybyBtb2JpbGUsVmFyaWF6aW9uZSBDb21tZXJjaWFsZS9UZWNuaWNhLFdlYixJbiBMYXZvcmF6aW9uZXw1NDMyMWRjYmEsTW9kaWZpY2EgcmVjYXBpdGksQW5hZ3JhZmljYSxXZWIsSW4gTGF2b3JhemlvbmV8Njc4OTBlZmdoLE1vZGlmaWNhIHJlY2FwaXRpLEFuYWdyYWZpY2EsV2ViLEluIExhdm9yYXppb25lIiwiY29tcGFueUJyYW5jaCI6IjEyMyIsImNvbXBhbnlTaXplIjoiMTIzNDU2IiwiY3VzdG9tZXJJZCI6IkpvaG4iLCJpbWVpIjoiU3RhdG9EdW5uaW5nOiBcIk5cIiwgY29kaWNlRGlhZ25vc3RpY286IFwidW5kZWZpbmVkXCIsIGdpYzogXCJ1bmRlZmluZWRcIiwgRGlzc2Vydml6aW86IFwiTlwiLCBpbnRlbnQ6IFwiUmljaGllc3RhX0NvbmZpZ3VyYXppb25lU21hcnRwaG9uZVwiLCBjbHVzdGVyRm9ybml0b3JlOiBORCwgVHJhY2tJRDogXCJ1bmRlZmluZWRcIiwgU0ZEQzogXCJodHRwczovL2dvb2dsZS5jb21cIiIsInJvbGUiOiJmaXNzbyttb2JpbGUiLCJzb2NpYWxJZCI6IicyNDY1MTM0NiciLCJzdGF0dXMiOiJhYmMiLCJ0eXBlIjoiMDEiLCJ1c2VyTmFtZSI6IlN1YlVMTCAobyBGVFRTKSJ9LCJ0eXBlIjoiY3RtcmluZm8ifSx7InBlcnNvbmFsIjp7ImFnZSI6eyJhZ2UiOjM0LCJkYXkiOjE1LCJtb250aCI6NCwieWVhciI6MTk4MH0sImNvbXBhbnkiOiJjb21wYW55IiwiY29udGFjdHMiOlt7ImVtYWlsIjoibXluYW1lMUBleGFtcGxlLmNvbSIsInBob25lIjoiMDcwMDAwMDAwMDAifV0sImZpcnN0bmFtZSI6IkpvaG4iLCJnZW5kZXIiOiJNQUxFIiwibGFuZ3VhZ2UiOiJlbi1VUyIsImxhc3RuYW1lIjoiU21pdGgifSwidHlwZSI6InBlcnNvbmFsIn1dLCJzdWIiOiJjdXN0b21lcl9pZDEyMyJ9.gdY8MCmH9X1tSUnwmf_3ktuM2p9HmMjFjZ5DUsWyQVV7kZ_r3hQukqRDamg6gwGjbDfa0cc5HLo7aq_uIZ7HR5ODpAqN-AaBIn75hIBI_U6IV9ZPwUFXVrxLNM6fDhDEu-hrTBNYdHx-Wia4BFT94cjOo56kmo3EXLka_NXWjXEmxe-SDCs2Q0Tm4mgaHi5_kkfYeISTycOkapLQkbcWAmkmSXnPe_oWF-4265Yq6sP_5HbkjjTUZMgKEyD6DnlsQ07mWSqzsfMQE0Yboe3ax4HOMXSx_BcvoymcbrcpA4JkBmuY7wUh7ahgmCf9Z70D0KeypdBTumM28Rx8ZASS0g
2.IMEI is a string that contains some data points	
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjExODE2MjAsImlhdCI6MTYxMzQwNTYyMCwiaXNzIjoiaHR0cHM6Ly9saXZlcGVyc29uVGVzdC5jb20iLCJscF9zZGVzIjpbeyJpbmZvIjp7ImNvbXBhbnlCcmFuY2giOiIxMjMiLCJjc3RhdHVzIjoiY2FuY2VsbGVkIiwiY3R5cGUiOiJ2aXAiLCJjdXN0b21lcklkIjoiMTM4NzY2QUMiLCJpbWVpIjoiU3RhdG9EdW5uaW5nOiBcIk5cIiwgY29kaWNlRGlhZ25vc3RpY286IFwidW5kZWZpbmVkXCIsIGdpYzogXCJ1bmRlZmluZWRcIiwgRGlzc2Vydml6aW86IFwiTlwiIiwic3RvcmVOdW1iZXIiOiIxMjM4NjUiLCJzdG9yZVppcENvZGUiOiIyMDUwNSJ9LCJ0eXBlIjoiY3RtcmluZm8ifSx7InBlcnNvbmFsIjp7ImFnZSI6eyJhZ2UiOjM0LCJkYXkiOjE1LCJtb250aCI6NCwieWVhciI6MTk4MH0sImNvbXBhbnkiOiJjb21wYW55IiwiY29udGFjdHMiOlt7ImVtYWlsIjoibXluYW1lMUBleGFtcGxlLmNvbSIsInBob25lIjoiMDcwMDAwMDAwMDAifV0sImZpcnN0bmFtZSI6IkpvaG4iLCJnZW5kZXIiOiJNQUxFIiwibGFuZ3VhZ2UiOiJlbi1VUyIsImxhc3RuYW1lIjoiU21pdGgifSwidHlwZSI6InBlcnNvbmFsIn1dLCJzdWIiOiJjdXN0b21lcl9pZDEyMyJ9.fXAH5nMxy0IVz_arb-aS_Z_Zixo2MTloFR3q5GMqB6K5FZLSrrEMK9jn0lxoOU8yfLyba4mUim_SEU-P3VXLARATsb5Fb6SrPD9uzNjlCsGo6DPO8IgOuzEB80cmqH-0knw0IcdpP14FW-KLrwTQYcL9hqcnQkDwLRpy58QT4-JUlrjYCWKxi1cZsc9u9Av7OKD5OfsW4XODglay51bIcxezwDIkAdYEo2EDk2aoN5N8ztbugeF7l8eKgdaIpSGtBESzjZF7mVem2dszN914deY3Z3vczuhZEXnWX6j-qF3c0uAv1rdx10k7prN1v2KnY34xBpkiwQqwOp0YfBOAcw
3.IMEI is undefined, company branch is 123	
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjExODE2NDgsImlhdCI6MTYxMzQwNTY0OCwiaXNzIjoiaHR0cHM6Ly9saXZlcGVyc29uVGVzdC5jb20iLCJscF9zZGVzIjpbeyJpbmZvIjp7ImNvbXBhbnlCcmFuY2giOiIxMjMiLCJjc3RhdHVzIjoiY2FuY2VsbGVkIiwiY3R5cGUiOiJ2aXAiLCJjdXN0b21lcklkIjoiMTM4NzY2QUMiLCJzdG9yZU51bWJlciI6IjEyMzg2NSIsInN0b3JlWmlwQ29kZSI6IjIwNTA1In0sInR5cGUiOiJjdG1yaW5mbyJ9LHsicGVyc29uYWwiOnsiYWdlIjp7ImFnZSI6MzQsImRheSI6MTUsIm1vbnRoIjo0LCJ5ZWFyIjoxOTgwfSwiY29tcGFueSI6ImNvbXBhbnkiLCJjb250YWN0cyI6W3siZW1haWwiOiJteW5hbWUxQGV4YW1wbGUuY29tIiwicGhvbmUiOiIwNzAwMDAwMDAwMCJ9XSwiZmlyc3RuYW1lIjoiSm9obiIsImdlbmRlciI6Ik1BTEUiLCJsYW5ndWFnZSI6ImVuLVVTIiwibGFzdG5hbWUiOiJTbWl0aCJ9LCJ0eXBlIjoicGVyc29uYWwifV0sInN1YiI6ImN1c3RvbWVyX2lkMTIzIn0.G1cZnZZlk3Q51bUnhEf34_NNEz0vDCudbdycj5KoM11iQciszKVCBGO-s-a2XBJstF6-yNtTMwYHVjINEtACKPnBWk30bUtVZ5NTiJHPLWT5PrvHM55DEf6BEpBsMqW9E2i8FslPJUesFRrlD1ASdDqci_lvT1yHtnxbQ1RKK9IWJ8ekofJ_e0lVfGv5GQ1knM80anhfvt1tJcLyQg_MaY9wjq9pVIuiFWbKlrfoVErwAU2_6J6df04Bu3usgw7adr7Hgj7BTjUh0-BH_K8SsOq-wQWlty-rZyFerJSbGpd01lXuraZ9zEOF6z-dmrt5OOQlyeattQ8_5noSmpeIHA
4.IMEI is a number, company branch isn't 393756352311	
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjE0Mzc4MDEsImlhdCI6MTYxMzY2MTgwMSwiaXNzIjoiaHR0cHM6Ly9saXZlcGVyc29uVGVzdC5jb20iLCJscF9zZGVzIjpbeyJpbmZvIjp7ImFjY291bnROYW1lIjoiMTIzNDVhYmNkLEEgdmFsdWUsIG51bWVybyBtb2JpbGUsVmFyaWF6aW9uZSBDb21tZXJjaWFsZS9UZWNuaWNhLFdlYixJbiBMYXZvcmF6aW9uZXw1NDMyMWRjYmEsTW9kaWZpY2EgcmVjYXBpdGksQW5hZ3JhZmljYSxXZWIsSW4gTGF2b3JhemlvbmV8Njc4OTBlZmdoLE1vZGlmaWNhIHJlY2FwaXRpLEFuYWdyYWZpY2EsV2ViLEluIExhdm9yYXppb25lIiwiY29tcGFueUJyYW5jaCI6IjEyMyIsImNvbXBhbnlTaXplIjoiMTIzNDU2IiwiY3VzdG9tZXJJZCI6IkpvaG4iLCJpbWVpIjoiMzkxMjM0NTYiLCJyb2xlIjoiZmlzc28rbW9iaWxlIiwic29jaWFsSWQiOiInMjQ2NTEzNDYnIiwic3RhdHVzIjoiYWJjIiwidHlwZSI6IjAxIiwidXNlck5hbWUiOiJTdWJVTEwgKG8gRlRUUykifSwidHlwZSI6ImN0bXJpbmZvIn0seyJwZXJzb25hbCI6eyJhZ2UiOnsiYWdlIjozNCwiZGF5IjoxNSwibW9udGgiOjQsInllYXIiOjE5ODB9LCJjb21wYW55IjoiY29tcGFueSIsImNvbnRhY3RzIjpbeyJhZGRyZXNzIjp7InppcGNvZGUiOiIzMDAwOSJ9LCJlbWFpbCI6Im15bmFtZUBleGFtcGxlLmNvbSIsInBob25lIjoiKzEgMjEyLTc4OC04ODc3IiwicHJlZmVycmVkIjoiRU1BSUwifV0sImZpcnN0bmFtZSI6IkpvaG4iLCJnZW5kZXIiOiJNQUxFIiwibGFuZ3VhZ2UiOiJlbi1VUyIsImxhc3RuYW1lIjoiRG9lIn0sInR5cGUiOiJwZXJzb25hbCJ9XSwic3ViIjoiSm9oblNtaXRoIn0.sRKs68codu8nHS3kiQ_Su3XFwcK67Fun-6zt030_ZduJb036qny8k6RMQNMDJdZr0HA63Z1y0kKsmnqMIkghZapDjBvtPY6ZPrVNcPWVj_etsAJvRWVLo4snDqyjCYo5K2SipEKtS0pjENQUwSSJtI2IpR9x8yYFlT3KrsrMTqvF1HE_oirCQoQXXmpsh_OFeNSEa7tiM6o7Bz3a5-o69vmHmKLGUKvRckjfIjDdHiSc75WYaIl7sNOmqwxKj0FJV3ZIb4y_yNWEqSbIgnEQomqjzu9vRbVsdvNIxWA0Q9_6T5BxpWwtv0rCNvmg5rH69JgqwsiUAVN4nSJSSZwfow
5.IMEI is a number, company branch is 393756352311	
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjE0Mzc3NTMsImlhdCI6MTYxMzY2MTc1MywiaXNzIjoiaHR0cHM6Ly9saXZlcGVyc29uVGVzdC5jb20iLCJscF9zZGVzIjpbeyJpbmZvIjp7ImFjY291bnROYW1lIjoiMTIzNDVhYmNkLEEgdmFsdWUsIG51bWVybyBtb2JpbGUsVmFyaWF6aW9uZSBDb21tZXJjaWFsZS9UZWNuaWNhLFdlYixJbiBMYXZvcmF6aW9uZXw1NDMyMWRjYmEsTW9kaWZpY2EgcmVjYXBpdGksQW5hZ3JhZmljYSxXZWIsSW4gTGF2b3JhemlvbmV8Njc4OTBlZmdoLE1vZGlmaWNhIHJlY2FwaXRpLEFuYWdyYWZpY2EsV2ViLEluIExhdm9yYXppb25lIiwiY29tcGFueUJyYW5jaCI6IjM5Mzc1NjM1MjMxMSIsImNvbXBhbnlTaXplIjoiMTIzNDU2IiwiY3VzdG9tZXJJZCI6IkpvaG4iLCJpbWVpIjoiMzkxMjM0NTYiLCJyb2xlIjoiZmlzc28rbW9iaWxlIiwic29jaWFsSWQiOiInMjQ2NTEzNDYnIiwic3RhdHVzIjoiYWJjIiwidHlwZSI6IjAxIiwidXNlck5hbWUiOiJTdWJVTEwgKG8gRlRUUykifSwidHlwZSI6ImN0bXJpbmZvIn0seyJwZXJzb25hbCI6eyJhZ2UiOnsiYWdlIjozNCwiZGF5IjoxNSwibW9udGgiOjQsInllYXIiOjE5ODB9LCJjb21wYW55IjoiY29tcGFueSIsImNvbnRhY3RzIjpbeyJhZGRyZXNzIjp7InppcGNvZGUiOiIzMDAwOSJ9LCJlbWFpbCI6Im15bmFtZUBleGFtcGxlLmNvbSIsInBob25lIjoiKzEgMjEyLTc4OC04ODc3IiwicHJlZmVycmVkIjoiRU1BSUwifV0sImZpcnN0bmFtZSI6IkpvaG4iLCJnZW5kZXIiOiJNQUxFIiwibGFuZ3VhZ2UiOiJlbi1VUyIsImxhc3RuYW1lIjoiRG9lIn0sInR5cGUiOiJwZXJzb25hbCJ9XSwic3ViIjoiSm9oblNtaXRoIn0.alicvKH0AWinTx-YtYNX7mNvDB8BT53S52DN6Dv2jkzrxHtZV3NAIdo6hbkXkEJXHF4ITG-1dxdTeRCXgH_iMd49JkrGq6QTr5s_1creXdzl_mCoH85V01zcon-Z4wPvTIAB4AnAfG2gaHsB_4bJjVolznUet1MhZof0O99f-cIilItGjPg3GO6Juugbzhwg0q1TQ5S2Tg2dXUsLFhP9C2jrzyiN6UIYdXoRZ70o2PXl61d7U-jBvorFNN_L2TNaXCIrMXzTjPTURzgVaiO6SsAcTEvs-2mJrC_zTlOhGfLx1BuVZe8EUurk5LSRcES85OW0v0l3pkt2MH4FUQiqFw
6.IMEI is a number, company branch is undefined (same as isn't 393756352311)	
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjExODE3NjksImlhdCI6MTYxMzQwNTc2OSwiaXNzIjoiaHR0cHM6Ly9saXZlcGVyc29uVGVzdC5jb20iLCJscF9zZGVzIjpbeyJpbmZvIjp7ImNzdGF0dXMiOiJjYW5jZWxsZWQiLCJjdHlwZSI6InZpcCIsImN1c3RvbWVySWQiOiIxMzg3NjZBQyIsImltZWkiOiIxMjQiLCJzdG9yZU51bWJlciI6IjEyMzg2NSIsInN0b3JlWmlwQ29kZSI6IjIwNTA1In0sInR5cGUiOiJjdG1yaW5mbyJ9LHsicGVyc29uYWwiOnsiYWdlIjp7ImFnZSI6MzQsImRheSI6MTUsIm1vbnRoIjo0LCJ5ZWFyIjoxOTgwfSwiY29tcGFueSI6ImNvbXBhbnkiLCJjb250YWN0cyI6W3siZW1haWwiOiJteW5hbWUxQGV4YW1wbGUuY29tIiwicGhvbmUiOiIwNzAwMDAwMDAwMCJ9XSwiZmlyc3RuYW1lIjoiSm9obiIsImdlbmRlciI6Ik1BTEUiLCJsYW5ndWFnZSI6ImVuLVVTIiwibGFzdG5hbWUiOiJTbWl0aCJ9LCJ0eXBlIjoicGVyc29uYWwifV0sInN1YiI6ImN1c3RvbWVyX2lkMTIzIn0.MOFp4OVCeyFUDFXw5UK57iPuX4hbQd-GXpMRr-11iJma9dNOfc3dHaZFiw8nLN8HMgtC_4Pjfi80kCO0C5bLdHlSqgyg-lIu1ZKFRZwVAyduU_qRJ1Fh1kVUAwoyr-H6-C6QZIXGgtA_oKFHM49BYlIDPcFUK612orqq8fbpr8hace4VALq4ccWIW3sJjXIbPN2zbiH9Tt8EHmvXDa1zWOxgEjp5WMt3hGdMN41ZL5Ht2elCLY2o6jTD9eoXTEdfdRkLslXzOjSpKiN-3pO2iAViXgx-eTqK9E1x5kMorjoVAr8N95lqee1QmoBcrd7XrlY5Io9b87t4AuW1f9WFVQ
7.IMEI is a undefined, company branch is undefined (same as unauth conv)	
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjExODE3MjAsImlhdCI6MTYxMzQwNTcyMCwiaXNzIjoiaHR0cHM6Ly9saXZlcGVyc29uVGVzdC5jb20iLCJscF9zZGVzIjpbeyJpbmZvIjp7ImNvbXBhbnlCcmFuY2giOiIzOTM3NTYzNTIzMTEiLCJjc3RhdHVzIjoiY2FuY2VsbGVkIiwiY3R5cGUiOiJ2aXAiLCJjdXN0b21lcklkIjoiMTM4NzY2QUMiLCJpbWVpIjoiMTI0Iiwic3RvcmVOdW1iZXIiOiIxMjM4NjUiLCJzdG9yZVppcENvZGUiOiIyMDUwNSJ9LCJ0eXBlIjoiY3RtcmluZm8ifSx7InBlcnNvbmFsIjp7ImFnZSI6eyJhZ2UiOjM0LCJkYXkiOjE1LCJtb250aCI6NCwieWVhciI6MTk4MH0sImNvbXBhbnkiOiJjb21wYW55IiwiY29udGFjdHMiOlt7ImVtYWlsIjoibXluYW1lMUBleGFtcGxlLmNvbSIsInBob25lIjoiMDcwMDAwMDAwMDAifV0sImZpcnN0bmFtZSI6IkpvaG4iLCJnZW5kZXIiOiJNQUxFIiwibGFuZ3VhZ2UiOiJlbi1VUyIsImxhc3RuYW1lIjoiU21pdGgifSwidHlwZSI6InBlcnNvbmFsIn1dLCJzdWIiOiJjdXN0b21lcl9pZDEyMyJ9.B3slz92lkl_Egi38Hijje5c53_SekFrPQvk1ZVmQ5TeWXB11WD1y9d6oNN28aivP8dYFJ6_-PahJJ5rjJWq0bo5t_Uko7PngVEgpFAq9eLcu-c5oQZOINyQSHjbm1cc0IRTdBweDzomXAJR8nbyhLazAnpPyy5inznSGEDSnxDsGgtmzSn2gD_Yzn7wieKXvaVu6hjkh8ScXtzxt7GmtvVgnQ9eanpkupPfwHDBwisxgYXAiiy0ttuvyBaasaa-m0uyROgZZOLX36kvUwZL9OxbANKVT4bRaPPTEpvGRVGlzNrEJQOmoSutyNWmN7x2SnovKc0v1w0Hi0dXR5Ajjug
*/  
	  
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
      return this.auth_signup(account).then(newJWT => {
        localStorage.setItem(`${account}-jwt`, newJWT);
        return Promise.resolve(newJWT);
      });
  }

  static clearJWT(account) {
    localStorage.removeItem(`${account}-jwt`);
  }}


/*
	WebSocket class

*/
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
      if (!this.checkStatus()){
      	this._connect();
      }
      console.log("Message sent: \n" + str);
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
    console.log("Received message:\n " + msg.data);
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
  }

  checkStatus() {
  	return (this.ws != null)
  }
}
