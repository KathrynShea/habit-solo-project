
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "public.habits" (
	"id" serial NOT NULL,
	"habit_name" varchar(255) NOT NULL,
	"color_id" integer NOT NULL,
	"shape_id" integer NOT NULL,
	"start_date" DATE NOT NULL,
	"end_date" DATE NOT NULL,
	"user_id" integer NOT NULL,
	"is_tracked" BOOLEAN DEFAULT 'TRUE',
	"is_completed" BOOLEAN DEFAULT 'FALSE',
	CONSTRAINT "habits_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public.awards" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"habit_id" integer NOT NULL,
	CONSTRAINT "awards_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public.habit_entries" (
	"id" serial NOT NULL,
	"habit_id" integer NOT NULL,
	"date" DATE NOT NULL,
	"was_completed" BOOLEAN NOT NULL,
	CONSTRAINT "habit_entries_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "public.habits" ADD CONSTRAINT "habits_fk2" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "public.awards" ADD CONSTRAINT "awards_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "public.awards" ADD CONSTRAINT "awards_fk1" FOREIGN KEY ("habit_id") REFERENCES "public.habits"("id");
ALTER TABLE "public.habit_entries" ADD CONSTRAINT "habit_entries_fk0" FOREIGN KEY ("habit_id") REFERENCES "public.habits"("id");







