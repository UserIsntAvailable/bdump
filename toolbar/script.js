
const tabsButton = document.getElementById("box-tabs-button");
tabsButton.onclick = async (_) => {
    // TODO: Only get for current window option.
    // TODO: Select what properties to get.
    const tabs = await browser.tabs.query({});
    const newTabs = tabs.map((value) => { return { title: value.title, url: value.url } });
    const tabsJson = JSON.stringify({ tabs: newTabs }, null, 2);

    downloadJson(tabsJson, "tabs");
}

const bookmarksButton = document.getElementById("box-bookmarks-button");
bookmarksButton.onclick = async (_) => {
    const bTreeNode = (await browser.bookmarks.getTree())[0];

    // Traverses a BookmarkTreeNode removing irrelevant information.
    let cleanBookmarkTreeNode = (node) => {
        const children = node?.children;
        const type = node.type;
        const newNode = {
            title: node.title,
            type: type,
            url: type === "folder" ? undefined : node.url,
            children: children
        }

        for (let i = 0; i < children?.length; i++) {
            newNode.children[i] = cleanBookmarkTreeNode(children[i]);
        }

        return newNode;
    }

    // FIX: Maybe I should include the root node to follow the API?
    let newTreeNode = cleanBookmarkTreeNode(bTreeNode).children; // ignoring the root node.
    const bookmarksJson = JSON.stringify({ bookmarks: newTreeNode }, null, 2);

    downloadJson(bookmarksJson, "bookmarks");
}

function downloadJson(json, namePrefix) {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json;charset=utf-8" }));

    // https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript/53864791#53864791
    const a = document.createElement("a");
    a.href = url;
    // FIX: For now just appending epoch timestamp.
    a.download = `${namePrefix}-dump-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 0);
}
