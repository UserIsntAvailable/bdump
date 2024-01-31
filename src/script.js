const tabsButton = document.getElementById("box-tabs-button");
tabsButton.onclick = async (_) => {
    // TODO: Be able to select what properties to query?
    const tabsCheckbox = document.getElementById("box-tabs-checkbox");
    const query = { currentWindow: tabsCheckbox.checked };

    const tabs = await browser.tabs.query(query);
    const newTabs = tabs.map((value) => {
        return { title: value.title, url: value.url };
    });

    downloadJson(JSON.stringify({ tabs: newTabs }, null, 2), "tabs");
};

const bookmarksButton = document.getElementById("box-bookmarks-button");
bookmarksButton.onclick = async (_) => {
    const bTreeNode = (await browser.bookmarks.getTree())[0];

    // Traverses a BookmarkTreeNode removing irrelevant information.
    const cleanBookmarkTreeNode = (node) => {
        const children = node?.children;
        const type = node.type;
        const newNode = {
            title: node.title,
            type: type,
            url: type === "folder" ? undefined : node.url,
            children: children,
        };

        for (let i = 0; i < children?.length; i++) {
            newNode.children[i] = cleanBookmarkTreeNode(children[i]);
        }

        return newNode;
    };

    // TODO: Include the `root` node to follow the API?
    const newTreeNode = cleanBookmarkTreeNode(bTreeNode).children; // ignoring the root node.

    downloadJson(JSON.stringify({ bookmarks: newTreeNode }, null, 2), "bookmarks");
};

// TODO: Use `window.showSaveFilePicker()` if it ever gets stabilized...

// https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript/53864791#53864791
const downloadJson = (json, namePrefix) => {
    const url = URL.createObjectURL(
        new Blob([json], { type: "application/json;charset=utf-8" }),
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = `${namePrefix}-dump-${Date.now()}.json`;

    // FIX: This could be problematic depending on users preferences.
    link.click();

    setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(url);
    }, 0);
}
