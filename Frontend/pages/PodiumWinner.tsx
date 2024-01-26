import LottieView from "lottie-react-native"
import React, { useEffect, useState } from "react"
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { initializeSocket } from "../utils/socket"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  avatar: string
  name: string
  diamond: string
  email: string
}

const PodiumWinner = () => {
  const socket = initializeSocket()
  const navigate = useNavigation()
  const [data, setData] = useState<any[]>([])
  const [roomId, setRoomId] = useState("")
  const token = localStorage.getItem("user") + ""
  const userToken = jwtDecode<DecodedToken>(token)
  const email = userToken.email
  console.log(email)
  console.log("info user:", data[0]?.email)

  const getRoomId = async () => {
    const roomId: any = await AsyncStorage.getItem("roomId")
    setRoomId(roomId)
  }

  useEffect(() => {
    getRoomId()
    socket.on("finish", async (user) => {
      const sorted = user.sort((a: any, b: any) => b.score - a.score)
      setData(sorted)
    })
  }, [roomId])

  useEffect(() => {
    if (data.length > 0) {
      console.log("data ada")
      if (data[0]?.email == email) {
        console.log("email sesuai ")
        ;(async () => {
          console.log("Yes you're the winner")
          try {
            const response = await axios.put(
              "https://92b308gx-50051.asse.devtunnels.ms/update-user?email=" +
                email
            )
            await AsyncStorage.removeItem("roomId")

            console.log("Diamonds awarded successfully:", response.data)
          } catch (error) {
            console.error("Error awarding diamonds:", error)
          }
        })()
      } else {
        console.log("User is not the winner")
      }
    }
  }, [data])
  const handleBackHome = () => {
    navigate.navigate("StartGame" as never)
  }

  const handleReplay = () => {
    socket.disconnect()
    navigate.navigate("FindMatch" as never)
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image style={styles.background} source={require("../assets/bg2.png")} />

      <View style={{ alignItems: "center", position: "absolute", top: 50 }}>
        {/* {data.length !== 0 &&
          data.map((user: any, index) => (
            <>
              {index === 0 && user.email == email ? (
                <Image
                  style={{ width: 420, height: 220 }}
                  source={require("../assets/image/congratulation.png")}
                />
              ) : (
                <Text style={{ color: "white", fontSize: 30 }}>
                  Better Luck Next Time
                </Text>
              )}
            </>
          ))} */}

        {data[0]?.email == email ? (
          <Image
            style={{ width: 420, height: 220 }}
            source={require("../assets/image/congratulation.png")}
          />
        ) : (
          <Image
            style={{ width: 420, height: 220, objectFit: "cover" }}
            source={require("../assets/image/gameover.png")}
          />
        )}

        {/* <Image
          style={{ width: 420, height: 220 }}
          source={require("../assets/image/congratulation.png")}
        /> */}
        <View style={{ alignItems: "center", position: "absolute", top: 80 }}>
          <LottieView
            source={require("../assets/lottivew/fireworks.json")}
            autoPlay
            loop
          />
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <View style={{ alignItems: "center", top: 180 }}>
          <Image
            style={{ width: 425, height: 400, position: "relative" }}
            source={require("../assets/image/awards.png")}
          />
        </View>
        {data.length !== 0 &&
          data.map((user: any, index) => (
            <View style={{ alignItems: "center", top: -100 }}>
              {/* win 2  */}
              {index > 0 && index < 2 && (
                <View
                  style={{
                    alignItems: "center",
                    top: -100,
                    marginLeft: -285,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      width: 120,
                      height: 120,
                      top: 50,
                    }}
                  >
                    <Image
                      source={user.avatar}
                      style={{
                        top: -60,
                        width: 120,
                        height: 120,
                      }}
                    />
                  </View>
                  <View style={{ margin: -100, top: 105 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      {user.name}
                      {user.email == email ? " (You)" : ""}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      {user.score}
                    </Text>
                  </View>
                </View>
              )}

              {/* win 1  */}
              {index == 0 && (
                <View
                  style={{
                    alignItems: "center",
                    top: 6,
                    marginLeft: 2,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      width: 120,
                      height: 120,
                      top: 10,
                    }}
                  >
                    <Image
                      source={user.avatar}
                      style={{
                        top: 10,
                        width: 140,
                        height: 140,
                      }}
                    />
                  </View>
                  <View style={{ margin: 0, top: 70 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      {user.name}
                      {user.email == email ? " (You)" : ""}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      {user.score}
                    </Text>
                  </View>
                </View>
              )}

              {/* win 3  */}
              {index > 1 && index < 3 && (
                <View
                  style={{
                    alignItems: "center",
                    top: -130,
                    marginLeft: 290,
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      width: 120,
                      height: 120,
                      top: 10,
                    }}
                  >
                    <Image
                      source={user.avatar}
                      style={{
                        top: 10,
                        width: 120,
                        height: 120,
                      }}
                    />
                  </View>
                  <View style={{ margin: 0, top: 30 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      {user.name}
                      {user.email == email ? " (You)" : ""}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      {user.score}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}

        <View style={styles.backButton}>
          <TouchableOpacity onPress={handleBackHome}>
            <LottieView
              source={require("../assets/lottivew/back.json")}
              autoPlay
              loop
            />
          </TouchableOpacity>
        </View>
        {/* <View>
          <TouchableOpacity onPress={handleReplay}>
            <LottieView
              source={require("../assets/lottivew/continuButton.json")}
              autoPlay
              loop
            />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  )
}

export default PodiumWinner
const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  optionButton: {
    flexDirection: "row",
    backgroundColor: "#bbb",
    textShadowColor: "black",
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
    width: 300,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 600,
    height: 100,
    width: 100,
    // left: -100,
  },
  optionText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 },
  },

  iconText: {
    width: 180,
    height: 180,
    marginRight: 5,
    position: "absolute",
    top: -55,
    left: -30,
    zIndex: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  nameText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "black",
    textShadowRadius: 2,
    textShadowOffset: { width: 1, height: 1 },
  },

  scoreText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  score: {
    marginRight: 5,
    position: "absolute",
    top: 10,
    left: 150,
    zIndex: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
})
