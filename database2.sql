--create all tables for project
CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"ui_color" varchar(6) NOT NULL DEFAULT '73F450',
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "rooms" (
	"id" serial NOT NULL,
	"game_id" int NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" text NOT NULL,
	"description" varchar(1024) NOT NULL,
	"exits" json NOT NULL,
	"interactables" json,
	CONSTRAINT "rooms_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "items" (
	"id" serial NOT NULL,
	"game_id" int NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1024) NOT NULL,
	CONSTRAINT "items_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "rooms_items" (
	"id" serial NOT NULL,
	"game_id" int NOT NULL,
	"room_id" int NOT NULL,
	"item_id" int NOT NULL,
	CONSTRAINT "rooms_items_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "saves" (
	"id" serial NOT NULL,
	"save" JSON NOT NULL,
	"user_id" int NOT NULL,
	"timestamp" timestamp NOT NULL,
	"game_id" int NOT NULL,
	CONSTRAINT "saves_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);

CREATE TABLE "games" (
	"id" serial NOT NULL,
	"name" varchar(256),
	CONSTRAINT "games_pk" PRIMARY KEY ("id")
);

-- CREATE TABLE "games_rooms" (
-- 	"id" serial NOT NULL,
-- 	"game_id" int NOT NULL,
-- 	"room_id" int NOT NULL,
-- 	CONSTRAINT "games_rooms_pk" PRIMARY KEY ("id")
-- );


-- ALTER TABLE "games_rooms" ADD CONSTRAINT "games_rooms_fk0" FOREIGN KEY ("game_id") REFERENCES "games"("id");
-- ALTER TABLE "games_rooms" ADD CONSTRAINT "games_rooms_fk1" FOREIGN KEY ("room_id") REFERENCES "rooms"("id");
ALTER TABLE "rooms_items" ADD CONSTRAINT "rooms_items_fk0" FOREIGN KEY ("game_id") REFERENCES "games"("id");
ALTER TABLE "rooms_items" ADD CONSTRAINT "rooms_items_fk1" FOREIGN KEY ("room_id") REFERENCES "rooms"("id");
ALTER TABLE "rooms_items" ADD CONSTRAINT "rooms_items_fk2" FOREIGN KEY ("item_id") REFERENCES "items"("id");

ALTER TABLE "saves" ADD CONSTRAINT "saves_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "saves" ADD CONSTRAINT "saves_fk1" FOREIGN KEY ("game_id") REFERENCES "games"("id");

ALTER TABLE "rooms" ADD CONSTRAINT "rooms_fk0" FOREIGN KEY ("game_id") REFERENCES "games"("id");
ALTER TABLE "items" ADD CONSTRAINT "items_fk0" FOREIGN KEY ("game_id") REFERENCES "games"("id");

insert into games ("name")
VALUES('cloud-ques-2');

