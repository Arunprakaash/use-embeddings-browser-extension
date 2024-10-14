chrome.runtime.onInstalled.addListener(()=>{console.log("Extension installed")}),chrome.runtime.onMessage.addListener((e,o,n)=>{"log"===e.action&&(console.log(e.message),n({status:"logged"}))});
//# sourceMappingURL=service_worker.js.map
