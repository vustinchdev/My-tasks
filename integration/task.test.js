describe('taskIsDone', () => {
    it('base example, visually looks correct', async () => {

        await page.goto('http://localhost:9009/iframe.html?args=&id=todolists-task--task-is-done-story&viewMode=story',
            { waitUntil: "networkidle2" });

        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot();
    });
});

describe('taskIsActive', () => {
    it('base example, visually looks correct', async () => {

        await page.goto('http://localhost:9009/iframe.html?args=&id=todolists-task--task-is-active-story&viewMode=story',
            { waitUntil: "networkidle2" });

        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot();
    });
});