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

test("/metadata", () => {
  request(app)
    .get("/metadata")
    .expect(200)
    .expect("Content-Type", /json/)
    .end((err, res) => {
      if (err) throw err;
      expect(res.body.gitSHA).toBeString();
    });
});
