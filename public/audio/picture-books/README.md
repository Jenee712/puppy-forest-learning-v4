# 绘本真人录音

每本绘本录制 4 个 MP3 文件，一页一段：

```text
public/audio/picture-books/{绘本ID}/page1.mp3
public/audio/picture-books/{绘本ID}/page2.mp3
public/audio/picture-books/{绘本ID}/page3.mp3
public/audio/picture-books/{绘本ID}/page4.mp3
```

录音接入后，在 `data/pictureBooks.ts` 对应页面加入：

```ts
narration: "/audio/picture-books/pb-g1-1/page1.mp3"
```

建议统一使用 44.1kHz、128kbps MP3，开头和结尾各保留约 0.2 秒静音。
