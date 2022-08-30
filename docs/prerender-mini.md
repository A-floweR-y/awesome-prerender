# 实现一个简版的 Prerender

这里我们首先要捋一下思路，我们需要哪些内容：
1. 因为 `page.goto(url)` 方法要求 url 必须带有 http 协议。所以，我们需要一个服务模块（`Service`），启动一个静态资源服务器。使用 http 协议的链接来访问我们需要预渲染的页面。
2. 我们需要一个调用 Puppeteer 的模块，用来做预渲染的工作。这个模块需要接受一个 `routes` 参数，标识需要渲染的路由列表。
3. 我们需要一个 Index 模块，来调度 Service 和 Puppeteer 模块。并且，对外提供 API。

我们先来实现最简单的 Service 模块。

## Service 模块的实现

