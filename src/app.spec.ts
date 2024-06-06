import { expect, test } from "bun:test";
import request from "supertest";
import { app } from "./app";

test("/", () => {
  request(app)
    .get("/")
    .expect(200)
    .expect("Hello World!")
    .end((err, res) => {
      if (err) throw err;
    });
});
