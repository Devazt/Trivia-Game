import LottieView from "lottie-react-native"
import React, { useEffect, useState } from "react"
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { initializeSocket } from "../utils/socket"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  email: string
}
const PodiumWinner = () => {
  const socket = initializeSocket()
  const navigate = useNavigation()
  const [data, setData] = useState<any>([])
  const [roomId, setRoomId] = useState("")
  const token = localStorage.getItem("user") + ""
  const email = jwtDecode<DecodedToken>(token)
  console.log("info user:", data)

  const getRoomId = async () => {
    const roomId: any = await AsyncStorage.getItem("roomId")
    setRoomId(roomId)
  }

  useEffect(() => {
    getRoomId()
    socket.on("finish", async (user) => {
      setData(user.sort((a: any, b: any) => b.score - a.score))

      await AsyncStorage.removeItem("roomId")
    })
    if (data[0].email === email)
      async () => {
        try {
          const response = await axios.put(
            "https://92b308gx-50051.asse.devtunnels.ms/update-user",
            { email }
          )

          console.log("Diamonds awarded successfully:", response.data)
        } catch (error) {
          console.error("Error awarding diamonds:", error)
        }
      }
  }, [roomId])
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image style={styles.background} source={require("../assets/bg2.png")} />

      <View style={{ alignItems: "center" }}>
        <View style={{ alignItems: "center", position: "absolute", top: 50 }}>
          <Image
            style={{ width: 420, height: 220 }}
            source={require("../assets/image/congratulation.png")}
          />
          <View style={{ alignItems: "center", position: "absolute", top: 80 }}>
            <LottieView
              source={require("../assets/lottivew/fireworks.json")}
              autoPlay
              loop
            />
          </View>
        </View>

        <View style={{ alignItems: "center", position: "relative", top: 8 }}>
          <Image
            style={{ width: 425, height: 400, position: "relative" }}
            source={require("../assets/image/awards.png")}
          />
        </View>
        {data.length !== 0 &&
          data.map((user: any, index: any) => (
            <View style={{ alignItems: "center", top: -200 }}>
              {/* win 2  */}
              {index > 0 && index < 2 && (
                <View
                  style={{
                    alignItems: "center",
                    top: -130,
                    marginLeft: -285,
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
                  <View style={{ margin: -100, top: 130 }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      {user.name}
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
          <TouchableOpacity
            onPress={() => navigate.navigate("StartGame" as never)}
          >
            <LottieView
              source={require("../assets/lottivew/back.json")}
              autoPlay
              loop
            />
          </TouchableOpacity>
        </View>
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
