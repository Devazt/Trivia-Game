import LottieView from "lottie-react-native"
import React, { useEffect, useState } from "react"
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { initializeSocket } from "../utils/socket"
const TestPodium = () => {
  const socket = initializeSocket()
  const navigate = useNavigation()

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image style={styles.background} source={require("../assets/bg2.png")} />

      
        <View style={{ alignItems: "center", position: "absolute", top: 50 }}>
          <Image
            style={{ width: 420, height: 220, }}
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
        <View style={{ alignItems: "center" }}>
        <View style={{ alignItems: "center", top: 180 }}>
          <Image
            style={{ width: 425, height: 400, position: "relative" }}
            source={require("../assets/image/awards.png")}
          />
        </View>
            <View style={{ alignItems: "center", top: -100 }}>
              {/* win 2  */}
                <View
                  style={{
                    alignItems: "center",
                    top: 45,
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
                      style={{
                        top: 10,
                        width: 120,
                        height: 120,
                    }}
                    source={require("../assets/avatar1.png")}
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
                     kang
                    </Text>
                    <Text 
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      1222
                    </Text>
                  </View>
                </View>

              {/* win 1  */}
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
                      style={{
                        top: 10,
                        width: 140,
                        height: 140,
                      }}
                      source={require("../assets/avatar1.png")}
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
                      vsdvsdcvs
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      223132
                    </Text>
                  </View>
                </View>

              {/* win 3  */}
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
                      style={{
                        top: 10,
                        width: 120,
                        height: 120,
                      }}
                      source={require("../assets/avatar1.png")}
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
                     sdfsd
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      22233
                    </Text>
                  </View>
                </View>
            </View>

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

export default TestPodium
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
  });
