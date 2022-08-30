
const button = document.getElementById("box-button");
button.onclick = async (_) => {
    // TODO: Only get for current window option.
    // TODO: Select what properties to get.
    const tabs = await browser.tabs.query({});
    const newTabs = tabs.map((value) => { return { title: value.title, url: value.url } });
    const tabsJson = JSON.stringify({ tabs: newTabs }, null, 2);
    let url = URL.createObjectURL(new Blob([tabsJson], { type: "application/json;charset=utf-8" }));

    // https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript/53864791#53864791
    let a = document.createElement("a");
    a.href = url;
    // FIX: For now just appending epoch timestamp.
    a.download = `tabs-dumper-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 0);
}
