async function UserInputDialog(browser, page, value) {
    return new Promise(async (resolve) => {
        const result = await page.evaluate((msg) => {
            return new Promise((resolve) => {
                resolve(prompt(msg));
            });
        }, value);

        resolve(result);
    })
}