--generate all rooms for initial database
insert into rooms ("name", "game_id", "description", "image", "interactables", "exits")
VALUES('car',
2,
'You are in your car. You pulled to the side of the road about a half mile south of your childhood home. There is a note in the passenger seat and a photograph stuck to the dashboard.',
'=?WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$?+-,,,,,,,,\n=?WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$$?=,,,,,,,,,\n=!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWW$$!--,,,,,,,,\n=!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW:---,,,,,,,\n=;?WWWWWWWWWWWWWWWWWWWWWWWWWW?$WWW;,------,,,\n=+!$WWW$$$$$$$$$$$$$$$$$??$$!!!?!;:,,,,,,,,,,\n-=;!!!!!!!!!!!!!!!!!!!!!!!!;;;;;;;:----===--,\n,=::;;;!????$??$$$$$$$$$$$$!;;;;:;;:;:+:==:+=\n.-+::;:;;;;;!?!!!$$$??????!;;;;::::::;;;:;;++\n.,=+;!!!????$$$$$$$$$$$???!!!!!!!!::;;;;;;;;;\n,,-+;$$$$$$$$$$$$$$$$$$$$$$??!???????!!!!;;;;\n,.,=:$$$$$$$$$$$$$$$$$$$$$$$$$??!!!!!!???????\n,,,=+?$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??!!!;!!!!\n,,.-=;$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??!!;;\n,,,,=+$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??\n,,..-=;$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n--..,=+?$$$$$$$$?$?????!!;;;::;;;;!!!????????\n--.,,,=+;!???;+=-:=--=+:;!!!!!??!!!!!;::::;::\n--.,,,-=:!!:-,...,,...,,=;?$$$$$$$$???;;;;;;;\n=-,,.-,=?;=,.,,,,,,,,,,,.,=!??$!=--,,,,,-=::;\n=-,,.,-:+-.--,,,,,,,,,,,-,,,++:=.,,-=---.,-,=\n=-,,,.=+-.=!,.,,,,,,,,,.=-..,-+-.,-,-,,,,,,,,\n=-,,.-+,,,==,,,,,--,,-,,,=,..,+=,,-+===-,,-,-\n,,,,,+-..-=-.,,,,--,--,,,+:,..,-,,---,,,,,,,,\n-=,,==.,-+:=.,,-.,,.--,,,;$+..,,,,-,,,.,,.,,,\n-,.,+,,;$$$:.,--,,,,,,,,,!?!-,,,,,,......,-==\n,,.-=.,=!$$;..=+::::+=,,-!!?;+,-,======++::;;\n,,.=-,==+$$!,=::+:++===--;;;;!==,;!!!!!!!!;;;\n,,,=,,,-=:!!====----+=--=+::;;+=-=;:::+:+:=-:\n,,,=.--,----===,....,=-..,==+===-,+++==+++==+\n,.,=-===-,,==+,..-=,.,=,,,--,,,,.,---,,,,,,-=\n,.,===-,,,,=+=.,+=++,,:-.,,..,,,,,,,,.,,,,.,+\n,.,==--,,,,=+-.=:==---;=.,,,,,,,,,,,,,,,,,,,=\n,.,==-,,,,,=+,.=+==-,-:=.,,,,,,,,.,,,,,,,,,.,\n,.=++,,,,,,-=-.,----,=:-.,,,,,,..-,,,,,,,,,,.\n.+!!!-.,,,,.,=-,,,,,.=:,,,,,,,,=,+:.,,,,,,,,,\n:?!?!-.,,,,,.,=,,,,,.==.,,,,,.-?;=!=.,,,,,,,,\n??!?;,.,,,,,,.,=-,,,--.,,,,,,,-!!:!!-.,,,,.,,\n??!!+,,,,,,,,,.,----,.,,,,,.,,-:!:;;=.,,,,-,,\n!??!:,,,,,,,,,,......,,,,,,,,-,=!:;;+,,,.,-,,\n;!!!+,,,,,,,,,,+,.,,,+,,,,,-,-.=!;;:+-------,\n;;;:+,,,,,,,,,.:=.,.-:.,,,,,-,.:;::++,--,=-,,\n;;+++,.,,,,,,,.+=.,.-:.,,.,-,.,:;++++,--,,-,,\n;;++=,,,,,,,,.,:+.,.=:-,,,-,.,,:;:+++,,--,,,,\n:++=,.,,,,,,,,=!:.,.+!:,--,.,,.+;;+++-.,,,,-,\n',
'{"interactables": [
{
    "name": ["note", "letter"],
		"display_name": "note",
    "description": "It''s from dad... \n\"Hey kid, our data center went down and we need you to deploy our calculator app to the cloud! The entire world is depending on those basic calculations!\"\nSounds pretty serious."
},
{
    "name": ["photo", "photograph"],
	"display_name": "photo",
    "description": "You see a bald man sitting on a throne made out of money. The image is unsettling and you can''t help but feel like his company controls most of the internet."
}
]}',
'{"exits": ["road", "basement", "bedroom", "closet", "shed"]}');


--create items in items db
insert into items ("name", "game_id", "description")
VALUES('wires',
2,
'Some extra copper wiring. Could probably use this on the generator to get it up and running again.'),
('calculator',
2,
 'A basic calculator! This should do the trick, just have to get this uploaded to the cloud.'),
('donut',
2,
'A beautifully crafted and somehow still fresh donut covered in sprinkles. Looks like it''s got raspberry filling.');

-- relational keys for putting items into rooms
insert into rooms_items (room_id, item_id, game_id)
VALUES
(1, 3, 2),
(1, 1, 2),
(1, 2, 2);



