import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native"

import { StatusBar } from "expo-status-bar"
import { FaEdit } from "react-icons/fa"
import React, { useEffect, useState } from "react"
import { FontAwesome } from "@expo/vector-icons"
import { jwtDecode } from "jwt-decode"
import { API } from "../utils/API"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as WebBrowser from "expo-web-browser"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { Alert } from "react-native"
import LottieView from "lottie-react-native"
import { initializeSocket } from "../utils/socket"
interface DecodedToken {
  avatar: string
  name: string
  diamond: string
  email: string
}

interface DiamondOption {
  amount: number
  image: string
  price: number
  id: string
}

interface AvatarOption {
  secureurl: string
  price: any
  name: string
  purchased: boolean
  id: string
}

const StartGame = () => {
  const token = localStorage.getItem("user") + ""
  const { avatar, name, diamond } = jwtDecode<DecodedToken>(token)
  const [isModalVisible, setModalVisible] = useState(false)
  const [isModalDiamond, setModalDiamond] = useState(false)
  const [avatarUser, setAvatarUser] = useState({ avatar })
  const [diamondOptions, setDiamondOptions] = useState<DiamondOption[]>([])
  const [avatarOptions, setAvatarOptions] = useState<AvatarOption[]>([])
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption | null>(
    null
  )
  const [selectedDiamond, setSelectedDiamond] = useState<DiamondOption | null>(
    null
  )
  const initialUserDiamond = parseInt(diamond, 10)
  const [userDiamond, setUserDiamond] = useState(initialUserDiamond)

  const navigate = useNavigation()
  const isFocused = useIsFocused()

  const toggleModalDiamond = () => {
    setModalDiamond(!isModalDiamond)
  }
  const toggleProfileEdit = () => {
    setModalVisible(!isModalVisible)
  }

  const socket = initializeSocket()

  const clearLobby = async () => {
    await AsyncStorage.removeItem("roomId")
  }

  useEffect(() => {
    clearLobby()
    socket.emit("clear", true)
  }, [isFocused])

  useEffect(() => {
    const fetchDiamondOptions = async () => {
      try {
        const response = await API.get("/api/v1/get-diamonds")

        setDiamondOptions(response.data.data)
      } catch (error) {
        console.error("Error fetching diamond options:", error)
      }
    }

    fetchDiamondOptions()
  }, [])

  useEffect(() => {
    const fetchAvatarOptions = async () => {
      try {
        const token = localStorage.getItem("user") || ""
        const { email } = jwtDecode<DecodedToken>(token)
        const userResponse = await API.get("/api/v1/get-user", {
          params: { email },
        })

        const purchasedAvatars = userResponse.data.data.purchasedavatars

        const avatarsResponse = await API.get("/api/v1/get-avatars")
        const allAvatars = avatarsResponse.data.data

        const purchasedAvatarIds = purchasedAvatars.map(
          (purchasedAvatar: AvatarOption) => purchasedAvatar.id
        )

        const updatedAvatarOptions = allAvatars.map((item: AvatarOption) => {
          const isPurchased = purchasedAvatarIds.includes(item.id)
          const price = isPurchased ? "Purchased" : item.price
          return {
            ...item,
            purchased: isPurchased,
            price,
          }
        })

        setAvatarOptions(updatedAvatarOptions)

        setAvatarUser({
          ...avatarUser,
          avatar: userResponse.data.data.avatar || "",
        })

        setUserDiamond(userResponse.data.data.diamond || 0)
      } catch (error) {
        console.error("Error fetching avatar options:", error)
      }
    }

    fetchAvatarOptions()
  }, [])

  const handleBuyAvatar = async (selectedItem: AvatarOption | null) => {
    if (selectedItem) {
      console.log("Selected Avatar:", selectedItem)

      const avatarPrice = selectedItem.price
      console.log("Avatar price:", avatarPrice)

      setAvatarOptions((prevOptions) =>
        prevOptions.map((item) =>
          item.secureurl === selectedItem.secureurl
            ? { ...item, purchased: true }
            : item
        )
      )

      if (avatarPrice == "Purchased" || avatarPrice == 0) {
        try {
          const updateAvatarFormData = new FormData()
          updateAvatarFormData.append("avatar", selectedItem.secureurl)
          const responseUpdateAvatar = await API.patch(
            "/api/v1/update-user",
            updateAvatarFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          )

          const newToken = responseUpdateAvatar.data.data.token

          localStorage.setItem("user", newToken)
          setUserDiamond((prevDiamond) => {
            const priceForDiamond =
              avatarPrice === "Purchased" ? 0 : avatarPrice
            const newDiamond = isNaN(prevDiamond)
              ? 0
              : prevDiamond - priceForDiamond
            return newDiamond
          })
          setAvatarUser({
            ...avatarUser,
            avatar: selectedItem.secureurl,
          })
          toggleProfileEdit()
        } catch (error) {
          console.error("Error updating avatar:", error)
        }
      }
      if (avatarPrice != null && userDiamond >= avatarPrice) {
        try {
          const formData = new FormData()
          formData.append("name", selectedItem.name)
          const response = await API.post("/api/v1/buy-avatar", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
          console.log("Response:", response)

          const updateAvatarFormData = new FormData()
          updateAvatarFormData.append("avatar", selectedItem.secureurl)
          const responseUpdateAvatar = await API.patch(
            "/api/v1/update-user",
            updateAvatarFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          )

          const newToken = responseUpdateAvatar.data.data.token

          localStorage.setItem("user", newToken)
          setUserDiamond((prevDiamond) => {
            const newDiamond = isNaN(prevDiamond)
              ? 0
              : prevDiamond - avatarPrice
            return newDiamond
          })
          setAvatarUser({
            ...avatarUser,
            avatar: selectedItem.secureurl,
          })

          try {
            await AsyncStorage.setItem("avatar", selectedItem.secureurl)
            await AsyncStorage.setItem(
              "diamond",
              (userDiamond - avatarPrice).toString()
            )
          } catch (error) {
            console.error("Error saving to AsyncStorage:", error)
          }

          toggleProfileEdit()
        } catch (error) {
          console.error("Error buying avatar:", error)
        }
      } else {
        Alert.alert("Error", "Diamond not enough")
      }
    }
  }

  const handleBuyDiamond = async (obj: DiamondOption) => {
    if (selectedDiamond) {
      console.log("Selected Diamond:", selectedDiamond)
    }
    try {
      const token = await AsyncStorage.getItem("user")
      const response = await API.post(
        "/api/v1/buy-diamond",
        {
          amount: obj.price,
          item_id: obj.id,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      console.log("Buy Diamond Response:", response.data)

      WebBrowser.openBrowserAsync(response.data.data.url)
      setModalDiamond(false)
    } catch (err) {
      console.log("Error Topup", err)
    }
  }

  const handleStartGame = () => {
    navigate.navigate("FindMatch" as never)
  }

  return (
    <View style={styles.container}>
      <Image style={styles.background} source={require("../assets/bg2.png")} />
      <Image style={styles.logo1} source={require("../assets/logo1.png")} />
      <StatusBar style="auto" />
      <View style={styles.diamondContainer}>
        <View style={styles.diamondButton}>
          <Text style={styles.diamondText}>{userDiamond}</Text>
        </View>

        <TouchableOpacity onPress={toggleModalDiamond}>
          <Image
            style={styles.vectordiamond}
            source={require("../assets/adddiamondpng.png")}
          />
        </TouchableOpacity>
        <View style={styles.diamond}>
          <LottieView
            source={require("../assets/lottivew/diamond.json")}
            autoPlay
            loop
          />
        </View>
      </View>
      <View>
        <Image style={styles.avatar} source={{ uri: avatarUser.avatar }} />
        <TouchableOpacity style={styles.edit} onPress={toggleProfileEdit}>
          <FaEdit />
        </TouchableOpacity>
        <Text style={styles.textup}>Hello, {name}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text} onPress={handleStartGame}>
          Play Game
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalDiamond}
        onRequestClose={toggleModalDiamond}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={toggleModalDiamond}
            >
              <FontAwesome
                style={styles.buttonCloseText}
                name="times"
                size={24}
                color="black"
                width={100}
              />
            </TouchableOpacity>

            <View style={styles.modalDiamond}>
              {diamondOptions.map((option, amount) => (
                <View key={amount} style={styles.rowContainer}>
                  <Text style={styles.listDiamond}>{option.amount}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDiamond(option)
                      console.log("Selected Diamond:", option)
                    }}
                  >
                    <Image
                      style={styles.imageDiamondPrice}
                      source={{ uri: option.image }}
                    />
                    <Text style={styles.PriceDiamond}>Rp. {option.price}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View>
              <TouchableOpacity
                style={styles.buttondiamond}
                onPress={() =>
                  selectedDiamond && handleBuyDiamond(selectedDiamond)
                }
              >
                <Text style={styles.textdiamond}>Buy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleProfileEdit}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={toggleProfileEdit}
            >
              <FontAwesome
                style={styles.buttonCloseText}
                name="times"
                size={24}
                color="black"
                width={100}
              />
            </TouchableOpacity>
            <ScrollView>
              <View style={styles.modalAvatar}>
                {avatarOptions.map((item) => (
                  <View key={item.secureurl} style={styles.viewAvatar}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedAvatar(item)
                        console.log(item)
                      }}
                    >
                      <Image
                        style={styles.imageAvatar}
                        source={{ uri: item.secureurl }}
                      />
                      <Text style={styles.priceDiamondAvatar}>
                        {item.price === "Purchased"
                          ? "Purchased"
                          : item.price === 0
                          ? "Free"
                          : `${item.price} 💎`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View>
              <TouchableOpacity
                style={styles.buttondiamond}
                onPress={() => handleBuyAvatar(selectedAvatar)}
              >
                <Text style={styles.textdiamond}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Image style={styles.artist} source={require("../assets/artist.png")} />
    </View>
  )
}

export default StartGame

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  logo1: {
    width: 230,
    height: 230,
    position: "relative",
    marginTop: -280,
    marginRight: 200,
  },

  diamondContainer: {
    position: "absolute",
    top: 20,
    marginLeft: 280,
  },
  vectordiamond: {
    width: 30,
    height: 30,
    top: -21,
    marginLeft: 65,
  },
  diamond: {
    width: 30,
    height: 30,
    top: -57,
    marginLeft: -11,
  },
  diamondButton: {
    backgroundColor: "#000000",
    padding: 10,
    width: 80,
    height: 15,
    borderRadius: 17,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  diamondText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },

  //set diamond end
  textup: {
    fontSize: 20,
    marginBottom: 10,
    top: 5,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#5ce1e6",
    padding: 10,
    width: 300,
    height: 50,
    borderRadius: 10,
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    color: "#F2F2F2",
    position: "relative",
  },
  text: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    alignItems: "center",
    marginLeft: 10,
    alignContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 2,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 40,
    marginBottom: 5,
  },
  edit: {
    position: "absolute",
    top: 120,
    left: 130,
    fontSize: 30,
    color: "white",
  },
  artist: {
    position: "absolute",
    width: 430,
    height: 190,
    marginTop: "132%",
  },

  // modal edit start
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "black",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    height: 480,
    width: 400,
  },
  modalText: {
    fontSize: 18,

    marginBottom: 20,
  },
  buttonClose: {
    padding: 1,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
    height: 30,
    width: 30,
    marginTop: -10,
    marginLeft: 340,
  },
  buttonCloseText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 26,
  },

  container1: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  listDiamond: {
    color: "white",
    fontSize: 15,
    // top: -10,
    // left: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  imageDiamondPrice: {
    width: 90,
    height: 90,
    left: 10,
    top: 2,
  },
  imageAvatar: {
    width: 120,
    height: 120,
    top: 2,
    right: 5,
    scrollable: true,
  },
  PriceDiamond: {
    color: "white",
    fontSize: 15,
    top: 95,
    // textAlign: "center",
    left: 11,
    fontWeight: "bold",
    position: "absolute",
  },
  priceDiamondAvatar: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  imageDiamond: {
    width: 20,
    height: 20,
    top: 2,
  },
  rowContainer: {
    width: 110,
    height: 110,
    borderRadius: 5,
    marginBottom: 60,
    backgroundColor: "black",
  },
  viewAvatar: {
    width: 110,
    height: 110,
    borderRadius: 5,
    marginBottom: 60,
    backgroundColor: "black",
  },
  modalDiamond: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginTop: 20,
  },

  modalAvatar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginTop: 20,
    // scrollable: true,
    // height: 110,
  },
  buttondiamond: {
    display: "flex",
    backgroundColor: "#864AF9",
    padding: 10,
    borderRadius: 17,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textdiamond: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    alignItems: "center",
    marginLeft: 10,
    alignContent: "center",
  },
  purchasedText: {
    position: "absolute",
    top: 1,
    left: 5,
    backgroundColor: "green",
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    padding: 5,
    borderRadius: 5,
    zIndex: 100,
  },
})
