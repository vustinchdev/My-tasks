describe("editableSpan", () => {
  it("base example, visually looks correct", async () => {
    await page.goto(
      "http://localhost:9009/iframe.html?args=&id=todolists-editablespan--editable-span-story&viewMode=story",
      { waitUntil: "networkidle2" },
    )

    const image = await page.screenshot()

    expect(image).toMatchImageSnapshot()
  })
})
