import { takeLatest, put, select } from "redux-saga/effects"

function* updateLocation(action) {
    yield put ({type: 'SET_CURRENT_ROOM', payload: action.payload})
}

function* gameStateSaga() {
    yield takeLatest("UPDATE_LOCATION", updateLocation);
}

export default gameStateSaga;

const exampleState =
{
    eletricity: true,
    inventory: [],
    location: "car",
    rooms: [
        {
            room_name: "car",
            room_image: "=?WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$?+-,,,,,,,,\n=?WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW$$?=,,,,,,,,,\n=!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWW$$!--,,,,,,,,\n=!$WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW:---,,,,,,,\n=;?WWWWWWWWWWWWWWWWWWWWWWWWWW?$WWW;,------,,,\n=+!$WWW$$$$$$$$$$$$$$$$$??$$!!!?!;:,,,,,,,,,,\n-=;!!!!!!!!!!!!!!!!!!!!!!!!;;;;;;;:----===--,\n,=::;;;!????$??$$$$$$$$$$$$!;;;;:;;:;:+:==:+=\n.-+::;:;;;;;!?!!!$$$??????!;;;;::::::;;;:;;++\n.,=+;!!!????$$$$$$$$$$$???!!!!!!!!::;;;;;;;;;\n,,-+;$$$$$$$$$$$$$$$$$$$$$$??!???????!!!!;;;;\n,.,=:$$$$$$$$$$$$$$$$$$$$$$$$$??!!!!!!???????\n,,,=+?$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??!!!;!!!!\n,,.-=;$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??!!;;\n,,,,=+$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$??\n,,..-=;$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n--..,=+?$$$$$$$$?$?????!!;;;::;;;;!!!????????\n--.,,,=+;!???;+=-:=--=+:;!!!!!??!!!!!;::::;::\n--.,,,-=:!!:-,...,,...,,=;?$$$$$$$$???;;;;;;;\n=-,,.-,=?;=,.,,,,,,,,,,,.,=!??$!=--,,,,,-=::;\n=-,,.,-:+-.--,,,,,,,,,,,-,,,++:=.,,-=---.,-,=\n=-,,,.=+-.=!,.,,,,,,,,,.=-..,-+-.,-,-,,,,,,,,\n=-,,.-+,,,==,,,,,--,,-,,,=,..,+=,,-+===-,,-,-\n,,,,,+-..-=-.,,,,--,--,,,+:,..,-,,---,,,,,,,,\n-=,,==.,-+:=.,,-.,,.--,,,;$+..,,,,-,,,.,,.,,,\n-,.,+,,;$$$:.,--,,,,,,,,,!?!-,,,,,,......,-==\n,,.-=.,=!$$;..=+::::+=,,-!!?;+,-,======++::;;\n,,.=-,==+$$!,=::+:++===--;;;;!==,;!!!!!!!!;;;\n,,,=,,,-=:!!====----+=--=+::;;+=-=;:::+:+:=-:\n,,,=.--,----===,....,=-..,==+===-,+++==+++==+\n,.,=-===-,,==+,..-=,.,=,,,--,,,,.,---,,,,,,-=\n,.,===-,,,,=+=.,+=++,,:-.,,..,,,,,,,,.,,,,.,+\n,.,==--,,,,=+-.=:==---;=.,,,,,,,,,,,,,,,,,,,=\n,.,==-,,,,,=+,.=+==-,-:=.,,,,,,,,.,,,,,,,,,.,\n,.=++,,,,,,-=-.,----,=:-.,,,,,,..-,,,,,,,,,,.\n.+!!!-.,,,,.,=-,,,,,.=:,,,,,,,,=,+:.,,,,,,,,,\n:?!?!-.,,,,,.,=,,,,,.==.,,,,,.-?;=!=.,,,,,,,,\n??!?;,.,,,,,,.,=-,,,--.,,,,,,,-!!:!!-.,,,,.,,\n??!!+,,,,,,,,,.,----,.,,,,,.,,-:!:;;=.,,,,-,,\n!??!:,,,,,,,,,,......,,,,,,,,-,=!:;;+,,,.,-,,\n;!!!+,,,,,,,,,,+,.,,,+,,,,,-,-.=!;;:+-------,\n;;;:+,,,,,,,,,.:=.,.-:.,,,,,-,.:;::++,--,=-,,\n;;+++,.,,,,,,,.+=.,.-:.,,.,-,.,:;++++,--,,-,,\n;;++=,,,,,,,,.,:+.,.=:-,,,-,.,,:;:+++,,--,,,,\n:++=,.,,,,,,,,=!:.,.+!:,--,.,,.+;;+++-.,,,,-,\n",
            room_description: "You are in your car. You pulled to the side of the road about a half mile south of your childhood home. There is a note in the passenger seat and a photograph stuck to the dashboard.",
            room_exits: [
                "road"
            ],
            room_interactables: [
                {
                    note: {
                        "name": "note",
                        "description": "It's from dad... \n\"Hey kid, our data center went down and we need you to deploy our calculator app to the cloud! The entire world is depending on those basic calculations!\"\nSounds pretty serious."
                    }
                },
                {
                    photo: {
                        "name": "photo",
                        "description": "You see a bald man sitting on a throne made out of money. The image is unsettling and you can't help but feel like his company controls most of the internet."
                    }
                },
                {
                    photograph: {
                        "name": "photo",
                        "description": "You see a bald man sitting on a throne made out of money. The image is unsettling and you can't help but feel like his company controls most of the internet."
                    }
                }
            ],
            items: ["item","item2"]
        },
        {
            name: "road",
            description: "You are on the road that leads to your childhood home. Everything seems to be smaller than you remember. The dirt road leading up to your house is inviting you in. Better get moving, you have a calculator to save.",
            image: "!!!!!!;;:::;;;!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!?;+==::+==::!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n???;===+:+==+:::!????????????????????????????\n???+===::==+::::;????????????????????????????\n??!===+::===::::;????????????????????????????\n??!====::+==++::;???????????????!????????????\n???===+++:+++++=+!$???????????;+=+:;!!??$$???\n??$+=+:::::::+=+::?$?????????$:,-=--=++::::;$\n$$$:=+:::::::+=::+;$$$$$$$$$$?---==-=+++===+;\n$$$:=+=+:::::+==::;??!!!??$$$+----=++++++++++\n$$?=+:+:+++++++++++:;!!;;!!?!==-,---=+==++==+\n!!;=+::+=-==-==+::+++:;!!!;!:-+=,-,,,=-,=+==+\n!!+==+==-======++::;::::;!;;=,==,-,-==+=====-\n!!;======-======+;!!!!!!;!!!=-=----=======--,\n!!!:===========+;!!!!!!!!;:::--,,,----=--=---\n!!;;:++-===++;;!!!!!!!!!!:;::--,,,,--,-===+==\n!;;;!!!=;;=;?!!!!;!!!!!::++++--,,,,---,,---=+\n::+:+:==+:=+:::;!;;!!;!:+++==--,,,-,---,-----\n;;;;::++++++++++;:+;:;;!;;;:+====--,---,----=\n;;!!!!!!!!;++;;;;;::+;;;;;;;;;;;;:+=--=------\n;;;!!!!!!!+-:;;!!;;;:;;;;;+=;;;;;!!;;;;;;;;:+\n;;;!;;;;!!;;!;;!;;!!;;;!!;::;!!!!;!;;;!!;!;!!\n!!!;;;;;;;;;;;;;;;!!!!;;;!!!!!;;;!!!;;;:=+:!!\n!!;;!;;;;;;;;;;;:;;!!!!!;;;;!;;;;;;;;;;+--:;;\n;;;;;;;;;;;;;;;;;;;;!!!!!!;;;;!!;;;;;!;;:;;;!\n;;;;::;;;;;;;;;!!!;!;!!!!!!!!!!;;!;;!;;;!;;;;\n!!!;:+:!:::;!!!!!;;;;!;;;;!!!!!!!!!;!!!!;;;;;\n!!!;++:!:=+;!;!!;;;;:;!!;;;;!!!!!!!!!;;!!;;;;\n!!!;:::::::;;;;;;!!!!;;;!!:;;;;!!!!!!!!!!!!!;\n;;;;;;;;;;!!;!!;;;!!;;;;::=;+:;;;!!!!!!!!!!!!\n;;;;;;;;;;;::::::+::;;:;;=-==!!;;;!!!!!!!!!!!\n++;;;;;;:::+=========+;;;+--+:;!!;;;;!!!!!!!!\n=:;;;:::;;;:++::+:;:+++::++:;:;;!!;;;;;!!!!!!\n=+:++=+:;:+:::::+;:::+::++=++:;;;!!!;;;;;!!!!\n=======++=+;::++=:+++==+======:;;;;!!;;;;;;!!\n==============-----=----=====-:;;;:;!!!;;;;;;\n+-==-,-=-=======-=====-,,-===-+;;;;;;!!!;;;;;\n===,,-,,-=======-====-,-=,--===;;;;;;;;!!!;;;\n==-.+;+,-------------,,:;=-++::;;;;;;;;;;!!!;\n++=,:;+,========+++++=,::-=::;!!!!!!!!!!!!!!!\n+++-,-,=++++++++++++++-,--++++;!!!!!!!!!!;;;;\n:::::+:::::::::::::;;;;::;;;;;;;;;;;;;;;;;;;;\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!;!!!;\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
            exits: [
                "car",
                "house"
            ],
            interactables: [],
            items: []
        },
        {
            name: "house",
            description: "Man, this brings back memories. The paint is peeling off the side of the house. Seems like nobody's been here for quite some time.",
            image: "??????????????????$?:------------------------\n?????????????????$!=-------------------------\n??????????$$$$$?$!---------------------------\n??????????$$$$$$$:-,,,,,,,-------------------\n??????????$$$$$$$$$;+,...,,,,,,,,------------\n??$$$$$$$$$$$$$$$$$$$$!:-.,,,,,,,,,,,,,,-,,,,\n?$$$$$$$$$$$$$$$$$$$$$$$!=,,...,,,,,,,,,,,,,,\n????????????$$$$$$$$$$$$$$?!;+=-,,,,,,.,,,,,,\n?????????????????$$$$$$$$$$$$$$$?!;:--=-,,,,.\n????????????????$$$$$$$$$$$$$$$$$$$$?+;??!;;:\n??????????????$$$$$?$$$$$$!!$$$$$$$$$$::$WWWW\n????????????$$$$$$+=::;;!!+:$$$$$$$$$$$;+!$$W\n???????????$$$$$$?--====+++;$?:;;?$$$$$$!+:$W\n???????????$$$$$$:-=-======;$?+++;$$$$$$$$++!\n??????????$$$$$$?-==------=;$?::::?$$$$$$$$;=\n??????????$$?$$$;-=+=-=====;$?::::;$$$$$$$$W?\n???????????$$$$$==+:+-+++++++:+::::?$$$$$$$$W\n????????$$$$$$$!,+::+====---+++::::;$$$$$$$W$\n??????$$$$$$$$$+-+++++---,,=+++:::::?$$$$$$$$\n?????????????$?-=+==++=---,;:++:::::;$$$$$WWW\n????????$$$$$$:,++++++=-=-=!;++::::::?$WWWWWW\n!!!!!!!!!!!??!--=++++=====+::+++:::::;???????\n:::::::::::::+,======-===---==========+;!!!!!\n++++++::::;;;:====++==-=++==--==========+:!!!\n++::;;!!!!!!!!:-=+=+++==+++++=+;;::::::::::!;\n:;;;;;;;;;;;;;+=+++++++=+++++:;!!::::::::;:;:\n;;;;::::::::::+=+++++++=:?!?!?;!!!!!?!:::;:::\n;;::::::::::::+=++++++++:!!???;;!!;!?!:+::::+\n:::::+:+++++++======++++:!:;!!;;;!:;?!:+::+++\n+++==-=-==+++++---+!:++++:++;;;;;!:;!;;;!!:+;\n+=======++::::+==+!!:++:+++:!!;;!!!!!!!!!?:+!\n==+++++:::::::::::;;!!!???????!???????????!;!\n==========+::;;!!!!!???????????????????!!!!!!\n===-----==+++:::;;!!???????????!!!!!!!!!!!;;;\n==------=======++::::::;;;;::++++++++++++====\n=-------====+:::::::::::+====================\n=------==+::::::::::::+=====================,\n-----=+::::::::::::+==================-+====-\n--==::;;;;;;::;::+==================--,+====-\n=+::::::::::;::+===========,,,======--,======\n::::::::::::+==============,,,-=====-,,-+===-\n::::::::::+================-,,-======,,,--,,,\n::::::::+=-================-,,-====--,,,,,,,-\n+++++:+=-===================,,,--,,,,,,,--===\n+++++=--===================-,,,,,,,,--,,-====",
            exits: [
                "shed",
                "front door",
                "road"
            ],
            interactables: [],
            items: []
        },
        {
            name: "front door",
            description: "change later",
            image: ",,,,..,,,,,,,,,,,,,,.,.,,.........,,,,..,,...\n.,,,..,,,,,,,,,,,,,,,..,.........,,,.......,.\n,.,,,.,,,,,,,,,,,,,,,,..,,,..,,.,,,.,,.,.,,,.\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,\n,,,,,------------------------------------,--,\n---=========================================-\n==-=============================-==========--\n===============,,,,,,,,,,,,,,,-=-==========-=\n===============,,,,,,,,,,,,,,,-=--===========\n+++++++;+======,,,,,,,,,,,,,,,-=-===+;==+++++\n--==---;=======,,,,,,,,,,,--,,-=-===+;--===--\n++::+++;=====+=,,,,---=--,--,,-+-====;==+::++\n::::+::;=====+=,-,,-,-==-,--,,-+-====;=+::;::\n::;::::;=====+=,-,,,,,-,,,--,,-+-====;=+::;::\n::;;:::;=-===+=,-,----------,,-+--=-=;=+:;;::\n::;;:::;=-===+=,-------------,-+--===;+::;;;:\n:;;;;::;=====+=,------,,--,--,-+-,-=+;+:;;;;:\n;!!!;::!=====:=,--,,,,,,,,--,,-+-,-==;+:;!!!;\n;!!!!;;!=====:=,--,---,--,--,,-+-===+;:;!!!!;\n!!?!!;;!+====:=,--,-----,,-----+-===+;:;!!!!!\n!???!!;!+====+=,--,----,-,--,,-+-===+;:;????!\n?????!;!=-===+=,--,---------,,=+--=-=;:!?????\n??????;!=====+=,------------,,=+-===+;;!?????\n!!?!!!;!=====+=,--------------=+-===+;;!!!?!!\n++++++++-====+=,--,,,----,----=+-====++++++++\n======--=====+=,--,,,,,,,,----==-=====--=====\n===============,--,-,,,,,,----==-============\n===============,--,-,,,,,,----==-============\n===============,--,-,,,,,,----==-============\n===============,--------------==-============\n===============,--------------==-============\n--------------,------------------------------\n-------------,.,,,,,,,,,,,,,,,,,-------------\n-------------,,------------------------------\n--------------,------------------------------\n=------------,.,,,,,,,,,,,,,,,,,-------------\n====------==+=+++++++++++++++++++------------\n++++++::;;!!$$?!!!!!!!!!!!!!!!?$$!+::++::::::\n+++++++::::;!!;;;;;;!!!!!!!!!!!?$$!;!!!!!!!!!\n:;;:::++++:;:::::::;!??!!???????$$?!;;;;;::;;\n++++++++=++:::;;;;!!!!!;;!!!;;;;;;;;:;;;::::+\n=============+++:::::::::::::::::::::++++++==\n==============++:::::::::::::::::::++========",
            exits: [
                "house"
            ],
            interactables: [],
            items: []
        }
    ]
}