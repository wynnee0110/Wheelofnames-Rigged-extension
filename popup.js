// Get entries from the wheel page
async function loadNames() {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {

            const textarea = document.querySelector("textarea");

            if (!textarea) return [];

            return textarea.value
                .split("\n")
                .map(x => x.trim())
                .filter(Boolean);

        }

    }, (results) => {

        const names = results[0].result;
        const select = document.getElementById("names");

        names.forEach((name, i) => {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = name;
            select.appendChild(option);
        });

    });

}

loadNames();


// Send rig command
document.getElementById("rig").onclick = async () => {

    const index = document.getElementById("names").value;

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id, {
        type: "RIG_WHEEL",
        targetIndex: index
    });

};
