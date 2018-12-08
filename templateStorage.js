const templateKeyPrefix = "|S/\\U/\\T|-T-", selectedTemplateKeyPrefix = "|S/\\U/\\T|-ST-";
const templateStorage = {
    variables: {
        resourceId: window.location.href.substring(window.location.href.lastIndexOf(".")).replace(".", "").split("/")[0],
        templateContent: document.querySelector(".redactor_").contentDocument,
        responseBox: null,
        editTemplatesList: null,
        resourceTemplatesList: null,
        nameInput: null,
        saveButton: null,
        loadButton: null,
        updateButton: null,
        deleteButton: null,
        selectButton: null
    },

    preInit: function () {
        let templateName = localStorage.getItem(selectedTemplateKeyPrefix + this.variables.resourceId);
        if (templateName === null) return;
        this.loadTemplate(localStorage.getItem(templateKeyPrefix + templateName));
    },

    init: function () {
        this.variables.responseBox = document.querySelector("#templateActionResponse");
        this.variables.saveButton = document.querySelector("#templateSaveButton");
        this.variables.loadButton = document.querySelector("#templateLoadButton");
        this.variables.updateButton = document.querySelector("#templateUpdateButton");
        this.variables.deleteButton = document.querySelector("#templateDeleteButton");
        this.variables.selectButton = document.querySelector("#templateSelectButton");
        this.variables.editTemplatesList = document.querySelector("#editTemplatesList");
        this.variables.resourceTemplatesList = document.querySelector("#resourceTemplatesList");
        this.bindUIButtons();
        this.updateSelectableTemplates();
        let selected = localStorage.getItem(selectedTemplateKeyPrefix + templateStorage.variables.resourceId);
        this.setResponse("This resource does not have a default template. Select one in the right most dropdown!");
        if (selected === null) return;
        this.setResponse("Successfully loaded the default template for this resource!");
        this.variables.editTemplatesList.value = selected;
        this.variables.resourceTemplatesList.value = selected;
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
        if (selected === null) return;
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

    loadTemplate: function (template) {
        if (template !== null) document.querySelector(".redactor_").contentDocument.body.innerHTML = template;
        return template !== null;
    },

    setResponse(message = "", color = "green") {
        this.variables.responseBox.innerHTML = message;
        this.variables.responseBox.style.color = color;
    }
};