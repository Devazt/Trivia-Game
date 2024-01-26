import { Server, Socket } from "socket.io";
import { API } from "../lib/API";
import { v4 as uuidv4 } from 'uuid';
import { IQuest } from "../interface/IQuest";
import { Lobby } from "../interface/Lobby";

const fetchQuestions = async () => {
    const res = await API.get("/api/v1/get-questions", {
        headers: { "ngrok-skip-browser-warning": "true" },
    });

    if (res.data.code === 200) {
        const allQuestions: IQuest[] = res.data.data;
        const uniqueQuestions =  Array.from(new Set(allQuestions.map(question => question.id)));
        const randomUniqueQuestions = shuffleArray(uniqueQuestions).slice(0, 5);
        const selectedQuestions = allQuestions.filter(question => randomUniqueQuestions.includes(question.id));

        return selectedQuestions;
    }
    return [];
};

function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let lobbyGame = getLobby();
export let lobbies = {
    [lobbyGame.roomId]: {
        ...lobbyGame,
    },
};

export default async function lobby(io: Server, socket: Socket) {
    socket.on("joinLobby", async message => {
        let currentId = "";

        if (!message.name || !message.avatar) {
            socket.emit('joinLobby', {
                message: "Please provide name and avatar",
            });
            return;
        }

        const lobbyLength =  Object.keys(lobbies).length;
        let currentLength = 1;

        for (const key in lobbies) {
            console.log("keyID:", key, 'has', lobbies[key].users.length, "players");
            if (lobbies[key].users.length === 4) {
                if (lobbyLength - currentLength > 0) {
                    currentLength += 1;
                    continue;
                } else {
                    console.log('Lobby is full, creating new lobby');
                    const newLobby = getLobby();
                    lobbies[newLobby.roomId] = {
                        ...newLobby,
                    };
                    currentId = newLobby.roomId;
                    break;
                }
            }
            currentId = key;
        }

        lobbies[currentId].users.push({
            name: message.name,
            avatar: message.avatar,
            email: message.email,
            id: socket.id,
            score: 0,
        });

        console.log("Current lobby: ", currentId, "has", lobbies[currentId].users.length, "players");
        console.log("List Players: ", lobbies[currentId].users.map(user => {
            return {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                email: user.email,
            }
        }));

        if (lobbies[currentId].questions.length == 0) {
            lobbies[currentId].questions = await fetchQuestions();
        }

        

        socket.join(lobbies[currentId].roomId);
        const interval = setInterval(() => {
            if (lobbies[currentId].timeout < 0) {
                clearInterval(interval);
                return;
            }

            if (lobbies[currentId].timeout <= 3) {
                if (lobbies[currentId].users.length < 4) {
                    lobbies[currentId].users.push({
                        name: `CPU-${lobbies[currentId].users.length + 1}`,
                        avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                        email: "bot@flaticon.com",
                        id: Math.random().toString(),
                        score: 0,
                    });
                }
            }
            if (lobbies[currentId].users.length == 4) {
                clearInterval(interval);
                io.to(lobbies[currentId].roomId).emit('joinLobby', 'start');
            }
            
            io.to(lobbies[currentId].roomId).emit('joinLobby',
            lobbies[currentId].users,
            lobbies[currentId].timeout,
            lobbies[currentId].roomId
            );
            lobbies[currentId].timeout -= 1;
        }, 1000)
    });
}

export function getLobby(): Lobby {
    return {
        isEmited: false,
        isFinished: false,
        questions: [],
        timeout: 10,
        users: [],
        roomId: uuidv4(),
    }
}