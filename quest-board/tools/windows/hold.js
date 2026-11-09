// Keeps one CDP session attached so the phone emulation (390x844, touch, mobile) stays on for every q.js call.
(async () => {
  const list = await (await fetch("http://127.0.0.1:9350/json/list")).json();
  const pg = list.find((t) => t.type === "page" && /^(about:blank|http)/.test(t.url));
  const ws = new WebSocket(pg.webSocketDebuggerUrl);
  await new Promise((ok) => (ws.onopen = ok));
  let id = 0; const send = (method, params = {}) => ws.send(JSON.stringify({ id: ++id, method, params }));
  send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" });
  console.log("holding emulation on " + pg.url);
  ws.onclose = () => process.exit(0);
  setInterval(() => {}, 1 << 30);
})();
