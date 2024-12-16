### Node 调试模式

```js
node --inspect ./index.js
node --inspect-brk ./index.js
```

--inspect 是以调试模式启动，--inspect-brk 是以调试模式启动并且在首行断住

#### vscode 调试配置

```json
    {
      "type": "node",
      "request": "attach",
      "name": "Attach",
      "port": 9229,
      "skipFiles": [
        "<node_internals>/**"
      ],
    },
```

先 node --inspect xxx.js 把调试服务跑起来，然后再手动 attach

```json
{
  "name": "调试index.js",
  "program": "${workspaceFolder}/index.js",
  "request": "launch",
  "skipFiles": ["<node_internals>/**"],
  "type": "node"
}
```

自动以调试模式跑这个 node 脚本，并且自动 attach 上
