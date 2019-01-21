const templateWidget = {
    variables: {
        btn_img: document.createElement("img"),
        btn_img_hover: document.createElement("img"),
        btn_img_click: document.createElement("img"),
        btn_img_li: document.createElement("li"),
        saveInput: document.createElement("div"),
        redactorToolbar: document.querySelector(".redactor_toolbar"),
        redactorBoxParent: document.querySelector(".redactor_box").parentNode,
        versionField: document.querySelector("#ctrl_version_string"),
        updateTitle: document.querySelector("#ctrl_title"),
        menuOpen: false
    },

    init: function () {
        this.variables.btn_img.src = "data:img;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAAtElEQVRIS+2X4QqDIBSF7zP3Aj1tv3Ng+yHInWfkuGxl16FJmx8cjDC/TiAkOefYWsvG3HieTdXAARechItlubP3nmsDB1xwEt7iDGkELjgJn+Bs4OziD4hIHS1qsYYceQ3xoJmfJQ7juC7+njHOk0lRtLGkqDiMe41lXu1T9MabHC2yxW+Iw4g9Oh1kkM/scZnGfTvFPFtKcD/FNRrnUEz8TVKoxDX4U3GzH/pmR5g2hzbHD1U/iKWuJ/q4AAAAAElFTkSuQmCC";
        this.variables.btn_img_hover.src = "data:img;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAA30lEQVRIS+2X/QqDIBRH7zP3Aj3t/q5BCQnhPFHjztEn17WgAz+0MI9XEEy896FpmlDXz1BVddbgwIVT6LStC33fh9zgwIVTWMUvpBO4cApboGEbnHOmYU4Nzg8xA7quG5/sYE4t/xKzulzouTeJRWRzljgk3sKaPLe4mBt/WBzbcpw8TTmN00nJVrHGVBzbuYp13tWn3BX/f8V7MBXHljP6WEmhv9FcsuL7OE0ZqtTwPuV6Fe/BTHwkKbvFViyKT7vsAQNYnWW0FAbxaRf6035h2AY6rIItyBkcuLz34QUpiH91UFRu+QAAAABJRU5ErkJggg==";
        this.variables.btn_img_click.src = "data:img;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAA5ElEQVRIS+2W0QmDMBBAs1RX7ShdouAKQTqAFrQfAUmfJp5atbYxAT98HHgkuZcLIkYZY6qqKstnUZRRAhVCtIpHXb+aprGRQIUQrWKTiF4HQrSKI/gBa/M8z7LsHgSFlHuRtWgHNRNaa5eHQbnYJ2q2dckeRDJRcyiXOB63y/fw66aIZEPtsyXW7HHUVl/na/5Rd/XjYMTNDiMjInQt7FDPupaQ9ttlPWfXx1Sfr7Hno2aNHeqVD11oR0YcpOstAtU/hi/oWFYn/IEl/O0CE2zLoQKgULzQqhNecRJezFJdJ415A7xetj9XiZaSAAAAAElFTkSuQmCC";
        this.variables.btn_img_li.title = "Toggle templates menu";
        this.variables.redactorToolbar.appendChild(this.variables.btn_img_li);
        this.variables.btn_img_li.appendChild(this.variables.btn_img);
        this.variables.saveInput.innerHTML = templateHTML;
        this.versionSuggestion();
        this.bindToggleMenuActions();
        templateStorage.pageOpenInit();
        chrome.storage.sync.get(["SUT_AutoOpen"], function (result) {
            if (!result.SUT_AutoOpen) return;
            templateWidget.setMenu(result.SUT_AutoOpen);
        });
    },

    bindToggleMenuActions: function () {
        this.variables.btn_img_li.onmouseover = function () {
            if (templateWidget.variables.btn_img_li.contains(templateWidget.variables.btn_img_click)) return;
            templateWidget.variables.btn_img_li.firstChild.replaceWith(templateWidget.variables.btn_img_hover);
        };
        this.variables.btn_img_li.onmouseleave = function () {
            templateWidget.variables.btn_img_li.firstChild.replaceWith(templateWidget.variables.btn_img);
        };
        this.variables.btn_img_li.onmousedown = function () {
            templateWidget.variables.btn_img_li.firstChild.replaceWith(templateWidget.variables.btn_img_click);
        };
        this.variables.btn_img_li.onmouseup = function () {
            templateWidget.variables.btn_img_li.firstChild.replaceWith(templateWidget.variables.btn_img);
            templateWidget.setMenu(!templateWidget.variables.menuOpen);
        };
        this.variables.btn_img_click.ondragstart = function () {
            return false;
        };
        this.variables.btn_img_li.ondragstart = function () {
            return false;
        }
    },

    versionSuggestion: function () {
        let version = this.variables.versionField.placeholder.replace("Currently version ", "");
        if (/[^0-9.]+/.test(version)) return; // Incorrect version structure. Only numbers separated by dots.
        this.variables.versionField.style.width = "70%";

        let list = document.createElement("select");
        list.style.width = "28%";
        list.style.marginLeft = "2%";
        list.style.height = "26px";
        list.style.border = "1px solid #dddddd";
        list.style.borderRadius = list.style.padding = "3px";
        list.style.fontWeight = "bold";
        list.options.add(new Option("Select version", "", true, true));

        let numbers = version.split(".").map(value => parseInt(value));
        for (let i = numbers.length - 1; i >= 0; i--) {
            let arr = numbers.slice(0); //Clone/Copy
            arr[i]++;
            for (let j = i + 1; j < numbers.length; j++) arr[j] = 0; // Replace prior with 0.
            list.options.add(new Option(arr.join("."), arr.join(".")));
        }

        list.onchange = function () {
            templateStorage.updateTemplate(templateWidget.variables.versionField.value, this.value);
            templateWidget.variables.versionField.value = this.value;
            let versionLength = list.options[1].text.length;
            let title = templateWidget.variables.updateTitle.value;
            if (title === "" && this.value !== "") {
                templateWidget.variables.updateTitle.value = "[" + this.value + "] ";
            } else if (title.startsWith("[") && title.charAt(1 + versionLength) === "]") {
                if (this.value !== "") {
                    templateWidget.variables.updateTitle.value = "[" + this.value + "]" + title.substring(2 + versionLength);
                } else templateWidget.variables.updateTitle.value = title.substring((title.length > versionLength + 2 && title.charAt(versionLength + 2) === ' ' ? 3 : 2) + versionLength);
            } else if (!title.startsWith("[") && this.value !== "") templateWidget.variables.updateTitle.value = "[" + this.value + "] " + title;
        };

        this.variables.versionField.parentNode.insertBefore(list, this.variables.versionField.nextSibling);
    },

    setMenu(bool = true) {
        if (bool === this.variables.menuOpen) return;
        if (bool) {
            this.variables.redactorBoxParent.prepend(this.variables.saveInput);
            templateStorage.templateMenuInit();
        } else this.variables.redactorBoxParent.removeChild(this.variables.saveInput);
        this.variables.menuOpen = bool;
    }
};
templateWidget.init();