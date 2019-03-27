const templateKeyPrefix = "|S/\\U/\\T|-T-", selectedTemplateKeyPrefix = "|S/\\U/\\T|-ST-",
    titleKeyPrefix = "|S/\\U/\\T|-UT-";
const templateStorage = {
    variables: {
        resourceId: window.location.href.substring(window.location.href.lastIndexOf(".")).replace(".", "").split("/")[0],
        templateContent: document.querySelector(".redactor_").contentDocument,
        bbCodeEditorButton: document.querySelector(".redactor_btn_group.redactor_btn_right"),
        isAddVersion: false,
        responseBox: null,
        editTemplatesList: null,
        resourceTemplatesList: null,
        nameInput: null,
        saveButton: null,
        loadButton: null,
        appendButton: null,
        prependButton: null,
        updateButton: null,
        deleteButton: null,
        selectButton: null
    },

    pageOpenInit: function () {
        this.variables.bbCodeEditorButton.onclick = function () {
            templateWidget.setMenu(false);
        };
        this.variables.isAddVersion = window.location.href.substring(window.location.href.lastIndexOf("/")) === "/add-version";
        if (!this.variables.isAddVersion) return;
        this.initTitleElements();
        let templateName = localStorage.getItem(selectedTemplateKeyPrefix + this.variables.resourceId);
        if (templateName === null) return;
        if (document.querySelector(".redactor_").contentDocument.body.innerHTML !== "<p><br></p>") {
            chrome.storage.sync.get(["SUT_Overwrite"], function (result) {
                if (result.SUT_Overwrite) {
                    templateStorage.loadTemplate(localStorage.getItem(templateKeyPrefix + templateName));
                }
            });
        } else this.loadTemplate(localStorage.getItem(templateKeyPrefix + templateName));
    },

    templateMenuInit: function () {
        this.variables.responseBox = document.querySelector("#templateActionResponse");
        this.variables.saveButton = document.querySelector("#templateSaveButton");
        this.variables.loadButton = document.querySelector("#templateLoadButton");
        this.variables.appendButton = document.querySelector("#templateAppendButton");
        this.variables.prependButton = document.querySelector("#templatePrependButton");
        this.variables.updateButton = document.querySelector("#templateUpdateButton");
        this.variables.deleteButton = document.querySelector("#templateDeleteButton");
        this.variables.selectButton = document.querySelector("#templateSelectButton");
        this.variables.editTemplatesList = document.querySelector("#editTemplatesList");
        this.variables.resourceTemplatesList = document.querySelector("#resourceTemplatesList");
        this.variables.selectButton.disabled = !templateStorage.variables.isAddVersion;
        this.variables.resourceTemplatesList.disabled = !templateStorage.variables.isAddVersion;
        this.bindUIButtons();
        this.updateSelectableTemplates();
        let selected = localStorage.getItem(selectedTemplateKeyPrefix + templateStorage.variables.resourceId);
        this.setResponse("This resource does not have a default template. Select one in the right most dropdown!");
        if (!this.variables.isAddVersion || selected === null) return;
        this.setResponse("Successfully loaded the default template for this resource!");
        this.variables.editTemplatesList.value = selected;
        this.variables.resourceTemplatesList.value = selected;
    },

    initTitleElements: function () {
        let version = templateWidget.variables.versionField.placeholder.replace("Currently version ", "");
        if (/[^0-9.]+/.test(version)) return; // Incorrect version structure. Only numbers separated by dots.

        templateWidget.variables.updateTitle.style.width = "70%";
        let defaultTitle = localStorage.getItem(titleKeyPrefix + "title");
        templateWidget.variables.updateTitle.value = defaultTitle === null ? "[%version%] " : defaultTitle;

        let titleBtn = document.createElement("button");
        titleBtn.type = "button";
        titleBtn.style.width = "28%";
        titleBtn.style.marginLeft = "2%";
        titleBtn.style.height = "26px";
        titleBtn.style.border = "1px solid #dddddd";
        titleBtn.style.background = "#d9d9d9";
        titleBtn.style.color = "#535353";
        titleBtn.style.outline = "none";
        titleBtn.style.borderRadius = titleBtn.style.padding = "3px";
        titleBtn.style.fontWeight = "bold";
        titleBtn.style.boxShadow = "inset 0 -2px 0 rgba(0,0,0,.1)";
        titleBtn.textContent = "Save as Default";
        titleBtn.title = "Save the current title as the default title for all updates";
        templateWidget.variables.updateTitle.parentNode.insertBefore(titleBtn, templateWidget.variables.updateTitle.nextSibling);

        let canClick = true;
        titleBtn.onclick = function () {
            if (canClick === false) return;
            canClick = false;
            titleBtn.textContent = "Saved";
            localStorage.setItem(titleKeyPrefix + "title", templateWidget.variables.updateTitle.value);
        };

        titleBtn.onmouseleave = function () {
            canClick = true;
            titleBtn.style.background = "#d9d9d9";
            titleBtn.style.color = "#535353";
            titleBtn.textContent = "Save as Default";
        };

        titleBtn.onmousedown = function () {
            titleBtn.style.background = "#252525";
            titleBtn.style.color = "#ffffff";
        };

        titleBtn.onmouseup = titleBtn.onmouseenter = function () {
            titleBtn.style.background = "#ed8106";
            titleBtn.style.color = "#ffffff";
        };
    },

    bindUIButtons: function () {
        this.variables.saveButton.onclick = function () {
            templateStorage.variables.nameInput = document.querySelector("#templateNameInput").value;
            templateStorage.storeTemplate();
            templateStorage.updateSelectableTemplates();
        };

        this.variables.loadButton.onclick = function () {
            if (templateStorage.loadTemplate(localStorage.getItem(templateKeyPrefix + templateStorage.variables.editTemplatesList.value))) {
                templateStorage.setResponse("Successfully loaded template!");
            } else templateStorage.setResponse("Unable to load template!", "red");
        };

        this.variables.appendButton.onclick = function () {
            if (templateStorage.loadTemplate(localStorage.getItem(templateKeyPrefix + templateStorage.variables.editTemplatesList.value), "append")) {
                templateStorage.setResponse("Successfully appended template!");
            } else templateStorage.setResponse("Unable to append template!", "red");
        };

        this.variables.prependButton.onclick = function () {
            if (templateStorage.loadTemplate(localStorage.getItem(templateKeyPrefix + templateStorage.variables.editTemplatesList.value), "prepend")) {
                templateStorage.setResponse("Successfully prepended template!");
            } else templateStorage.setResponse("Unable to prepend template!", "red");
        };

        this.variables.updateButton.onclick = function () {
            if (templateStorage.variables.editTemplatesList.length === 0) {
                templateStorage.setResponse("No template selected!", "red");
                return;
            }
            templateStorage.setResponse("Successfully updated the selected template to the content below!");
            localStorage.setItem(templateKeyPrefix + templateStorage.variables.editTemplatesList.value, document.querySelector(".redactor_").contentDocument.getElementsByTagName("BODY")[0].innerHTML);
        };

        this.variables.deleteButton.onclick = function () {
            if (templateStorage.variables.editTemplatesList.length === 0) {
                templateStorage.setResponse("No template selected!", "red");
                return;
            }
            localStorage.removeItem(templateKeyPrefix + templateStorage.variables.editTemplatesList.value);

            // Remove all resource saves that have the deleted template as the selected template.
            Object.keys(localStorage).filter(key => key.includes(selectedTemplateKeyPrefix)).forEach(function (key) {
                if (localStorage.getItem(key) === templateStorage.variables.editTemplatesList.value) {
                    localStorage.removeItem(key);
                }
            });

            templateStorage.setResponse("Successfully deleted \n" + templateStorage.variables.editTemplatesList.value + "\n and all selections of it!");
            templateStorage.updateSelectableTemplates();
        };

        this.variables.selectButton.onclick = function () {
            if (templateStorage.variables.resourceTemplatesList.value === "None") {
                templateStorage.setResponse("The default template for this resource has been removed!");
                localStorage.removeItem(selectedTemplateKeyPrefix + templateStorage.variables.resourceId);
            } else {
                templateStorage.setResponse("The default template for this resource has been set to \"" + templateStorage.variables.resourceTemplatesList.value + "\"!");
                localStorage.setItem(selectedTemplateKeyPrefix + templateStorage.variables.resourceId, templateStorage.variables.resourceTemplatesList.value);
            }
        };
    },

    updateSelectableTemplates: function () {
        templateStorage.variables.editTemplatesList.length = 0;
        templateStorage.variables.resourceTemplatesList.length = 1;
        Object.keys(localStorage).filter(key => key.includes(templateKeyPrefix)).map(key => key.replace(templateKeyPrefix, "")).forEach(function (val) {
            let option = document.createElement("option");
            option.textContent = val;
            templateStorage.variables.resourceTemplatesList.appendChild(option.cloneNode(true));
            templateStorage.variables.editTemplatesList.appendChild(option.cloneNode(true));
        });
        let selected = localStorage.getItem(selectedTemplateKeyPrefix + templateStorage.variables.resourceId);
        if (!this.variables.isAddVersion || selected === null) return;
        this.variables.resourceTemplatesList.value = selected;
    },

    storeTemplate: function () {
        if (!this.variables.nameInput || typeof this.variables.nameInput !== 'string' || this.variables.nameInput.trim().length === 0 || this.variables.nameInput.toLowerCase().includes("none") || localStorage.getItem(this.variables.nameInput) !== null) {
            templateStorage.setResponse("Invalid Template Name. Please select another name!", "red");
            return;
        }
        templateStorage.setResponse("Successfully saved \"" + this.variables.nameInput + "\" as a new template!");
        localStorage.setItem(templateKeyPrefix + this.variables.nameInput, document.querySelector(".redactor_").contentDocument.getElementsByTagName("BODY")[0].innerHTML);
        document.querySelector("#templateNameInput").value = "";
    },

    loadTemplate: function (template, placement = "overwrite") {
        if (template !== null) {
            if (templateWidget.variables.versionField.value !== "") template = template.replace(/%version%/g, templateWidget.variables.versionField.value);

            switch (placement) {
                case "overwrite":
                    document.querySelector(".redactor_").contentDocument.body.innerHTML = template;
                    break;
                case "append":
                    document.querySelector(".redactor_").contentDocument.body.innerHTML += template;
                    break;
                case "prepend":
                    document.querySelector(".redactor_").contentDocument.body.innerHTML = template + document.querySelector(".redactor_").contentDocument.body.innerHTML;
            }
        }
        return template !== null;
    },

    setResponse(message = "", color = "green") {
        this.variables.responseBox.innerHTML = message;
        this.variables.responseBox.style.color = color;
    }
};