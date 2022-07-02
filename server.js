const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
const fs = require("fs");
const util = require("util");
const formidable = require("formidable");
const copyFile = util.promisify(fs.copyFile);
const { exec } = require("child_process");

server.use(middlewares);

const INTERCEPTED_METHODS = ["PUT", "PATCH", "POST"];
server.use(jsonServer.bodyParser);

server.use((req, _res, next) => {
  if (
    INTERCEPTED_METHODS.includes(req.method) &&
    Object.keys(req.body).length
  ) {
    next();
    return;
  }

  if (req.method == "DELETE") {
    const removableIconName = "images/" + req.body.name;
    // console.log(removableIconName);
    try {
      fs.unlinkSync(removableIconName);
      console.log("server DELETE done");
    } catch (err) {
      console.error(err);
    }
    next();
    return;
  }

  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    if (INTERCEPTED_METHODS.includes(req.method) && Object.keys(files).length) {
      const file = Object.values(files)[0];
      const fileName = Date.now() + path.extname(file.originalFilename);
      const basePath = "images/";
      const dest = path.join(basePath, fileName);
      fs.mkdirSync(basePath, { recursive: true });
      await copyFile(file.filepath, dest);

      const imgFiledName = Object.keys(files)[0];
      // const pathToImg = basePath + fileName;
      const pathToImg = fileName;
      req.body[imgFiledName] = pathToImg;
    }

    // json-server очікує що усі дані будуть знаходитись в полі `req.body`
    // а так як ми використовуємо мідлвер `formidableMiddleware` який також прcить наші поля
    // та поверає їх в `req.fields` то їх потрібно перодавати вручну далі у `req.body`
    req.body = {
      ...req.body,
      ...fields,
    };
    next();
  });
});

server.post('/generete', () => {
  exec("npm run generetePage", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });
});

server.use(router);

server.listen(3333, () => {
  console.log("JSON Server is running");
});
