const templateWidget = {
    variables: {
        img: document.createElement("img"),
        img_li: document.createElement("li"),
        saveInput: document.createElement("div"),
        redactorToolbar: document.querySelector(".redactor_toolbar"),
        redactorBoxParent: document.querySelector(".redactor_box").parentNode,
        menuOpen: false
    },

    init: function () {
        this.variables.img.src = "data:img;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAAtElEQVRIS+2X4QqDIBSF7zP3Aj1tv3Ng+yHInWfkuGxl16FJmx8cjDC/TiAkOefYWsvG3HieTdXAARechItlubP3nmsDB1xwEt7iDGkELjgJn+Bs4OziD4hIHS1qsYYceQ3xoJmfJQ7juC7+njHOk0lRtLGkqDiMe41lXu1T9MabHC2yxW+Iw4g9Oh1kkM/scZnGfTvFPFtKcD/FNRrnUEz8TVKoxDX4U3GzH/pmR5g2hzbHD1U/iKWuJ/q4AAAAAElFTkSuQmCC";
        this.variables.img_li.title = "Toggle templates menu";
        this.variables.redactorToolbar.appendChild(this.variables.img_li);
        this.variables.img_li.appendChild(this.variables.img);
        this.variables.saveInput.innerHTML = templateHTML;
        this.bindToggleMenuAction();
        templateStorage.pageOpenInit();
    },

    bindToggleMenuAction: function () {
        this.variables.img_li.onclick = function () {
            templateWidget.setMenu(!templateWidget.variables.menuOpen);
        }
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