const checkBox = document.querySelector("#autoOpenCB");

chrome.storage.sync.get(["SUT_AutoOpen"], function (result) {
    checkBox.checked = result.SUT_AutoOpen;
});

checkBox.onclick = function () {
    chrome.storage.sync.set({"SUT_AutoOpen": checkBox.checked});
};