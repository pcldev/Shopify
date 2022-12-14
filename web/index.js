// @ts-check
import { join } from "path";
import fs from "fs";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import { setupGDPRWebHooks } from "./gdpr.js";
import productCreator from "./helpers/product-creator.js";
import { BillingInterval } from "./helpers/ensure-billing.js";
import { AppInstallations } from "./app_installations.js";
import { Page } from "@shopify/shopify-api/dist/rest-resources/2022-07/index.js";
const USE_ONLINE_TOKENS = false;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

const DB_PATH = `${process.cwd()}/database.sqlite`;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME: process.env.HOST.split("://")[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
});

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/api/webhooks",
  webhookHandler: async (_topic, shop, _body) => {
    await AppInstallations.delete(shop);
  },
});

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
  required: false,
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  // chargeName: "My Shopify One-Time Charge",
  // amount: 5.0,
  // currencyCode: "USD",
  // interval: BillingInterval.OneTime,
};

// This sets up the mandatory GDPR webhooks. You???ll need to fill in the endpoint
// in the ???GDPR mandatory webhooks??? section in the ???App setup??? tab, and customize
// the code when you store customer data.
//
// More details can be found on shopify.dev:
// https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
setupGDPRWebHooks("/api/webhooks");

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  billingSettings = BILLING_SETTINGS
) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app, {
    billing: billingSettings,
  });

  // Do not call app.use(express.json()) before processing webhooks with
  // Shopify.Webhooks.Registry.process().
  // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
  // for more details.
  app.post("/api/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (e) {
      console.log(`Failed to process webhook: ${e.message}`);
      if (!res.headersSent) {
        res.status(500).send(e.message);
      }
    }
  });

  // All endpoints after this point will require an active session
  app.use(
    "/api/*",
    verifyRequest(app, {
      billing: billingSettings,
    })
  );

  app.get("/api/products/count", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });

  app.get("/api/products/create", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    let status = 200;
    let error = null;

    try {
      await productCreator(session);
    } catch (e) {
      console.log(`Failed to process products/create: ${e.message}`);
      status = 500;
      error = e.message;
    }
    res.status(status).send({ success: status === 200, error });
  });

  // All endpoints after this point will have access to a request.body
  // attribute, as a result of the express.json() middleware
  app.use(express.json());

  app.get("/api/pages", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const result = {};
    try {
      let pageData = await Page.all({
        session: session,
        // ...req.query,
      });

      console.log("================================", req.query);
      const page = +req.query.page;
      const limit = +req.query.limit;
      const queryValue = req.query.queryValue;
      const sort = req.query.sort;
      const result = {};
      let pageLength = Math.ceil(pageData.length / limit);
      if (queryValue) {
        // @ts-ignore
        pageData = pageData.reduce((acc, ele) => {
          // @ts-ignore
          return ele.title.toLowerCase().includes(queryValue.toLowerCase())
            ? [...acc, ele]
            : acc;
        }, []);
        pageLength = Math.ceil(pageData.length / limit);
      }

      switch (sort) {
        case "newest":
          pageData.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
          });
          break;
        case "oldest":
          pageData.sort((a, b) => {
            return new Date(a.updated_at) - new Date(b.updated_at);
          });
          break;
        case "az":
          pageData.sort((a, b) => {
            return a.title.localeCompare(b.title);
          });
          break;
        case "za":
          pageData.sort((a, b) => {
            return b.title.localeCompare(a.title);
          });
          break;
        default:
          pageData.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
          });
          break;
      }
      if (page && limit) {
        const startPage = (+page - 1) * +limit;
        const endPage = +page * +limit;
        if (+endPage < pageData.length)
          result.next = {
            page: +page + 1,
            limit: +limit,
          };
        if (+startPage > 0)
          result.previous = {
            page: +page - 1,
            limit: +limit,
          };

        pageData = pageData.slice(startPage, endPage);
      }
      console.log("================================", pageData);
      result.pageData = pageData;
      result.pageLength = pageLength;
      console.log(result);
      res.status(200).json({ result });
    } catch (e) {}
  });

  app.get("/api/pages/:yau", express.json(), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    console.log(req.params);
    try {
      const pageData = await Page.find({
        session: session,
        id: req.params.yau,
      });
      res.status(200).json({ pageData });
    } catch (err) {}
  });

  app.post("/api/pages", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    try {
      const pageData = new Page({
        session: session,
      });
      pageData.title = req.body.title;
      pageData.body_html = req.body.body_html;
      await pageData.save({
        update: true,
      });
      res.status(200).json({ pageData });
    } catch (e) {}
  });

  app.put("/api/pages/:id", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    try {
      const pageData = new Page({
        session: session,
      });
      pageData.id = +req.params.id;
      pageData.title = req.body.title;
      pageData.body_html = req.body.body_html;
      await pageData.save({
        update: true,
      });
      res.status(200).json({ pageData });
    } catch (err) {}
  });

  app.delete("/api/pages/:id", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    try {
      const pageData = await Page.delete({
        session: session,
        id: req.params.id,
      });

      res.status(200).json({ pageData });
    } catch (err) {}
  });

  app.use((req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${encodeURIComponent(
          shop
        )} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  if (isProd) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
  }

  app.use("/*", async (req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (!shop) {
      res.status(500);
      return res.send("No shop provided");
    }

    const appInstalled = await AppInstallations.includes(shop);

    if (shop && !appInstalled) {
      console.log("========", shop);
      res.redirect(`/api/auth?shop=${encodeURIComponent(shop)}`);
    } else {
      const fs = await import("fs");
      const fallbackFile = join(
        isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
        "index.html"
      );
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(fallbackFile));
    }
  });

  return { app };
}

createServer().then(({ app }) => app.listen(PORT));
