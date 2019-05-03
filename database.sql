
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "storage"(
"id" SERIAL PRIMARY KEY,
"user_id" INT REFERENCES "user",
"podbean" VARCHAR,
"wordpress" VARCHAR,
"blog_id" VARCHAR (200),
"blog_url" VARCHAR (200)
);
CREATE TABLE "current_user"(
"id" SERIAL PRIMARY KEY,
"current" INT

);

ALTER TABLE "storage" ADD "blog_id" VARCHAR (200);
ALTER TABLE "storage" ADD "blog_url" VARCHAR (200);