function clickLiveCaptionToggle() {
    console.log("Hello from the settings page");
    const toggle = document.getElementsByTagName("settings-ui")[0].shadowRoot
        .querySelector("settings-main").shadowRoot
        .querySelector("settings-basic-page").shadowRoot
        .querySelector("settings-a11y-page").shadowRoot
        .querySelector("settings-live-caption").shadowRoot
        .querySelector("#liveCaptionToggleButton").shadowRoot
        .querySelector("#outerRow");
    console.log(toggle);
    toggle.click();
}


function createSettingWindws() {
    chrome.windows.create({ url: "chrome://settings/accessibility", type: 'normal', state: 'minimized' },
        (createdWindow) => {
            chrome.scripting.executeScript({
                target: { tabId: createdWindow.tabs[0].id },
                func: clickLiveCaptionToggle,
            }).then(() => {
                chrome.windows.remove(createdWindow.id);
                console.log("Script executed");
            }).catch(err => {
                chrome.windows.remove(createdWindow.id);
                console.log(err);
            })
        })
}



chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "liveCaptionShortcutContextMenu",
        title: "Open / Close Live Caption",
    });

});


chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "liveCaptionShortcutContextMenu") {
        createSettingWindws();
    }
});


chrome.runtime.onMessage.addListener(
    (msg, sender, sendResponse) => {
        if (msg.cmd === 'clickLiveCaption') {
            createSettingWindws();
        }
    }
)





