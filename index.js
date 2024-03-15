const Koa = require("koa");
const { bodyParser } = require("@koa/bodyparser");
const service = require("./service");
const loadConfig = require("./config/configLoader");
const config = loadConfig();
const app = new Koa();
app.use(async (ctx, next) => {
  if (ctx.request.url !== "/translate") {
    ctx.response.status = 404;
    ctx.body = "error url, only /translate is provided";
    return;
  }
  if (ctx.request.method !== "POST") {
    ctx.status = 405;
    ctx.body = "error method, only POST is provided";
    return;
  }
  await next();
});
app.use(
  bodyParser({
    enableTypes: ["json"],
    onError(err, ctx) {
      ctx.throw(422, "error body type, should be json");
    }
  })
);
app.use(async (ctx, next) => {
  const validationResult = await service.validateRequestBody(ctx);
  if (validationResult.isValid) {
    await next();
  } else {
    ctx.status = 400;
    ctx.body = { message: validationResult.error };
  }
});
app.use(async (ctx) => {
  const result = await service.translate(ctx.request.body);
  ctx.status = 200;
  ctx.response.type = "application/json";
  ctx.response.body = result;
});
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log("server is running at http://localhost:" + PORT);
});
