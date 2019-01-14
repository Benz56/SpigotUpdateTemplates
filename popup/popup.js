const autoOpenCB = document.querySelector("#autoOpenCB");
const overwriteCB = document.querySelector("#overwriteDraft");

//Auto Open
chrome.storage.sync.get(["SUT_AutoOpen"], function (result) {
    autoOpenCB.checked = result.SUT_AutoOpen;
});

autoOpenCB.onclick = function () {
    chrome.storage.sync.set({"SUT_AutoOpen": autoOpenCB.checked});
};

//Overwrite
chrome.storage.sync.get(["SUT_Overwrite"], function (result) {
    overwriteCB.checked = result.SUT_Overwrite;
});

overwriteCB.onclick = function () {
    chrome.storage.sync.set({"SUT_Overwrite": overwriteCB.checked});
};