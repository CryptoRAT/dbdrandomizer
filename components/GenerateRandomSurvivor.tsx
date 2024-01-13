import React, { useState, useEffect } from "react";
import {View, Text, ScrollView, StyleSheet, SafeAreaView} from "react-native";
import axios from "axios";
import FastImage from "react-native-fast-image";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {REACT_APP_DBD_RANDOMIZER_SERVICE_URL} from '@env'

interface Survivor {
    name: string;
    image_path: string;
}

interface Perk {
    name: string;
    type: string;
    owner: string;
    image_path: string;
}



const GenerateRandomSurvivor: React.FC = () => {
    const serviceUrl = REACT_APP_DBD_RANDOMIZER_SERVICE_URL;
    const [survivors, setSurvivors] = useState<Survivor[]>([]);
    const [survivorPerks, setSurvivorPerks] = useState<Perk[][]>([]);
    const [survivorImagePath, setSurvivorImagePath] = useState<string>(require('../assets/survivors/ace_visconti.jpg'));
    const [survivorName, setSurvivorName] = useState<string>("Ace Visconti");
    const [defaultPerks, setDefaultPerks] = useState<Perk[]>([
        {
            name: "Dramaturgy",
            type: "Survivor",
            owner: "Nicolas Cage",
            image_path: require('../assets/perks/dramaturgy.webp') as string,
        },
        {
            name: "Adrenaline",
            type: "Survivor",
            owner: "Meg Thomas",
            image_path: require('../assets/perks/adrenaline.webp') as string,
        },
        {
            name: "Vigil",
            type: "Survivor",
            owner: "Quintin Smith",
            image_path: require('../assets/perks/vigil.webp') as string,
        },
        {
            name: "Calm-Spirit",
            type: "Survivor",
            owner: "Jake Park",
            image_path: require('../assets/perks/calm_spirit.webp') as string,
        },
    ]);

    // const [randomSurvivor, setRandomSurvivor] = useState<Survivor | null>({
    //     id: 1,
    //     name: survivorName,
    //     image_path: survivorImagePath as string,
    // });
    // Function to convert survivor name to image path
    const getSurvivorImagePath = (name: string) => {
        // Remove double quotes from the name, replace spaces with underscores, and convert to lowercase
        let generatedImageFileName = name.replace(/"/g, '').toLowerCase().replace(/\s/g, '_');
        return "${serviceUrl}/static/survivors/${generatedImageFileName}.jpg";

    };
    const fetchRandomSurvivor = async () => {
        // Implement your API call logic here
        // Example:
        const newSurvivor = await getRandomSurvivor();
        const newPerks = await getRandomSurvivorPerks();

        // Ensure newSurvivor is of type Survivor
        if (newSurvivor && isSurvivor(newSurvivor)) {
            setSurvivors(prev => [...prev, newSurvivor]);
        } else {
            console.log("newSurvivor: " + newSurvivor);
            console.log("isSurvivor(newSurvivor)" + isSurvivor(newSurvivor));
        }

        // Ensure newPerks is an array of Perks
        if (newPerks && Array.isArray(newPerks) && newPerks.every(isPerk)) {
            setSurvivorPerks(prev => [...prev, newPerks]);
        }
    };

// Type guard for Survivor
    function isSurvivor(object: any): object is Survivor {
        console.log("survivor object: " + JSON.stringify(object));
        return 'name' in object && 'image_path' in object;
    }

// Type guard for Perk
    function isPerk(object: any): object is Perk {
        console.log("perk object: " + JSON.stringify(object));
        return 'name' in object && 'image_path' in object && 'type' in object && 'owner' in object;
    }


    const [randomSurvivorPerks, setRandomSurvivorPerks] = useState<Perk[]>(defaultPerks);
    const [randomSurvivor, setRandomSurvivor] = useState<Survivor>({
        name: survivorName,
        image_path: survivorImagePath,
    });

    const getRandomSurvivor = async (): Promise<Survivor | undefined | null> => {
        try {
            console.log("Entering getRandomSurvivor");
            const url = `${serviceUrl}api/survivor/random/`;
            console.log("Request URL:", url);

            const response = await axios.post(url, { action: "random" }, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {},
            });

            console.log("Response Data:", response.data);

            const data = Array.isArray(response.data) ? response.data[0] : response.data;

            if (!data || typeof data !== 'object') {
                // Data is not in expected format
                return null;
            }

            // Generate the image path dynamically based on the survivor's name
            const survivorImagePath = getSurvivorImagePath(data.name);

            const survivorData: Survivor = {
                ...data,
                image_path: survivorImagePath,
            };

            console.log("Updated State with Survivor Data:", survivorData);
            console.log("Leaving getRandomSurvivor");

            return survivorData;
        } catch (error) {
            console.error("Error in getRandomSurvivor:", error);
            return undefined; // or return null, depending on your error handling logic
        }
    };


    const getRandomSurvivorPerks = async (): Promise<Perk[] | undefined | null> => {
        try {
            console.log("Entering getRandomSurvivorPerks");
            const url = `${serviceUrl}api/perk/survivor/random/`;
            console.log("Request URL:", url);

            const response = await axios.post(url);

            console.log("Response Data:", response.data);

            if (!Array.isArray(response.data)) {
                // Data is not in the expected array format
                return null;
            }

            const perksData: Perk[] = response.data.map(perk => {
                // Map and transform the data if needed, or just return perk
                return perk;
            });

            console.log("Updated State with Perks Data:", perksData);
            console.log("Leaving getRandomSurvivorPerks");

            return perksData;
        } catch (error) {
            console.error("Error in getRandomSurvivorPerks:", error);
            return undefined; // or return null, depending on your error handling logic
        }
    };

    const renderSwipeRightActions = () => {
        console.log("Swiped Right");
        fetchRandomSurvivor();
    };

    useEffect(() => {
            fetchRandomSurvivor();
    }, []); // Run once when the component mounts


    return (
        <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                {survivors.length > 0 && (
                    <>
                        <Text style={styles.cardTitle}>{survivors[survivors.length - 1].name}</Text>
                        <FastImage
                            source={{ uri: survivors[survivors.length - 1].image_path } || 'https://via.placeholder.com/150'}
                            style={styles.cardImage}
                            onError={(e) => console.log("Image loading error:", e.nativeEvent.error)}
                        />
                    </>
                )}
                {survivorPerks.length > 0 && (
                    <ScrollView style={styles.perksContainer}>
                        {survivorPerks[survivorPerks.length - 1].map((perk, index) => (
                            <View key={index} style={styles.perk}>
                                <FastImage
                                    source={{ uri: perk.image_path }}
                                    style={styles.perkImage}
                                />
                                <Text style={styles.perkText}>{perk.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </GestureHandlerRootView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8,
    },
    cardImage: {
        width: 150,
        height: 150,
        resizeMode: "cover",
        borderRadius: 8,
    },
    perksContainer: {
        marginTop: 8,
    },
    perk: {
        flexDirection: "column",
        alignItems: "center",
        marginTop: 8,
    },
    perkImage: {
        width: 80, // Adjust the size as needed
        height: 80, // Adjust the size as needed
        resizeMode: "cover",
        borderRadius: 8,
    },
    perkText: {
        fontSize: 16,
    },
});

export default GenerateRandomSurvivor;
