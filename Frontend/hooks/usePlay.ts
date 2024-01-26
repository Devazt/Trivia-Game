import { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { initializeSocket } from "../utils/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { UserInfo } from "../interface/User";
import { Questions } from "../interface/Questions";

export default function usePlay() {
  const socket = initializeSocket();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [roomId, setRoomId] = useState("");
  const [userAnswer, setUserAnswer] = useState([]);
  const [user, setUser] = useState<UserInfo & { score: number }>({
    email: "",
    name: "",
    avatar: "",
    id: 0,
    score: 0,
    diamond: 0,
  });

  const [selectOption, setSelectOption] = useState(null);
  const [question, setQuestion] = useState<Questions>({
    image_question: "...",
    A: "",
    B: "",
    C: "",
    D: "",
    answer: "",
    time: 0.01,
  });

  const [index, setIndex] = useState(0);

  const choices = ["A", "B", "C", "D"];

  const getAuth = async () => {
    const token:any = await AsyncStorage.getItem('user');
    const decode = jwtDecode(token) as UserInfo
    setUser((prev) => ({ ...prev, ...decode}));
  }

  const handleAnswer = (selected:any, option:any) => {
    setSelectOption(selected);

    socket.emit('answer', {
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      answer: option,
      roomId,
    });
  }

  const getLobby = async () => {
    const roomId:any = await AsyncStorage.getItem('roomId')
    setRoomId(roomId);
  }

  useEffect(() => {
    getLobby();
    getAuth();
  }, [isFocused]);

  useEffect(() => {
    if (question.time === 0 && roomId !== "") {
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        socket.emit('getQuest', {index: index + 1, roomId});
        if (selectOption == question.answer) {
          socket.emit('user', {
            score: 10,
            roomId,
          });
        }
      }, 3000)
    }
  }, [question.time, roomId])

  useEffect(() => {
    if (roomId !== "") {
      socket.emit('getQuest', {index, roomId});
      socket.on('getQuest', (data:any) => {
        if (!data) {
          navigation.navigate('PodiumWinner' as never);
          return;
        }
        setQuestion(data)
      })

      socket.on('answer', (data:any) => {
        setUserAnswer(data)
        console.log("Updated answer: ", data)
      })

      socket.on('user', async (data) => {
        const token:any = await AsyncStorage.getItem('user')
        const decode = jwtDecode(token) as UserInfo
        const res = data.filter((user:any) => user.name ==  decode.name)[0]

        setUser((prev) => ({ ...prev, score: res.score }))
      })
    }
  }, [isFocused, roomId]);

  return {
    socket,
    roomId,
    userAnswer,
    user,
    selectOption,
    question,
    index,
    choices,
    handleAnswer,
  };

  // const socket = initializeSocket();
  // const navigation = useNavigation();
  // const isFocused = useIsFocused();
  // const [user, setUser] = useState<UserInfo & { score: number }>({
  //   email: "",
  //   name: "",
  //   avatar: "",
  //   id: 0,
  //   score: 0,
  //   diamond: 0,
  // });

  // const [selectOption, setSelectOption] = useState(null);
  // const [question, setQuestion] = useState<Questions>({
  //   image_question: "...",
  //   A: "",
  //   B: "",
  //   C: "",
  //   D: "",
  //   answer: "",
  //   time: 0.01,
  // });

  // const [index, setIndex] = useState(0);

  // const choices = ["A", "B", "C", "D"];

  // // async () => {
  // //     const token:any = await AsyncStorage.getItem("user")
  // //     const decode = await jwtDecode(token) as UserInfo
  // //     setUser((prev) => ({...prev, ...decode}))
  // // }

  // const handleAnswer = (selected: any) => {
  //   setSelectOption(selected);
  // };

  // useEffect(() => {
  //   if (question.time === 0) {
  //     setTimeout(() => {
  //       setIndex((prev) => prev + 1);
  //       socket.emit("getQuest", { index: index + 1 });
  //       if (selectOption == question.answer) {
  //         socket.emit("user", {
  //           score: 10,
  //         });
  //       }
  //     }, 3000);
  //   }
  // }, [question.time]);

  // useEffect(() => {
  //   socket.emit("getQuest", { index });
  //   socket.on("getQuest", (data) => {
  //     if (!data) {
  //       navigation.navigate("PodiumWinner" as never);
  //     }
  //     setQuestion(data);
  //   });

  //   socket.on("user", async (data) => {
  //     const token: any = await AsyncStorage.getItem("user");
  //     const decode = (await jwtDecode(token)) as UserInfo;
  //     const res = data.filter((user: any) => user.name === decode.name)[0];
  //     setUser((prev) => ({ ...prev, score: res.score }));
  //   });
  // }, [isFocused]);

  // return {
  //   user,
  //   selectOption,
  //   question,
  //   index,
  //   choices,
  //   handleAnswer,
  // };
}
